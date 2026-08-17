import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-admin-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-reset-password.component.html',
})
export class AdminResetPasswordComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private supabase = inject(SupabaseService);

  newPassword = signal('');
  confirmPassword = signal('');
  isLoading = signal(false);
  isValidToken = signal(false);

  async ngOnInit(): Promise<void> {
    // Verificar si hay un token de recuperación en la URL
    const hashParams = this.route.snapshot.fragment;
    console.log('Hash params:', hashParams);
    
    if (hashParams && hashParams.includes('access_token')) {
      this.isValidToken.set(true);
      // Supabase manejará el token automáticamente
      const { data, error } = await this.supabase.client.auth.getSession();
      console.log('Session after hash:', { data, error });
    } else {
      this.toast.error('Error', 'Enlace inválido o expirado');
      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 2000);
    }
  }

  async resetPassword(): Promise<void> {
    if (!this.newPassword() || !this.confirmPassword()) {
      this.toast.error('Error', 'Por favor complete todos los campos');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.toast.error('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (this.newPassword().length < 6) {
      this.toast.error('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.isLoading.set(true);

    try {
      console.log('Intentando actualizar contraseña...');
      const { data, error } = await this.supabase.client.auth.updateUser({
        password: this.newPassword()
      });

      console.log('Resultado de actualización:', { data, error });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Contraseña actualizada correctamente');
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      }
    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      this.toast.error('Error', 'Error al actualizar la contraseña');
    }

    this.isLoading.set(false);
  }
}
