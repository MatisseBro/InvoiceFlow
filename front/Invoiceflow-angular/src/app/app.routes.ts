import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProduitComponent } from './produit/produit.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FactureComponent } from './facture/facture.component';
import { ClientComponent } from './client/client.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guard/auth.guard';  // Assurez-vous que le chemin correspond à l'emplacement de votre AuthGuard
import { LayoutComponent } from './layout/layout.component';
import { ParametreComponent } from './parametre/parametre.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  // Routes publiques pour l'authentification
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path : 'landing', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
   
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  
  // Routes protégées (layout avec outlet pour les routes enfants)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      // Définir une route par défaut pour le chemin vide
      { path: '', redirectTo: 'produit', pathMatch: 'full' },

      { path: 'produit', component: ProduitComponent },
      { path: 'facture', component: FactureComponent },
      { path: 'client', component: ClientComponent },
      { path : 'parametre', component : ParametreComponent },
      { path: 'dashboard', component : DashboardComponent }, 
      // Une wildcard pour intercepter toute URL non prévue dans ce contexte
      { path: '**', redirectTo: 'produit', pathMatch: 'full' }
    ]
  },
];
