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
        if (userData.profilePicture) {
          this.profilePicture = 'http://localhost:8001' + userData.profilePicture;
        } else {
          // Image par défaut si aucun profil n'est défini
          this.profilePicture = '/matisse-user.jpeg';
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement user dans Layout', err);
        this.profilePicture = '/assets/default-avatar.png';
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
