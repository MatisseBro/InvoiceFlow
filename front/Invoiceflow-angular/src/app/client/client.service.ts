import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CLIENT } from '../interface/interface'; 

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8001/api'; 

  constructor(private http: HttpClient) {}

  getClients(): Observable<CLIENT[]> {
    return this.http.get<CLIENT[]>(`${this.apiUrl}/clients`); // Corrigé : Ajout du bon endpoint
  }

  getClientById(id: number): Observable<CLIENT> {
    return this.http.get<CLIENT>(`${this.apiUrl}/client/${id}`);
  }

  addClient(client: CLIENT): Observable<CLIENT> {
    return this.http.post<CLIENT>(`${this.apiUrl}/client`, client); // Corrigé : Syntaxe des backticks
  }

  editClient(client: CLIENT): Observable<CLIENT> {
    return this.http.put<CLIENT>(`${this.apiUrl}/edit-client/${client.id}`, client); // Corrigé : Ajout de /client avant l'ID
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-client/${id}`); // Corrigé : Ajout de /client avant l'ID
  }
}
