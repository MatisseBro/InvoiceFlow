import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facture-pdf',
  standalone: true,
  templateUrl: './facture-pdf.component.html',
  styleUrls: ['./facture-pdf.component.css'],
  imports: [CommonModule]
})
export class FacturePdfComponent implements OnInit {
  theme: string = 'theme-a';
  data: any;

  @ViewChild('pdfWrapper', { static: false }) pdfWrapper!: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.theme = this.route.snapshot.queryParamMap.get('theme') || 'theme-a';
    const storedData = localStorage.getItem('factureData');
    this.data = storedData ? JSON.parse(storedData) : null;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `assets/pdf-themes/${this.theme}.css`;
    document.head.appendChild(link);

    // Attendre que le DOM soit prêt avant génération PDF
    setTimeout(() => {
      this.genererPDF();
    }, 1000);
  }

  genererPDF(): void {
    if (!this.pdfWrapper || !this.pdfWrapper.nativeElement) {
      console.warn('❌ Élément PDF introuvable.');
      return;
    }

    const options = {
      filename: `Facture_${this.data?.numeroFacture || 'XXXX'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(options)
      .from(this.pdfWrapper.nativeElement)
      .save();
  }
}