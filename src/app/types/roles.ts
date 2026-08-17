export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  cedula?: string;
  created_at?: string;
}

export interface RolePermissions {
  canManageAdmins: boolean;
  canManageReservas: boolean;
  canManageMenu: boolean;
  canManageEventos: boolean;
  canManageInformacion: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canManageAdmins: true,
    canManageReservas: true,
    canManageMenu: true,
    canManageEventos: true,
    canManageInformacion: true,
  },
  admin: {
    canManageAdmins: false,
    canManageReservas: true,
    canManageMenu: true,
    canManageEventos: true,
    canManageInformacion: true,
  },
  editor: {
    canManageAdmins: false,
    canManageReservas: false,
    canManageMenu: true,
    canManageEventos: true,
    canManageInformacion: true,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Administrador Jefe',
  admin: 'Administrador',
  editor: 'Editor',
};
