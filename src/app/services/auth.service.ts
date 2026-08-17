import { Injectable, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, UserRole, RolePermissions, ROLE_PERMISSIONS } from '../types/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  currentUserSignal = this.currentUser.asReadonly();
  isAuthenticatedSignal = this.isAuthenticated.asReadonly();

  userRole = computed<UserRole | null>(() => this.currentUser()?.role || null);
  permissions = computed<RolePermissions>(() => {
    const role = this.userRole();
    return role ? ROLE_PERMISSIONS[role] : ROLE_PERMISSIONS.admin;
  });

  constructor(private supabaseService: SupabaseService) {
    this.loadCurrentUser();
  }

  async loadCurrentUser(): Promise<void> {
    console.log('loadCurrentUser called');
    const { data: { user } } = await this.supabaseService.client.auth.getUser();
    console.log('User from auth:', user);
    
    if (user?.email && user?.app_metadata) {
      const role = user.app_metadata['role'] as UserRole;
      const cedula = user.app_metadata['cedula'] as string;
      
      console.log('User role from app_metadata:', role);
      console.log('User cedula from app_metadata:', cedula);
      
      if (role) {
        this.currentUser.set({
          id: user.id,
          email: user.email || '',
          role: role,
          cedula: cedula,
          created_at: user.created_at
        });
        this.isAuthenticated.set(true);
        console.log('User set in authService:', this.currentUser());
      } else {
        console.log('No role found in app_metadata');
      }
    } else {
      console.log('No user or app_metadata found');
    }
  }

  async loginWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const role = data.user.app_metadata?.['role'] as UserRole;
        const cedula = data.user.app_metadata?.['cedula'] as string;
        
        if (role) {
          this.currentUser.set({
            id: data.user.id,
            email: data.user.email || '',
            role: role,
            cedula: cedula,
            created_at: data.user.created_at
          });
          this.isAuthenticated.set(true);
          return { success: true };
        } else {
          return { success: false, error: 'Usuario no tiene rol asignado' };
        }
      }

      return { success: false, error: 'Error al iniciar sesión' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar primero si el usuario existe en Supabase Auth
      const { data: { users }, error: listError } = await this.supabaseService.adminClient.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError);
        return { success: false, error: 'Error al verificar usuario' };
      }

      // Buscar usuario por email
      const userExists = users.some(user => user.email === email);
      
      if (!userExists) {
        return { success: false, error: 'El correo electrónico no está registrado en el sistema' };
      }

      // Si el usuario existe, enviar correo de recuperación
      const { error } = await this.supabaseService.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Error al enviar correo de recuperación' };
    }
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabaseService.client.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: 'Error al actualizar contraseña' };
    }
  }

  hasPermission(permission: keyof RolePermissions): boolean {
    return this.permissions()[permission];
  }

  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }

  isSuperAdmin(): boolean {
    return this.userRole() === 'super_admin';
  }

  isAdmin(): boolean {
    return this.userRole() === 'admin';
  }

  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
