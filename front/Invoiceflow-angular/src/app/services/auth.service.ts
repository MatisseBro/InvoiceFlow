// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8001/api'; // L'URL de votre backend Symfony

  constructor(private http: HttpClient) { }

  // La méthode login récupère le token et le stocke dans le localStorage
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login_check`, { username: email, password: password })
      .pipe(
        tap(response => {
          // Stocker le token dans le localStorage
          localStorage.setItem('auth_token', response.token);
        })
      );
  }

  // Méthode d'enregistrement (register)
  register(email: string, password: string, nom: string, prenom: string, nomEntreprise: string, telephone: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, { email, password, nom, prenom, nomEntreprise, telephone })
      .pipe(
        tap(response => {
          // Stocker le token renvoyé lors de l'inscription dans le localStorage
          localStorage.setItem('auth_token', response.token);
        })
      );
  }

  // Méthode pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Méthode pour déconnecter l'utilisateur (logout)
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
