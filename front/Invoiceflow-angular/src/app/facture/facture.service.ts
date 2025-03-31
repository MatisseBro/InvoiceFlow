import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:3000'; // Mets ici l’URL de ton backend

  constructor(private http: HttpClient) {}

  // 🔹 Liste des clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`).pipe(
      catchError(err => {
        console.error("❌ Erreur API Clients :", err);
        return of([]);
      })
    );
  }

  // 🔹 Liste des produits
  getProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produits`).pipe(
      catchError(err => {
        console.error("❌ Erreur API Produits :", err);
        return of([]);
      })
    );
  }

  // 🔢 Nombre total de factures enregistrées (pour générer un numéro)
  getNombreFactures(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/factures/count`).pipe(
      catchError(err => {
        console.error("❌ Erreur API Nombre de factures :", err);
        return of(0); // Si erreur → on retourne 0
      })
    );
  }

  // 💾 Enregistrer une facture dans la base
  saveFacture(factureData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/factures`, factureData).pipe(
      catchError(err => {
        console.error("❌ Erreur API Enregistrement facture :", err);
        return of(null);
      })
    );
  }
}