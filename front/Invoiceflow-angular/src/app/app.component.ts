import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Invoiceflow-angular';

  constructor(private router: Router) 
  {}

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}
