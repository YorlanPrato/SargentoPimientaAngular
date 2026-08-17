import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../types/roles';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    this.updateView(roles);
  }

  private updateView(roles: UserRole | UserRole[]): void {
    this.viewContainer.clear();

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const userRole = this.authService.userRole();

    if (userRole && requiredRoles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
