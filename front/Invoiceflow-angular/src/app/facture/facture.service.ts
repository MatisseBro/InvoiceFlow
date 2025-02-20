import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:3000'; // Assurez-vous que c'est l'URL correcte

  constructor(private http: HttpClient) {}

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`).pipe(
      catchError(err => {
        console.error("❌ Erreur API Clients :", err);
        return of([]); // Retourner un tableau vide pour éviter le crash
      })
    );
  }

  getProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produits`).pipe(
      catchError(err => {
        console.error("❌ Erreur API Produits :", err);
        return of([]); // Retourner un tableau vide
      })
    );
  }
}