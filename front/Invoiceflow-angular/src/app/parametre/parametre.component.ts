import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParametreService } from './parametre.service';

@Component({
  selector: 'app-parametre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css']
})
export class ParametreComponent implements OnInit {
  activeTab: string = 'user';
  userForm!: FormGroup;
  entrepriseForm!: FormGroup;

  // Variables pour afficher les alertes
  successMessage: string | null = null;
  errorMessage: string | null = null;
  alertTimeout: any;

  // Variables pour la photo de profil
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ParametreService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserData();
  }

  private initializeForms(): void {
    // Formulaire utilisateur
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required]
    });

    // Formulaire entreprise avec validations (pattern, required)
    this.entrepriseForm = this.fb.group({
      nomEntreprise: ['', Validators.required],
      telephoneEntreprise: ['', Validators.required],
      adresse1: ['', Validators.required],
      adresse2: [''],
      codePostal: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      siret: ['', [Validators.required, Validators.pattern('^\\d{14}$')]],  // exactement 14 chiffres
      siren: ['', [Validators.required, Validators.pattern('^\\d{9}$')]],   // exactement 9 chiffres
      iban: ['', [Validators.required, Validators.pattern('^FR\\d{2}[A-Z0-9]{23}$')]], // IBAN français complet
      bic: ['', Validators.required],
      nomBanque: ['', Validators.required],
      conditionReglement: ['', Validators.required]
    });
  }

  loadUserData(): void {
    this.apiService.getCurrentUser().subscribe({
      next: (data: any) => {
        console.log('User data:', data);
        // Patch du formulaire utilisateur
        this.userForm.patchValue({
          email: data.email,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone
        });
        // Patch du formulaire entreprise s'il y a des données
        if (data.entreprise) {
          this.entrepriseForm.patchValue({
            nomEntreprise: data.entreprise.nomEntreprise,
            telephoneEntreprise: data.entreprise.telephoneEntreprise,
            adresse1: data.entreprise.adresse1,
            adresse2: data.entreprise.adresse2,
            codePostal: data.entreprise.codePostal,
            ville: data.entreprise.ville,
            pays: data.entreprise.pays,
            siret: data.entreprise.siret,
            siren: data.entreprise.siren,
            iban: data.entreprise.iban,
            bic: data.entreprise.bic,
            nomBanque: data.entreprise.nomBanque,
            conditionReglement: data.entreprise.conditionReglement
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du user', error);
        this.setErrorMessage("Erreur lors du chargement des données utilisateur.");
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.closeAlert();
  }

  // Méthodes d'alerte

  setSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    if (this.alertTimeout) { clearTimeout(this.alertTimeout); }
    this.alertTimeout = setTimeout(() => {
      this.successMessage = null;
      this.cdr.markForCheck();
    }, 5000);
  }

  setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    if (this.alertTimeout) { clearTimeout(this.alertTimeout); }
    this.alertTimeout = setTimeout(() => {
      this.errorMessage = null;
      this.cdr.markForCheck();
    }, 5000);
  }

  closeAlert(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.alertTimeout) { clearTimeout(this.alertTimeout); }
  }

  saveInfoUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.setErrorMessage("Veuillez corriger les erreurs dans le formulaire utilisateur.");
      return;
    }
    const formValues = this.userForm.getRawValue();
    this.apiService.saveInfoUser(formValues).subscribe({
      next: (response) => {
        console.log('User information saved successfully:', response);
        this.setSuccessMessage("Les informations utilisateur ont été mises à jour avec succès.");
      },
      error: (error) => {
        console.error('Error saving user information:', error);
        this.setErrorMessage("Une erreur est survenue lors de la sauvegarde des informations utilisateur.");
      }
    });
  }

  saveInfoEntreprise(): void {
    if (this.entrepriseForm.invalid) {
      this.entrepriseForm.markAllAsTouched();
      this.setErrorMessage("Veuillez corriger les erreurs dans le formulaire entreprise.");
      return;
    }
    const formValues = this.entrepriseForm.getRawValue();
    this.apiService.saveInfoEntreprise(formValues).subscribe({
      next: (response) => {
        console.log('Entreprise information saved successfully:', response);
        this.setSuccessMessage("Les informations de l'entreprise ont été mises à jour avec succès.");
      },
      error: (error) => {
        console.error('Error saving entreprise information:', error);
        this.setErrorMessage("Une erreur est survenue lors de la sauvegarde des informations entreprise.");
      }
    });
  }

  // Gestion de la sélection d'un fichier (photo de profil)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Générer l'aperçu via FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result ?? null;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Téléversement de la photo de profil
  saveProfilePicture(): void {
    if (!this.selectedFile) {
      this.setErrorMessage("Veuillez sélectionner un fichier.");
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', this.selectedFile);
    this.apiService.uploadProfilePicture(formData).subscribe({
      next: (response) => {
        console.log("Photo de profil mise à jour:", response);
        this.setSuccessMessage("Votre photo de profil a été mise à jour avec succès.");
      },
      error: (error) => {
        console.error("Erreur lors du téléversement de la photo de profil", error);
        this.setErrorMessage("Erreur lors du téléversement de la photo de profil.");
      }
    });
  }
}
