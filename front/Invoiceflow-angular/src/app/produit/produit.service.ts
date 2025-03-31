import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUIT } from '../interface/interface';


@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'http://localhost:8001/api'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // ou 'auth_token', selon votre choix
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    }
    console.error('Token introuvable dans localStorage');
    return new HttpHeaders();
  }

  // Méthode pour récupérer tous les produits
  getProduits(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/produits`, { headers });
   }

  // Méthode pour ajouter un produit
  addProduit(produit: PRODUIT): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/produit`, produit, {headers});
 
  }

  editProduit(produit: PRODUIT): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<PRODUIT>(`${this.apiUrl}/edit-produit/${produit.id}`, produit, {headers});
  }

  getProduitById(id: number): Observable<PRODUIT> {
    const headers = this.getHeaders();
    return this.http.get<PRODUIT>(`${this.apiUrl}/produit/${id}`, { headers });
  }
 
  deleteProduit(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/delete-produit/${id}`, {headers});
  }

  searchProduits(searchTerm: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/produits?search=${searchTerm}`, { headers });
  }

}
