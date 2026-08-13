import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private supabase = inject(SupabaseService);

  password = signal('admin123');
  isLoading = signal(false);
  private readonly ADMIN_EMAIL = 'sargentopimientaweb@gmail.com';

  async ngOnInit(): Promise<void> {
    const { data: { session } } = await this.supabase.getSession();
    if (session) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async login(): Promise<void> {
    if (!this.password()) {
      this.toast.error('Error', 'Por favor ingrese la contraseña');
      return;
    }

    this.isLoading.set(true);

    try {
      const { data, error } = await this.supabase.signIn(this.ADMIN_EMAIL, this.password());

      if (error) {
        this.toast.error('Error', 'Contraseña incorrecta');
      } else {
        localStorage.setItem('adminAuthenticated', 'true');
        this.toast.success('Bienvenido', 'Acceso al panel de administrador');
        this.router.navigate(['/admin/dashboard']);
      }
    } catch (err) {
      this.toast.error('Error', 'Ocurrió un error al iniciar sesión');
    }

    this.isLoading.set(false);
  }

  resetPassword(): void {
    this.toast.success('Restablecer Contraseña', 'Instrucciones enviadas al correo de administración');
  }
}
