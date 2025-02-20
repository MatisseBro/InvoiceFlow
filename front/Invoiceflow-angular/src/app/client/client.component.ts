import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from './client.service'; // Service pour gérer les clients
import { CLIENT } from '../interface/interface'; // Interface Client

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


  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
  }

  // Initialisation du formulaire
  initForm() {
    this.clientForm = this.fb.group({
      id: [null],
      typeClient: ['', Validators.required],
      referenceClient: ['', Validators.required],
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

  // Charger la liste des clients
  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data) => {
        console.log('Clients chargés avec succès', data);
        this.clients = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients', error);
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
  this.submitted = true; // Active l'affichage des erreurs

  if (this.clientForm.invalid) {
    this.clientForm.markAllAsTouched(); // Marque tous les champs invalides
    return;
  }

  const formValues = this.clientForm.getRawValue();

  this.clientService.addClient(formValues).subscribe({
    next: (clientAjoute) => {
      console.log('Client ajouté avec succès');
      this.clients = [...this.clients, clientAjoute];
      this.closeModal();
      this.loadClients();
      this.submitted = false; // Réinitialise après l'ajout réussi
    },
    error: (error) => {
      console.error("Erreur lors de l'ajout du client", error);
    }
  });
}


  // Ouvrir la modale en mode édition
  ouvrirModalEdition(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        if (client) {
          this.clientForm.patchValue(client);
          this.edit = true;
          this.client = client;
          this.isModalOpen = true;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client', error);
      }
    });
  }

  // Modifier un client
  modifierClient() {
    if (!this.clientForm.valid) return;

    const clientData = this.clientForm.getRawValue();
    this.clientService.editClient(clientData).subscribe({
      next: () => {
        this.closeModal();
        this.loadClients();
      },
      error: (err) => {
        console.error('Erreur lors de la modification du client', err);
      }
    });
  }

  // Supprimer un client
  deleteClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du client', err);
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
