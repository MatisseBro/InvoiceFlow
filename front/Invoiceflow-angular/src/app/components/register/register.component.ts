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
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      telephone: ['', Validators.required],
      nomEntreprise: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // --- GETTERS pour vérifier les critères du mot de passe ---
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

  // Indique si le mot de passe est valide au global
  get isPasswordValid(): boolean {
    return this.isMinLength && this.hasDigit && this.hasSpecialChar;
  }

  // Méthodes de navigation
  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
      this.errorMessage = null;
    } else {
      this.errorMessage = `Veuillez remplir correctement les champs de l'étape ${this.currentStep}.`;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = null;
    }
  }

  // Vérifie la validité des champs requis pour l'étape courante
  isCurrentStepValid(): boolean {
    if (this.currentStep === 1) {
      // Étape 1 : nom + prénom
      return !!this.registerForm.get('nom')?.valid
          && !!this.registerForm.get('prenom')?.valid;
    } else if (this.currentStep === 2) {
      // Étape 2 : email + password
      return !!this.registerForm.get('email')?.valid
          && !!this.registerForm.get('password')?.valid;
    } else if (this.currentStep === 3) {
      // Étape 3 : téléphone + nomEntreprise
      return !!this.registerForm.get('telephone')?.valid
          && !!this.registerForm.get('nomEntreprise')?.valid;
    }
    return false;
  }

  // Soumission finale
  submit(): void {
    if (this.registerForm.valid) {
      console.log('Données d\'inscription:', this.registerForm.value);
      const { email, password, nom, prenom, nomEntreprise, telephone } = this.registerForm.value;
      this.apiService.register(email, password, nom, prenom, nomEntreprise, telephone).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.errorMessage = null;
          this.router.navigate(['/produit']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription', error);
          this.errorMessage = 'Erreur lors de l\'inscription.';
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
}
