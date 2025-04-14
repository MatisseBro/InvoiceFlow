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

  // Variables pour afficher des alertes
  successMessage: string | null = null;
  errorMessage: string | null = null;
  alertTimeout: any;

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
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      console.log('[searchControl] Valeur saisie:', searchTerm);
      if (searchTerm && searchTerm.length >= 3) {
        // Recherche côté serveur
        this.produitService.searchProduits(searchTerm).subscribe({
          next: (data: PRODUIT[]) => {
            console.log('[searchProduits] Résultat:', data);
            this.produits = data;
          },
          error: (error) => {
            console.error('[searchProduits] Erreur lors de la recherche:', error);
            this.setErrorMessage("Erreur lors de la recherche.");
          }
        });
      } else {
        console.log('[searchControl] Moins de 3 caractères, rechargement complet.');
        this.loadProduits();
      }
    });
  }

  initForm(): void {
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

  calculerPrixHT(): void {
    const prixTTC = this.produitForm.get('prixTTC')?.value || 0;
    const tva = this.produitForm.get('tva')?.value || 0;
    if (tva > 0) {
      const prixHT = prixTTC / (1 + tva / 100);
      this.produitForm.patchValue({ prixHT: parseFloat(prixHT.toFixed(2)) });
    }
  }

  loadProduits(): void {
    console.log('[loadProduits] Chargement des produits...');
    this.produitService.getProduits().subscribe({
      next: (data: PRODUIT[]) => {
        console.log('[loadProduits] Produits chargés:', data);
        this.produits = data;
      },
      error: (error) => {
        console.error('[loadProduits] Erreur lors du chargement des produits:', error);
        this.setErrorMessage("Erreur lors du chargement des produits.");
      }
    });
  }

  ajouterProduit(): void {
    this.submitted = true;
    if (!this.produitForm.valid) {
      this.produitForm.markAllAsTouched();
      this.setErrorMessage("Le formulaire produit est invalide.");
      return;
    }
    const formValues = this.produitForm.getRawValue();
    console.log('[ajouterProduit] Envoi du produit:', formValues);

    this.produitService.addProduit(formValues).subscribe({
      next: (produitAjoute: PRODUIT) => {
        console.log('[ajouterProduit] Produit ajouté avec succès:', produitAjoute);
        this.produits = [...this.produits, produitAjoute];
        this.fermerModal();
        this.loadProduits();
        this.setSuccessMessage("Produit ajouté avec succès.");
      },
      error: (error) => {
        console.error("[ajouterProduit] Erreur lors de l'ajout du produit:", error);
        this.setErrorMessage("Erreur lors de l'ajout du produit.");
      }
    });
  }

  modifierProduit(): void {
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
        this.setSuccessMessage("Produit modifié avec succès.");
      },
      error: (err) => {
        console.error('[modifierProduit] Erreur lors de la modification du produit:', err);
        this.setErrorMessage("Erreur lors de la modification du produit.");
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
        this.setErrorMessage("Erreur lors du chargement du produit.");
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
          this.setSuccessMessage("Produit supprimé avec succès.");
        },
        error: (err) => {
          console.error('[deleteProduit] Erreur lors de la suppression du produit:', err);
          this.setErrorMessage("Erreur lors de la suppression du produit.");
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

  // Gestion des alertes
  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.successMessage = null;
      this.cdr.markForCheck();
    }, 5000);
  }

  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.errorMessage = null;
      this.cdr.markForCheck();
    }, 5000);
  }

  closeAlert(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }
}
