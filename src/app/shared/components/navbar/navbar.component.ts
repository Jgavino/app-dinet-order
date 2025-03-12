import { Component, inject, type OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;

  authService = inject(AuthService);

  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {}

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  goToBack() {
    localStorage.removeItem('_linkListDetailOrder');
    localStorage.removeItem('_linkOrderForm');
    this.router.navigate(['/orders']);
  }

  logout() {
    this.authService.setLogoutStatus();
    this.router.navigate(['/']);
  }
}
