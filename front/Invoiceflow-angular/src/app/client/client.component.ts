import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClientService } from './client.service';
import { CLIENT } from '../interface/interface';

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ClientComponent implements OnInit {
  clients: CLIENT[] = [];
  isModalOpen: boolean = false;
  clientForm!: FormGroup;
  edit: boolean = false;
  client: CLIENT | null = null;
  submitted: boolean = false;

  // FormControl pour la recherche côté serveur
  searchControl: FormControl = new FormControl('');

  // Variables pour les alertes
  successMessage: string | null = null;
  errorMessage: string | null = null;
  alertTimeout: any;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();

    // Abonnement aux changements du champ de recherche
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      console.log('[searchControl] Valeur saisie :', searchTerm);
      if (searchTerm && searchTerm.length >= 3) {
        console.log('[searchControl] >= 3 caractères, on lance searchClients()');
        this.clientService.searchClients(searchTerm).subscribe({
          next: (data: CLIENT[]) => {
            console.log('[searchClients] Résultat :', data);
            this.clients = data;
          },
          error: (error) => {
            console.error('[searchClients] Erreur lors de la recherche', error);
            this.setErrorMessage("Erreur lors de la recherche.");
          }
        });
      } else {
        console.log('[searchControl] < 3 caractères, on recharge la liste complète');
        this.loadClients();
      }
    });
  }

  // Initialisation du formulaire
  initForm(): void {
    this.clientForm = this.fb.group({
      id: [null],
      typeClient: ['', Validators.required],
      referenceClient: [{ value: '', disabled: true }],
      nomEntreprise: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      numeroSiret: ['', Validators.pattern(/^\d{14}$/)],
      numeroTva: ['', Validators.pattern(/^FR\d{2}\d{9}$/)],
      telephone: [''],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      pays: ['', Validators.required],
    });
  }

  // Charger la liste complète des clients
  loadClients(): void {
    console.log('[loadClients] Récupération de tous les clients...');
    this.clientService.getClients().subscribe({
      next: (data: CLIENT[]) => {
        console.log('[loadClients] Succès, clients chargés :', data);
        this.clients = data;
      },
      error: (error) => {
        console.error('[loadClients] Erreur lors du chargement des clients', error);
        this.setErrorMessage("Erreur lors du chargement des clients.");
      }
    });
  }

  // Ouvrir la modale d'ajout
  openFormAddClient(): void {
    this.isModalOpen = true;
    this.edit = false;
    this.client = null;
    // Calculer la référence suivante
    this.clientForm.patchValue({ referenceClient: this.getNextReference() });
    this.closeAlert();
  }

  // Fermer la modale et réinitialiser le formulaire
  closeModal(): void {
    this.isModalOpen = false;
    this.clientForm.reset();
    this.edit = false;
    this.client = null;
  }

  // Ajouter un client
  submitClient(): void {
    this.submitted = true;
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.setErrorMessage("Veuillez corriger les erreurs du formulaire client.");
      return;
    }
    const formValues = this.clientForm.getRawValue();
    console.log('[submitClient] Formulaire valide, envoi :', formValues);

    this.clientService.addClient(formValues).subscribe({
      next: (clientAjoute: CLIENT) => {
        console.log('[submitClient] Client ajouté avec succès :', clientAjoute);
        this.clients = [...this.clients, clientAjoute];
        this.closeModal();
        this.loadClients();
        this.submitted = false;
        this.setSuccessMessage("Client ajouté avec succès.");
      },
      error: (error) => {
        console.error("[submitClient] Erreur lors de l'ajout du client", error);
        this.setErrorMessage("Erreur lors de l'ajout du client.");
      }
    });
  }

  // Ouvrir la modale en mode édition
  ouvrirModalEdition(id: number): void {
    console.log('[ouvrirModalEdition] Chargement client ID =', id);
    this.clientService.getClientById(id).subscribe({
      next: (client: CLIENT) => {
        if (client) {
          console.log('[ouvrirModalEdition] Client récupéré :', client);
          this.clientForm.patchValue(client);
          this.edit = true;
          this.client = client;
          this.isModalOpen = true;
          this.closeAlert();
        }
      },
      error: (error) => {
        console.error('[ouvrirModalEdition] Erreur lors du chargement du client', error);
        this.setErrorMessage("Erreur lors du chargement du client.");
      }
    });
  }

  // Modifier un client
  modifierClient(): void {
    if (!this.clientForm.valid) {
      this.clientForm.markAllAsTouched();
      this.setErrorMessage("Veuillez corriger les erreurs du formulaire client.");
      return;
    }
    const clientData = this.clientForm.getRawValue();
    console.log('[modifierClient] Envoi des données :', clientData);

    this.clientService.editClient(clientData).subscribe({
      next: () => {
        console.log('[modifierClient] Modification réussie');
        this.closeModal();
        this.loadClients();
        this.setSuccessMessage("Client modifié avec succès.");
      },
      error: (err) => {
        console.error('[modifierClient] Erreur lors de la modification du client', err);
        this.setErrorMessage("Erreur lors de la modification du client.");
      }
    });
  }

  // Supprimer un client
  deleteClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      console.log('[deleteClient] Suppression du client ID =', id);
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          console.log('[deleteClient] Suppression réussie');
          this.loadClients();
          this.setSuccessMessage("Client supprimé avec succès.");
        },
        error: (err) => {
          console.error('[deleteClient] Erreur lors de la suppression du client', err);
          this.setErrorMessage("Erreur lors de la suppression du client.");
        }
      });
    }
  }

  trackById(index: number, client: CLIENT): number {
    return client.id;
  }

  getNextReference(): number {
    return this.clients.length + 1;
  }

  // Méthodes pour la gestion des alertes

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
