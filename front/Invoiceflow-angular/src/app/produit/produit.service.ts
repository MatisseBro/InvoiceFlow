import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUIT } from '../interface/interface';


@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'http://localhost:8001/api'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les produits
  getProduits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits`);
   }

  // Méthode pour ajouter un produit
  addProduit(produit: PRODUIT): Observable<any> {
    return this.http.post(`${this.apiUrl}/produit`, produit);
 
  }

  editProduit(produit: PRODUIT): Observable<any> {
    return this.http.put<PRODUIT>(`${this.apiUrl}/edit-produit/${produit.id}`, produit);
  }

  getProduitById(id: number): Observable<PRODUIT> {
    return this.http.get<PRODUIT>(`${this.apiUrl}/produit/${id}`);
  }
 
  deleteProduit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-produit/${id}`);
  }

}
