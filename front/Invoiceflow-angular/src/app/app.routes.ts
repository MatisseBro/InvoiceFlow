import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProduitComponent } from './produit/produit.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FactureComponent } from './facture/facture.component';
import { ClientComponent } from './client/client.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guard/auth.guard';  // Assurez-vous que le chemin correspond à l'emplacement de votre AuthGuard
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
      { path : 'accueil', component: LandingPageComponent },
      { path: 'produit', component: ProduitComponent, canActivate: [AuthGuard] },
      { path: 'facture', component: FactureComponent, canActivate: [AuthGuard] },
      { path: 'client', component: ClientComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'auth',
    children: [
    //  { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },


  // { path: '', component: LandingPageComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },

  // // Les routes protégées par le guard
  // { path: 'produit', component: ProduitComponent, canActivate: [AuthGuard] },
  // { path: 'facture', component: FactureComponent, canActivate: [AuthGuard] },
  // { path: 'client', component: ClientComponent, canActivate: [AuthGuard] },

];
