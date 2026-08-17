import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../types/roles';

export function roleGuard(requiredRoles: UserRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticatedSignal()) {
      router.navigate(['/admin']);
      return false;
    }

    const userRole = authService.userRole();
    if (!userRole || !requiredRoles.includes(userRole)) {
      router.navigate(['/admin/dashboard']);
      return false;
    }

    return true;
  };
}

export function superAdminGuard(): CanActivateFn {
  return roleGuard(['super_admin']);
}

export function adminGuard(): CanActivateFn {
  return roleGuard(['super_admin', 'admin']);
}
