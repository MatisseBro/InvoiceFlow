import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProduitComponent } from './produit/produit.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FactureComponent } from './facture/facture.component';
import { ClientComponent } from './client/client.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guard/auth.guard';

// 🆕 Import du composant PDF
import { FacturePdfComponent } from './facture-pdf/facture-pdf.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Routes protégées
  { path: 'produit', component: ProduitComponent, canActivate: [AuthGuard] },
  { path: 'facture', component: FactureComponent, canActivate: [AuthGuard] },
  { path: 'client', component: ClientComponent, canActivate: [AuthGuard] },

  // 🆕 Route vers le rendu PDF
  { path: 'facture-pdf', component: FacturePdfComponent, canActivate: [AuthGuard] }
];