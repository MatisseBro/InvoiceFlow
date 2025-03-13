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
  errorMessage: string | null = null; // Message d'erreur

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

  // Méthode pour la connexion
  login(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      console.log('Données de connexion :', formValues);
      this.authService.login(formValues.email, formValues.password).subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur lors de la connexion', error);
          this.errorMessage = 'Erreur lors de la connexion';
        }
      });
    }
  }
}
