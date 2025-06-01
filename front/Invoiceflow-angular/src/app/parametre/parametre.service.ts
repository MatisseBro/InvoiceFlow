import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {
 private apiUrl = 'http://localhost:8001/api'; // Remplacez par votre URL d'API

 profilUpdateSubject = new Subject<any>();
  
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

  getCurrentUser(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/current-user`, { headers });
  }

// Pour sauvegarder les infos utilisateur, on utilise POST (ou PATCH selon votre besoin)
saveInfoUser(userData: any): Observable<any> {
  const headers = this.getHeaders();
  return this.http.put<any>(`${this.apiUrl}/save-info-user`, userData, { headers });
}

// Pour sauvegarder les infos entreprise, on utilise POST (ou PATCH)
saveInfoEntreprise(entrepriseData: any): Observable<any> {
  const headers = this.getHeaders();
  return this.http.put<any>(`${this.apiUrl}/save-info-entreprise`, entrepriseData, { headers });
}

uploadProfilePicture(formData: FormData): Observable<any> {
  const headers = this.getHeaders();
  return this.http.post<any>(`${this.apiUrl}/upload-profile-picture`, formData, { headers }).pipe(tap(() => {
    this.profilUpdateSubject.next('notif'); // Émet un événement pour notifier les abonnés
  })) ;
}
 

}
