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
  

  getClients(): Observable<CLIENT[]> {
    const headers = this.getHeaders();
    return this.http.get<CLIENT[]>(`${this.apiUrl}/clients`, { headers }); 
  }

  getClientById(id: number): Observable<CLIENT> {
    const headers = this.getHeaders();
    return this.http.get<CLIENT>(`${this.apiUrl}/client/${id}`, { headers});
  }

  addClient(client: CLIENT): Observable<CLIENT> {
    const headers = this.getHeaders();
    return this.http.post<CLIENT>(`${this.apiUrl}/client`, client, { headers }); 
  }

  editClient(client: CLIENT): Observable<CLIENT> {
    const headers = this.getHeaders();
    return this.http.put<CLIENT>(`${this.apiUrl}/edit-client/${client.id}`, client, { headers }); 
  }

  deleteClient(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/delete-client/${id}`, { headers }); 
  }

searchClients(searchTerm: string): Observable<CLIENT[]> {
  const headers = this.getHeaders();
  return this.http.get<CLIENT[]>(`${this.apiUrl}/clients?search=${searchTerm}`, { headers });
}


}
