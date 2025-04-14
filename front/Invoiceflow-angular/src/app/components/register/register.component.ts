import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  currentStep: number = 1;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  alertTimeout: any;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire d'inscription
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      nomEntreprise: ['', Validators.required]
    });
  }

  // Permet de basculer la visibilité du mot de passe
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // GETTERS pour les critères du mot de passe
  get isMinLength(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return password.length >= 8;
  }

  get hasDigit(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  get hasSpecialChar(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return /[^A-Za-z0-9]/.test(password);
  }

  // Indique si le mot de passe respecte tous les critères
  get isPasswordValid(): boolean {
    return this.isMinLength && this.hasDigit && this.hasSpecialChar;
  }

  // Méthodes de navigation entre étapes
  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
      this.closeAlert();
    } else {
      this.setErrorMessage(`Veuillez remplir correctement les champs de l'étape ${this.currentStep}.`);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.closeAlert();
    }
  }

  // Vérifie la validité des champs requis pour l'étape courante
  isCurrentStepValid(): boolean {
    if (this.currentStep === 1) {
      // Étape 1 : nom et prénom
      return !!this.registerForm.get('nom')?.valid &&
             !!this.registerForm.get('prenom')?.valid;
    } else if (this.currentStep === 2) {
      // Étape 2 : email et password
      return !!this.registerForm.get('email')?.valid &&
             !!this.registerForm.get('password')?.valid;
    } else if (this.currentStep === 3) {
      // Étape 3 : téléphone et nomEntreprise
      return !!this.registerForm.get('telephone')?.valid &&
             !!this.registerForm.get('nomEntreprise')?.valid;
    }
    return false;
  }

  // Méthode pour définir un message de succès et le masquer après 5 secondes
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

  // Méthode pour définir un message d'erreur et le masquer après 5 secondes
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

  // Ferme les alertes immédiatement
  closeAlert(): void {
    this.errorMessage = null;
    this.successMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }

  // Soumission finale du formulaire d'inscription
  submit(): void {
    if (this.registerForm.valid) {
      console.log('Données d\'inscription:', this.registerForm.value);
      const { email, password, nom, prenom, nomEntreprise, telephone } = this.registerForm.value;
      this.authService.register(email, password, nom, prenom, nomEntreprise, telephone).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.setSuccessMessage("Inscription réussie, bienvenue sur Invoice Flow !");
          this.errorMessage = null;
          // Rediriger après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/produit']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription', error);
          this.setErrorMessage("Erreur lors de l'inscription.");
        }
      });
    } else {
      this.setErrorMessage("Veuillez remplir tous les champs correctement.");
    }
  }
}
