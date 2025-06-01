import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../produit/produit.service';
import { ClientService } from '../client/client.service';
import { FactureService } from '../services/facture.service';
import { CLIENT } from '../interface/interface';
import html2pdf from 'html2pdf.js';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css'],
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

  dateFacture: string = '28 Juillet 2024';
  dateEcheance: string = '30 Juillet 2024';

  afficherModalTemplate: boolean = false;
  selectedTemplate: string = '';

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private clientService: ClientService,
    private factureService: FactureService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProduits();
    this.loadClients();
    this.getNextFactureNumber();

    this.factureForm.get('clientId')?.valueChanges.subscribe(clientId => {
      if (clientId) {
        this.clientService.getClientById(clientId).subscribe(client => {
          this.clientInfos = client;
        });
      } else {
        this.clientInfos = null;
      }
    });
  }

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

  loadProduits(): void {
    this.produitService.getProduits().subscribe(data => this.produits = data);
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(data => this.clients = data);
  }

  getNextFactureNumber(): void {
    this.factureService.getNombreFactures().subscribe(count => {
      const next = count + 1;
      this.numeroFacture = 'N°: ' + next.toString().padStart(5, '0');
    });
  }

  get produitsFacture(): FormArray {
    return this.factureForm.get('produitsFacture') as FormArray;
  }

  getProduitFormGroup(index: number): FormGroup {
    return this.produitsFacture.at(index) as FormGroup;
  }

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

  supprimerProduit(index: number): void {
    this.produitsFacture.removeAt(index);
    this.calculerTotal();
  }

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

  get sousTotal(): number {
    return this.arrondir(this.produitsFacture.value.reduce((acc: number, p: any) => acc + (p.prixHT * p.quantite), 0));
  }

  get totalTVA(): number {
    return this.arrondir(this.produitsFacture.value.reduce((acc: number, p: any) => acc + ((p.prixHT * p.quantite) * (p.tva / 100)), 0));
  }

  get total(): number {
    return this.arrondir(this.sousTotal + this.totalTVA);
  }

  arrondir(valeur: number): number {
    return Math.round(valeur * 100) / 100;
  }

  submitForm(): void {
    if (this.factureForm.valid) {
      const formData = this.factureForm.value;
      console.log("✅ Données du formulaire :", formData);
      // Appel au service si besoin
    } else {
      console.warn("❌ Formulaire invalide !");
      this.factureForm.markAllAsTouched();
    }
  }

  ouvrirChoixTemplate(): void {
    this.afficherModalTemplate = true;
  }

  fermerModalTemplate(): void {
    this.afficherModalTemplate = false;
  }

  choisirTemplate(theme: string): void {
    this.selectedTemplate = theme;
    this.fermerModalTemplate();

    const formData = this.factureForm.value;

    localStorage.setItem('factureData', JSON.stringify({
      ...formData,
      clientInfos: this.clientInfos,
      numeroFacture: this.numeroFacture,
      sousTotal: this.sousTotal,
      totalTVA: this.totalTVA,
      total: this.total
    }));

    this.router.navigate(['/facture-pdf'], { queryParams: { theme } });
  }
}