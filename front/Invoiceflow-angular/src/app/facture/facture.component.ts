import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {
  factureForm: FormGroup;
  currentInvoiceNumber: number = 1; // Commence par 1

  constructor(private fb: FormBuilder) {
    this.factureForm = this.fb.group({
      client: [''],
      invoiceNumber: [''],
      paymentInfo: this.fb.group({
        iban: [''],
        swift: [''],
        bankName: ['']
      }),
      additionalInfo: this.fb.group({
        invoiceDate: [''],
        dueDate: [''],
        paymentTerms: [''],
        engagementNumber: [''],
        serviceCode: [''],
        creditorReference: ['']
      }),
      footerNote: [''],
      products: this.fb.array([]),
      subTotal: [0],
      tax: [0],
      total: [0]
    });
  }

  ngOnInit(): void {
    this.addProduct(); // Ajouter une ligne produit par défaut
    this.generateInvoiceNumber(); // Générer le numéro de facture
    this.calculateTotals(); // Initialiser les totaux
  }

  get products(): FormArray {
    return this.factureForm.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.fb.group({
      productName: [''],
      quantity: [1],
      tva: [20],
      unit: ['Jours'],
      priceHT: [0],
      priceTTC: [0],
      total: [0]
    });
    this.products.push(productGroup);
    this.calculateTotals();
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.calculateTotals();
  }

  calculateTotals(): void {
    let subTotal = 0;

    this.products.controls.forEach((product) => {
      const quantity = product.get('quantity')?.value || 0;
      const priceHT = product.get('priceHT')?.value || 0;
      const tva = product.get('tva')?.value || 0;

      const totalHT = quantity * priceHT;
      const totalTTC = totalHT + (totalHT * tva) / 100;

      product.get('priceTTC')?.setValue(totalTTC.toFixed(2));
      product.get('total')?.setValue(totalHT.toFixed(2));

      subTotal += totalHT;
    });

    const tax = subTotal * 0.2; // TVA 20 %
    const total = subTotal + tax;

    this.factureForm.get('subTotal')?.setValue(subTotal.toFixed(2));
    this.factureForm.get('tax')?.setValue(tax.toFixed(2));
    this.factureForm.get('total')?.setValue(total.toFixed(2));
  }

  generateInvoiceNumber(): void {
    this.factureForm.get('invoiceNumber')?.setValue(`N° ${this.currentInvoiceNumber}`);
  }

  onSubmit(): void {
    console.log('Facture créée :', this.factureForm.value);
    alert('Facture créée avec succès !');

    this.currentInvoiceNumber++; // Incrémenter le numéro de facture
    this.factureForm.reset(); // Réinitialiser le formulaire
    this.generateInvoiceNumber(); // Générer le nouveau numéro
    this.addProduct(); // Ajouter une ligne produit par défaut
  }
}