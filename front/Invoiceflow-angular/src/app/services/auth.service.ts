// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8001/api'; // L'URL de votre backend Symfony

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login_check`, { username: email, password: password });
  }

  register(email: string, password: string, nom: any, prenom: any, nomEntreprise: any, telephone: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, nom, prenom, nomEntreprise, telephone });
  }
}
