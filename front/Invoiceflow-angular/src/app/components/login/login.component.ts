import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Le service d'authentification
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Correction de styleUrl en styleUrls
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string | null = null; // Ajout de la variable pour le message d'erreur

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Utilise AuthService
    private router: Router // Utilise Router pour la redirection
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      console.log('Données à envoyer pour la connexion:', formValues);

      this.authService.login(formValues.email, formValues.password).subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          this.router.navigate(['/']); // Redirige vers la page d'accueil après connexion réussie
        },
        error: (error) => {
          console.error('Erreur lors de la connexion', error);
        }
      });
    }
  }

  register() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      console.log('Données à envoyer pour l\'inscription:', formValues);

      this.authService.register(formValues.email, formValues.password).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.router.navigate(['/']); // Redirige vers la page d'accueil après inscription réussie
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription', error);
          // Mettez à jour le message d'erreur ici
          if (error.status === 409) { // Exemple de code d'erreur pour conflit
            this.errorMessage = 'Un compte avec cet e-mail existe déjà.';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
    }
  }
}
