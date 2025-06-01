import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ParametreService } from '../parametre/parametre.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  title = 'Invoiceflow-angular';
  dropdownOpen = false;
  // Propriété pour stocker le chemin complet de la photo de profil
  profilePicture: string | null = null;

  userInitial : string = '';


  constructor(
    private router: Router,
    private apiService: ParametreService,
    private cdr : ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.apiService.profilUpdateSubject.subscribe(() => {
      this.loadUserProfile();
    })
  }

  loadUserProfile(): void {
    this.apiService.getCurrentUser().subscribe({
      next: (userData: any) => {
        console.log('User info dans Layout:', userData);
        const { nom, prenom, profilePicture } = userData;
  
        // Génére les initiales
        this.userInitial = `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  
        if (profilePicture) {
          this.profilePicture = 'http://localhost:8001' + profilePicture;
        } else {
          this.profilePicture = null; // important pour afficher les initiales à la place
        }
  
        this.cdr.detectChanges(); // assure le rafraîchissement de la vue
      },
      error: (err) => {
        console.error('Erreur lors du chargement user dans Layout', err);
        this.profilePicture = null;
        this.userInitial = 'U'; // fallback simple
      }
    });
  }
  

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    setTimeout(() => (this.dropdownOpen = false), 100);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login']);
  }
}
