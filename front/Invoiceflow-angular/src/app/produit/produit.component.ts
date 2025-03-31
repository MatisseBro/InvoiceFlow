import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProduitService } from './produit.service';
import { PRODUIT } from '../interface/interface';

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
  // Utilisation d'un FormControl pour la recherche dynamique
  searchControl: FormControl = new FormControl('');
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

    // Abonnement aux changements du champ de recherche
    this.searchControl.valueChanges.pipe(
      debounceTime(300),          // Attendre 300 ms après la dernière frappe
      distinctUntilChanged()      // Ne déclencher que si la valeur change réellement
    ).subscribe((searchTerm: string) => {
      console.log('[searchControl] Valeur saisie:', searchTerm);
      if (searchTerm && searchTerm.length >= 3) {
        // Appel de la recherche côté serveur
        this.produitService.searchProduits(searchTerm).subscribe({
          next: (data: PRODUIT[]) => {
            console.log('[searchProduits] Résultat:', data);
            this.produits = data;
          },
          error: (error) => {
            console.error('[searchProduits] Erreur lors de la recherche:', error);
          }
        });
      } else {
        console.log('[searchControl] Moins de 3 caractères, rechargement complet.');
        this.loadProduits();
      }
    });
  }

  initForm() {
    this.produitForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      type: ['', Validators.required],
      unite: ['', Validators.required],
      prixTTC: [0, Validators.required],
      prixHT: [{ value: 0, disabled: true }, Validators.required],
      tva: [20, Validators.required],
      quantite: [0, Validators.required],
      description: [''],
      commentaire: ['']
    });

    // Mise à jour automatique du prix HT quand le prix TTC ou la TVA changent
    this.produitForm.get('prixTTC')?.valueChanges.subscribe(() => this.calculerPrixHT());
    this.produitForm.get('tva')?.valueChanges.subscribe(() => this.calculerPrixHT());
  }

  calculerPrixHT() {
    const prixTTC = this.produitForm.get('prixTTC')?.value || 0;
    const tva = this.produitForm.get('tva')?.value || 0;
    if (tva > 0) {
      const prixHT = prixTTC / (1 + tva / 100);
      // Mise à jour du champ en conservant deux décimales
      this.produitForm.patchValue({ prixHT: parseFloat(prixHT.toFixed(2)) });
    }
  }

  loadProduits() {
    console.log('[loadProduits] Chargement des produits...');
    this.produitService.getProduits().subscribe({
      next: (data: PRODUIT[]) => {
        console.log('[loadProduits] Produits chargés:', data);
        this.produits = data;
      },
      error: (error) => {
        console.error('[loadProduits] Erreur lors du chargement des produits:', error);
      }
    });
  }

  ajouterProduit() {
    this.submitted = true;
    if (!this.produitForm.valid) return;

    const formValues = this.produitForm.getRawValue();
    console.log('[ajouterProduit] Envoi du produit:', formValues);

    this.produitService.addProduit(formValues).subscribe({
      next: (produitAjoute: PRODUIT) => {
        console.log('[ajouterProduit] Produit ajouté avec succès:', produitAjoute);
        this.produits = [...this.produits, produitAjoute];
        this.fermerModal();
        this.loadProduits();
      },
      error: (error) => {
        console.error("[ajouterProduit] Erreur lors de l'ajout du produit:", error);
      }
    });
  }

  modifierProduit() {
    this.submitted = true;
    if (!this.produitForm.valid) {
      alert('Le formulaire est invalide.');
      return;
    }
    const produitData = this.produitForm.getRawValue();
    console.log('[modifierProduit] Envoi des données pour le produit ID:', produitData.id);

    this.produitService.editProduit(produitData).subscribe({
      next: () => {
        console.log('[modifierProduit] Produit modifié avec succès');
        this.fermerModal();
        this.loadProduits();
      },
      error: (err) => {
        console.error('[modifierProduit] Erreur lors de la modification du produit:', err);
      }
    });
  }

  ouvrirModalEdition(id: number): void {
    console.log('[ouvrirModalEdition] Chargement du produit ID:', id);
    this.produitService.getProduitById(id).subscribe({
      next: (produit: PRODUIT) => {
        if (produit) {
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
          this.edit = true;
          this.produit = produit;
          this.modalOuvert = true;
          console.log('[ouvrirModalEdition] Produit chargé:', produit);
        }
      },
      error: (error) => {
        console.error('[ouvrirModalEdition] Erreur lors du chargement du produit:', error);
      }
    });
  }

  deleteProduit(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      console.log('[deleteProduit] Suppression du produit ID:', id);
      this.produitService.deleteProduit(id).subscribe({
        next: () => {
          console.log('[deleteProduit] Produit supprimé');
          this.loadProduits();
        },
        error: (err) => {
          console.error('[deleteProduit] Erreur lors de la suppression du produit:', err);
        }
      });
    }
  }

  ouvrirModal(): void {
    this.modalOuvert = true;
  }

  fermerModal(): void {
    this.modalOuvert = false;
    this.produitForm.reset();
    this.edit = false;
    this.produit = null;
    this.submitted = false;
  }
}
