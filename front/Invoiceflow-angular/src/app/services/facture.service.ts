import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:8001'; // 🔁 adapte si besoin (ou remplace avec env var)

  constructor(private http: HttpClient) {}

  /**
   * Récupère le nombre total de factures enregistrées (compteur)
   */
  getNombreFactures(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/factures/count`);
  }
}