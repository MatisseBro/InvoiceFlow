import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitService } from './produit.service';
import { PRODUIT } from '../interface/interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProduitComponent implements OnInit {
  produits: PRODUIT[] = [];
  modalOuvert = false;
  produitForm!: FormGroup;
  searchTerm: string = '';
  edit: boolean = false;
  produit: PRODUIT | null = null;
  submitted: boolean = false;

  constructor(
    private produitService: ProduitService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProduits();
  }

  initForm() {
    this.produitForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      type: ['', Validators.required],
      unite: ['', Validators.required],
      prixTTC: [0, Validators.required],
      prixHT: [{ value: 0, disabled: true }, Validators.required], // Désactivé pour empêcher la saisie manuelle
      tva: [20, Validators.required],
      quantite: [0, Validators.required],
      description: [''],
      commentaire: ['']
    });
  
    // Mise à jour automatique du prix HT quand Prix TTC ou TVA changent
    this.produitForm.get('prixTTC')?.valueChanges.subscribe(() => this.calculerPrixHT());
    this.produitForm.get('tva')?.valueChanges.subscribe(() => this.calculerPrixHT());
  }
  
  calculerPrixHT() {
    const prixTTC = this.produitForm.get('prixTTC')?.value || 0;
    const tva = this.produitForm.get('tva')?.value || 0;
  
    if (tva > 0) {
      const prixHT = prixTTC / (1 + tva / 100);
      this.produitForm.patchValue({ prixHT: prixHT.toFixed(2) });
    }
  }

  loadProduits() {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        console.log('Produits chargés avec succès', data);
        this.produits = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits', error);
      }
    });
  }

  ajouterProduit() {

    this.submitted = true;
    if (!this.produitForm.valid) return;

    const formValues = this.produitForm.getRawValue();

    this.produitService.addProduit(formValues).subscribe({
      next: (produitAjoute) => {
        console.log('Produit ajouté avec succès');
        this.produits = [...this.produits, produitAjoute];
        this.fermerModal();
        this.loadProduits();
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout du produit", error);
      }
    });
  }

  modifierProduit() {
  
    this.submitted = true;

    if (this.produitForm.valid) {
      const produitData = this.produitForm.getRawValue();
      console.log('ID du produit à modifier:', produitData.id);
  
      this.produitService.editProduit(produitData).subscribe({
        next: () => {
          this.fermerModal(); // Ferme le modal après modification réussie
          this.loadProduits(); // Recharge la liste des produits
        },
        error: (err) => { 
          console.error('Erreur lors de la modification du produit', err);
        }
      });
    } else {
      alert('Le formulaire est invalide.');
    }
  }
  
  produitsFiltres(): PRODUIT[] {
    return this.produits.filter(produit =>
      produit.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ouvrirModal(): void {
    this.modalOuvert = true;
  }

  fermerModal(): void {
    this.modalOuvert = false;
    this.produitForm.reset();
    this.edit = false; // Désactiver le mode édition
    this.produit = null;
    this.submitted = false; // Réinitialiser le formulaire
  }
  

  ouvrirModalEdition(id: number): void {
    this.produitService.getProduitById(id).subscribe({
      next: (produit) => {
        if (produit) {
          // Remplir le formulaire avec les valeurs du produit chargé
          this.produitForm.patchValue({
            id: produit.id,
            nom: produit.nom,
            type: produit.type,
            unite: produit.unite,
            prixTTC: produit.prixTTC,
            prixHT: produit.prixHT,
            tva: produit.tva,
            quantite: produit.quantite,
            description: produit.description,
            commentaire: produit.commentaire
          });
  
          // Activer le mode édition
          this.edit = true;
          this.produit = produit;
          this.modalOuvert = true;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du produit', error);
      }
    });
  }
  
deleteProduit(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => {
          this.loadProduits();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit', err);
        }
      });
    }
  }

}
