import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginRequest } from '../../core/interfaces/login';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isMobile: boolean = window.innerWidth <= 768;

  //Inicializar el formulario
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(60),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16),
    ]),
  });

  authService = inject(AuthService);

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      //invocar el servicio de autenticación
      const loginRequest: LoginRequest = {
        username: this.loginForm.get('username')?.value || '',
        password: this.loginForm.get('password')?.value || '',
        ipAddress: '',
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.authService.setUserAuth({
              id: response.body.id,
              isAuthenticated: true,
            });
            localStorage.setItem('_linkUserProfile', response.body.id);
            localStorage.setItem('_linkToken', response.body.jwToken);
            this.router.navigate(['/orders']);
          } else if (response.status === 401) {
            this.authService.setLogoutStatus();
            this.toastr.error('Usuario o Password incorrecto.', 'Error', {
              timeOut: 2500,
              progressBar: true,
              toastClass: this.isMobile
                ? 'ngx-toastr toast-w300'
                : 'ngx-toastr toast-w500',
              progressAnimation: 'increasing',
            });
          } else {
            this.authService.setLogoutStatus();
            this.toastr.error(
              'Ocurrió un error inesperado en el servidor',
              'Error',
              {
                timeOut: 2500,
                progressBar: true,
                toastClass: this.isMobile
                  ? 'ngx-toastr toast-w300'
                  : 'ngx-toastr toast-w500',
                progressAnimation: 'increasing',
              }
            );
          }
        },
        error: (error) => {
          console.error('Error: ', error);
          this.toastr.error('Login failed');
        },
      });
    } else {
      console.log('Campos inválidos');
      let firstInvalidControlName: string | null = null;

      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);

        if (control && control.invalid && !firstInvalidControlName) {
          firstInvalidControlName = key;
        }
      });

      Object.values(this.loginForm.controls).forEach((control: any) => {
        control.markAsTouched();
      });

      console.log('Primer control inválido: ', firstInvalidControlName);
      const controlElement = document.querySelector(
        `[formControlName="${firstInvalidControlName}"]`
      ) as HTMLInputElement;

      if (controlElement) {
        controlElement.classList.add('is-invalid');
        controlElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  getErrorMessage(field: string) {
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    if (field === 'username') {
      if (usernameControl?.hasError('required')) {
        return 'Este campo es obligatorio';
      }
      if (usernameControl?.hasError('maxlength')) {
        return 'Usuario debe tener menos de 60 caracteres';
      }
      if (usernameControl?.hasError('minlength')) {
        return 'Usuario debe tener al menos 8 caracteres';
      }
    }

    if (field === 'password') {
      if (passwordControl?.hasError('required')) {
        return 'Este campo es obligatorio';
      }
      if (passwordControl?.hasError('minlength')) {
        return 'Contraseña debe tener al menos 8 caracteres';
      }
      if (passwordControl?.hasError('maxlength')) {
        return 'Contraseña debe tener menos de 16 caracteres';
      }
    }

    return '';
  }

  isFieldInvalid(field: string) {
    return (
      this.loginForm.get(field)?.invalid && this.loginForm.get(field)?.touched
    );
  }

  validateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Remover cualquier carácter que no sea un número
    input.value = value.replace(/[^\d]/g, '');

    // Validar la longitud del valor
    if (value.length > 8) {
      input.value = value.slice(0, 8);
    }
  }

  handlePaste(event: ClipboardEvent): void {
    //obtener el texto pegado
    const pastedText = event.clipboardData?.getData('text');
    // Verificar si el texto pegado es solo números

    if (!/^\d+$/.test(pastedText || '')) {
      event.preventDefault(); // Prevenir pegar si no son solo números
    }
  }

  selctAll(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  showPassword() {
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    console.log('passwordInput: ', passwordInput);
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
}
