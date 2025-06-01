import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CLIENT } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8001/api';

  constructor(private http: HttpClient) {}

  // Génère les en-têtes HTTP avec le token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    }
    console.warn('[ClientService] ⚠️ Token introuvable dans localStorage');
    return new HttpHeaders();
  }

  // Récupère tous les clients
  getClients(): Observable<CLIENT[]> {
    return this.http.get<CLIENT[]>(`${this.apiUrl}/clients`, { headers: this.getHeaders() });
  }

  // Récupère un client par ID
  getClientById(id: number): Observable<CLIENT> {
    return this.http.get<CLIENT>(`${this.apiUrl}/client/${id}`, { headers: this.getHeaders() });
  }

  // Ajoute un nouveau client
  addClient(client: CLIENT): Observable<CLIENT> {
    return this.http.post<CLIENT>(`${this.apiUrl}/client`, client, { headers: this.getHeaders() });
  }

  // Modifie un client existant
  editClient(client: CLIENT): Observable<CLIENT> {
    return this.http.put<CLIENT>(`${this.apiUrl}/edit-client/${client.id}`, client, { headers: this.getHeaders() });
  }

  // Supprime un client par ID
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-client/${id}`, { headers: this.getHeaders() });
  }

  // Recherche de clients par mot-clé
  searchClients(searchTerm: string): Observable<CLIENT[]> {
    return this.http.get<CLIENT[]>(`${this.apiUrl}/clients?search=${searchTerm}`, { headers: this.getHeaders() });
  }
}