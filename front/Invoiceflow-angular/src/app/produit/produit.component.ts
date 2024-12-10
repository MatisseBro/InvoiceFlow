import { Component, OnInit } from '@angular/core';
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

  constructor(private produitService: ProduitService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getProduits();
    this.initForm();
  }

  // Initialisation du formulaire
  initForm() {
    this.produitForm = this.fb.group({
      reference: ['', Validators.required],
      nom: ['', Validators.required],
      type: ['', Validators.required],
      unite: ['', Validators.required],
      prixTTC: [0, Validators.required],
      prixHT: [0, Validators.required],
      tva: [20, Validators.required],
      quantite: [0, Validators.required],
      description: [''],
      commentaire: ['']
    });
  }

  // Récupération des produits
  getProduits(): void {
    this.produitService.getProduits().subscribe((data: PRODUIT[]) => {
      this.produits = data;
    });
  }

  // Filtre des produits pour la recherche
  produitsFiltrés(): PRODUIT[] {
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
  }

  
      };
