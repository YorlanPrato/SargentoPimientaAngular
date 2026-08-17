import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { SupabaseService } from '../../../services/supabase.service';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole, ROLE_LABELS } from '../../../types/roles';

@Component({
  selector: 'app-admin-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-admins.component.html',
})
export class AdminAdminsComponent implements OnInit {
  private toast = inject(ToastService);
  private supabase = inject(SupabaseService);
  private authService = inject(AuthService);
  private router = inject(Router);

  admins = signal<User[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  editingAdmin = signal<User | null>(null);

  // Form fields
  cedula = signal('');
  email = signal('');
  role = signal<UserRole>('admin');

  get currentUser() {
    return this.authService.currentUserSignal();
  }

  async ngOnInit(): Promise<void> {
    await this.loadAdmins();
  }

  async loadAdmins(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      // Obtener todos los usuarios de Supabase Auth con sus metadatos
      const { data: { users }, error } = await this.supabase.adminClient.auth.admin.listUsers();
      
      if (error) {
        console.error('Error loading users:', error);
        this.toast.error('Error al cargar administradores');
        return;
      }

      // Filtrar solo usuarios que tienen rol en app_metadata
      const adminUsers = users
        .filter(user => user.app_metadata?.['role'])
        .map(user => ({
          id: user.id,
          email: user.email || '',
          role: user.app_metadata?.['role'] as UserRole,
          cedula: user.app_metadata?.['cedula'] as string,
          created_at: user.created_at
        }));

      this.admins.set(adminUsers);
    } catch (error) {
      console.error('Error loading admins:', error);
      this.toast.error('Error al cargar administradores');
    } finally {
      this.isLoading.set(false);
    }
  }

  openCreateForm(): void {
    this.editingAdmin.set(null);
    this.cedula.set('');
    this.email.set('');
    this.role.set('admin');
    this.showForm.set(true);
  }

  openEditForm(admin: User): void {
    this.editingAdmin.set(admin);
    this.cedula.set(admin.cedula || '');
    this.email.set(admin.email);
    this.role.set(admin.role);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingAdmin.set(null);
    this.cedula.set('');
    this.email.set('');
    this.role.set('admin');
  }

  async saveAdmin(): Promise<void> {
    if (!this.cedula() || !this.email() || !this.role()) {
      this.toast.error('Error', 'Por favor complete todos los campos');
      return;
    }

    this.isLoading.set(true);

    try {
      const adminData = {
        cedula: this.cedula(),
        email: this.email(),
        role: this.role()
      };

      if (this.editingAdmin()) {
        // Update existing admin in Supabase Auth
        const { error } = await this.supabase.adminClient.auth.admin.updateUserById(
          this.editingAdmin()!.id,
          {
            email: this.email(), // Actualizar el email real del usuario
            app_metadata: adminData
          }
        );

        if (error) {
          this.toast.error('Error', error.message);
        } else {
          this.toast.success('Éxito', 'Administrador actualizado correctamente');
          this.closeForm();
          await this.loadAdmins();
        }
      } else {
        // Create new admin in Supabase Auth
        const { data, error } = await this.supabase.adminClient.auth.admin.createUser({
          email: this.email(),
          password: 'Temporal123!', // Contraseña temporal
          email_confirm: true,
          app_metadata: adminData
        });

        if (error) {
          this.toast.error('Error', error.message);
        } else {
          this.toast.success('Éxito', 'Administrador creado correctamente');
          this.closeForm();
          await this.loadAdmins();
        }
      }
    } catch (error) {
      console.error('Error saving admin:', error);
      this.toast.error('Error', 'Error al guardar administrador');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteAdmin(admin: User): Promise<void> {
    if (!confirm(`¿Estás seguro de eliminar al administrador ${admin.email}?`)) {
      return;
    }

    // Prevent deleting the last super admin
    if (admin.role === 'super_admin') {
      const superAdminCount = this.admins().filter(a => a.role === 'super_admin').length;
      if (superAdminCount <= 1) {
        this.toast.error('Error', 'No puedes eliminar el último Super Admin');
        return;
      }
    }

    this.isLoading.set(true);

    try {
      const { error } = await this.supabase.adminClient.auth.admin.deleteUser(admin.id);

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Administrador eliminado correctamente');
        await this.loadAdmins();
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      this.toast.error('Error', 'Error al eliminar administrador');
    } finally {
      this.isLoading.set(false);
    }
  }

  getRoleLabel(role: UserRole): string {
    return ROLE_LABELS[role];
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium';
      case 'admin':
        return 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
      case 'editor':
        return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium';
      default:
        return 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium';
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
