import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProduitComponent } from './produit/produit.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FactureComponent } from './facture/facture.component';
import { ClientComponent } from './client/client.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'produit', component: ProduitComponent },
    { path: 'facture', component: FactureComponent },
    { path: 'client', component: ClientComponent },
    { path: '', component: LandingPageComponent },
  ];