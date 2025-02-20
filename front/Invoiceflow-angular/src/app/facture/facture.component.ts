import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../produit/produit.service';

@Component({
  standalone: true,
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class FactureComponent implements OnInit {
  factureForm!: FormGroup;
  produits: any[] = [];
  tauxTVA: number[] = [0, 5, 10, 20];

  constructor(private fb: FormBuilder, private produitService: ProduitService) {}

  ngOnInit() {
    this.factureForm = this.fb.group({
      produitsFacture: this.fb.array([]) // Utilisation de FormArray pour stocker les produits
    });

    // Charger les produits disponibles
    this.produitService.getProduits().subscribe((data) => {
      this.produits = data;
    });
  }

  // Getter pour récupérer le FormArray
  get produitsFacture(): FormArray {
    return this.factureForm.get('produitsFacture') as FormArray;
  }

  // 🔥 Nouvelle méthode : Permet d'accéder aux FormGroup sans erreur
  getProduitFormGroup(index: number): FormGroup {
    return this.produitsFacture.at(index) as FormGroup;
  }

  // Ajouter un produit sélectionné à la facture
  ajouterProduit(event: any) {
    const produitId = event.target.value;
    const produit = this.produits.find(p => p.id == produitId);
    if (!produit) return;

    // Ajouter un nouveau produit au FormArray
    this.produitsFacture.push(this.fb.group({
      id: produit.id,
      nom: produit.nom,
      quantite: 1,
      prixHT: produit.prixHT,
      tva: 20,
      prixTTC: this.arrondir(produit.prixHT * 1.2),
      total: this.arrondir(produit.prixHT * 1.2)
    }));

    this.calculerTotal();
  }

  // Supprimer un produit de la facture
  supprimerProduit(index: number) {
    this.produitsFacture.removeAt(index);
    this.calculerTotal();
  }

  // Recalculer automatiquement les prix
  calculerTotal() {
    this.produitsFacture.controls.forEach(ctrl => {
      const produitForm = ctrl as FormGroup;
      const quantite = produitForm.get('quantite')?.value || 1;
      const prixHT = produitForm.get('prixHT')?.value || 0;
      const tva = produitForm.get('tva')?.value || 20;

      const prixTTC = this.arrondir(prixHT * (1 + tva / 100));
      const total = this.arrondir(prixTTC * quantite);

      produitForm.patchValue({ prixTTC, total }, { emitEvent: false });
    });
  }

  // 🔥 Calcul automatique des totaux dynamiques
  get sousTotal(): number {
    return this.arrondir(this.produitsFacture.value.reduce(
      (acc: number, p: { prixHT: number; quantite: number; }) => acc + (p.prixHT * p.quantite), 0));
  }

  get totalTVA(): number {
    return this.arrondir(this.produitsFacture.value.reduce(
      (acc: number, p: { prixHT: number; quantite: number; tva: number; }) => acc + ((p.prixHT * p.quantite) * (p.tva / 100)), 0));
  }

  get total(): number {
    return this.arrondir(this.sousTotal + this.totalTVA);
  }

  // Arrondir à 2 décimales
  arrondir(valeur: number): number {
    return Math.round(valeur * 100) / 100;
  }

  // Ouvrir la modale pour ajouter un produit
  ouvrirModalProduit() {
    console.log('Ouverture du modal pour ajouter un produit');
  }
}