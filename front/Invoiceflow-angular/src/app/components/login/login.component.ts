import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Votre service d'authentification
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
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;   // Message d'erreur
  successMessage: string | null = null; // Message de succès
  alertTimeout: any;                    // Pour gérer le setTimeout
  showPassword: boolean = false;        // Pour basculer la visibilité du mot de passe

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialisation du formulaire de connexion
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Définit un message de succès et le masque après 5 secondes
  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  // Définit un message d'erreur et le masque après 5 secondes
  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  // Ferme les alertes manuellement
  closeAlert(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }

  // Méthode pour la connexion
  login(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      console.log('Données de connexion :', formValues);
      this.authService.login(formValues.email, formValues.password).subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          localStorage.setItem('token', response.token);
          // Afficher le message de succès
          this.setSuccessMessage("Bien connecté, bienvenue sur Invoice Flow !");
          // Rediriger après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de la connexion', error);
          this.setErrorMessage('Erreur lors de la connexion');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.setErrorMessage('Veuillez remplir correctement le formulaire de connexion.');
    }
  }
}
