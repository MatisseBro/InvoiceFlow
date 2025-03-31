import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../produit/produit.service';
import { ClientService } from '../client/client.service';
import { FactureService } from '../services/facture.service';
import { CLIENT } from '../interface/interface';

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
  clients: CLIENT[] = [];
  clientInfos: CLIENT | null = null;

  numeroFacture: string = '...';

  tauxTVA: number[] = [0, 5, 10, 20];
  modesPaiement: string[] = [
    'Paiement immédiat',
    'Paiement à réception',
    'Paiement à 30 jours',
    'Paiement à 45 jours',
    'Paiement à 60 jours'
  ];

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private clientService: ClientService,
    private factureService: FactureService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProduits();
    this.loadClients();
    this.getNextFactureNumber();
  }

  // 🧾 Initialisation du formulaire de facture
  initForm(): void {
    this.factureForm = this.fb.group({
      clientId: ['', Validators.required],
      iban: [''],
      swift: [''],
      bankName: [''],
      modePaiement: [''],
      produitsFacture: this.fb.array([])
    });
  }

  // 📦 Récupère la liste des produits
  loadProduits(): void {
    this.produitService.getProduits().subscribe(data => this.produits = data);
  }

  // 📇 Récupère la liste des clients
  loadClients(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
  }

  // 📊 Récupération du prochain numéro de facture
  getNextFactureNumber(): void {
    this.factureService.getNombreFactures().subscribe(count => {
      const next = count + 1;
      this.numeroFacture = 'N°: ' + next.toString().padStart(5, '0');
    });
  }

  // 📂 Getter FormArray des produits
  get produitsFacture(): FormArray {
    return this.factureForm.get('produitsFacture') as FormArray;
  }

  // 📂 Récupère le FormGroup d’un produit à l’index donné
  getProduitFormGroup(index: number): FormGroup {
    return this.produitsFacture.at(index) as FormGroup;
  }

  // ➕ Ajoute une ligne produit vide
  ajouterLigneProduit(): void {
    this.produitsFacture.push(this.fb.group({
      id: '',
      nom: '',
      quantite: 1,
      prixHT: 0,
      tva: 20,
      prixTTC: 0,
      total: 0
    }));
  }

  // 🔄 Met à jour les champs prix quand un produit est sélectionné
  mettreAJourProduit(index: number): void {
    const produitId = this.produitsFacture.at(index).get('id')?.value;
    const produit = this.produits.find(p => p.id == produitId);

    if (produit) {
      const tva = this.produitsFacture.at(index).get('tva')?.value || 20;
      const quantite = this.produitsFacture.at(index).get('quantite')?.value || 1;
      const prixTTC = this.arrondir(produit.prixHT * (1 + tva / 100));
      const total = this.arrondir(prixTTC * quantite);

      this.produitsFacture.at(index).patchValue({
        nom: produit.nom,
        prixHT: produit.prixHT,
        prixTTC: prixTTC,
        total: total
      });
    }

    this.calculerTotal();
  }

  // ❌ Supprime une ligne produit
  supprimerProduit(index: number): void {
    this.produitsFacture.removeAt(index);
    this.calculerTotal();
  }

  // 🔁 Recalcule les totaux
  calculerTotal(): void {
    this.produitsFacture.controls.forEach(ctrl => {
      const form = ctrl as FormGroup;
      const quantite = form.get('quantite')?.value || 1;
      const prixHT = form.get('prixHT')?.value || 0;
      const tva = form.get('tva')?.value || 20;

      const prixTTC = this.arrondir(prixHT * (1 + tva / 100));
      const total = this.arrondir(prixTTC * quantite);

      form.patchValue({ prixTTC, total }, { emitEvent: false });
    });
  }

  // 📉 Sous-total HT
  get sousTotal(): number {
    return this.arrondir(this.produitsFacture.value.reduce(
      (acc: number, p: any) => acc + (p.prixHT * p.quantite), 0));
  }

  // 📈 TVA totale
  get totalTVA(): number {
    return this.arrondir(this.produitsFacture.value.reduce(
      (acc: number, p: any) => acc + ((p.prixHT * p.quantite) * (p.tva / 100)), 0));
  }

  // 💰 Total TTC
  get total(): number {
    return this.arrondir(this.sousTotal + this.totalTVA);
  }

  // 🔢 Arrondi à 2 décimales
  arrondir(valeur: number): number {
    return Math.round(valeur * 100) / 100;
  }

  // 🧾 Lorsqu’un client est sélectionné
  onClientSelected(): void {
    const clientId = this.factureForm.get('clientId')?.value;
    if (!clientId) return;

    this.clientService.getClientById(clientId).subscribe(client => {
      this.clientInfos = client;
    });
  }
}