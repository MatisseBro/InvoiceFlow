import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // <-- Chemin d'accès à votre AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Si l'utilisateur est connecté (isLoggedIn = true), on autorise l'accès
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Sinon, on redirige vers la page de login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
