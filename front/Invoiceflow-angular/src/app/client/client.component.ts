import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ClientService } from './client.service';
import { CLIENT } from '../interface/interface';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
      debounceTime(300),          // Attendre 300 ms après la dernière frappe
      distinctUntilChanged()      // Ne déclencher que si la valeur change réellement
    ).subscribe(searchTerm => {
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
          }
        });
      } else {
        console.log('[searchControl] < 3 caractères, on recharge la liste complète');
        this.loadClients();
      }
    });
  }

  // Initialisation du formulaire
  initForm() {
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
  loadClients() {
    console.log('[loadClients] Récupération de tous les clients...');
    this.clientService.getClients().subscribe({
      next: (data: CLIENT[]) => {
        console.log('[loadClients] Succès, clients chargés :', data);
        this.clients = data;
      },
      error: (error) => {
        console.error('[loadClients] Erreur lors du chargement des clients', error);
      }
    });
  }

  // Ouvrir la modale d'ajout
  openFormAddClient() {
    this.isModalOpen = true;
    this.edit = false;
    this.client = null;
    this.clientForm.patchValue({
      referenceClient: this.getNextReference()
    });
  }

  // Fermer la modale et réinitialiser le formulaire
  closeModal() {
    this.isModalOpen = false;
    this.clientForm.reset();
    this.edit = false;
    this.client = null;
  }

  // Ajouter un client
  submitClient() {
    this.submitted = true;
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const formValues = this.clientForm.getRawValue();
    console.log('[submitClient] Formulaire valide, envoi :', formValues);

    this.clientService.addClient(formValues).subscribe({
      next: (clientAjoute: CLIENT) => {
        console.log('[submitClient] Client ajouté avec succès :', clientAjoute);
        // Optionnel : mettre à jour la liste locale
        this.clients = [...this.clients, clientAjoute];
        this.closeModal();
        this.loadClients();
        this.submitted = false;
      },
      error: (error) => {
        console.error("[submitClient] Erreur lors de l'ajout du client", error);
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
        }
      },
      error: (error) => {
        console.error('[ouvrirModalEdition] Erreur lors du chargement du client', error);
      }
    });
  }

  // Modifier un client
  modifierClient() {
    if (!this.clientForm.valid) return;
    const clientData = this.clientForm.getRawValue();
    console.log('[modifierClient] Envoi des données :', clientData);

    this.clientService.editClient(clientData).subscribe({
      next: () => {
        console.log('[modifierClient] Modification réussie');
        this.closeModal();
        this.loadClients();
      },
      error: (err) => {
        console.error('[modifierClient] Erreur lors de la modification du client', err);
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
        },
        error: (err) => {
          console.error('[deleteClient] Erreur lors de la suppression du client', err);
        }
      });
    }
  }

  trackById(index: number, client: CLIENT) {
    return client.id;
  }

  getNextReference(): number {
    return this.clients.length + 1;
  }
}
