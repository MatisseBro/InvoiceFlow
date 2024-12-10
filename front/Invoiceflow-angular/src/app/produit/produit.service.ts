import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUIT } from '../interface/interface';


@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'https://localhost:8001/api/produits'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les produits
  getProduits(): Observable<PRODUIT[]> {
    return this.http.get<PRODUIT[]>(this.apiUrl);
  }

  // Méthode pour ajouter un produit
  addProduit(produit: PRODUIT): Observable<PRODUIT> {
    return this.http.post<PRODUIT>(this.apiUrl, produit);
  }
}
