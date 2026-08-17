# Configuración de Roles con Supabase Auth (app_metadata)

Este sistema usa `app_metadata` de Supabase Auth para gestionar roles, eliminando la necesidad de una tabla `admin_users` separada.

## 1. Migración desde el sistema anterior

Si vienes del sistema anterior con tabla `admin_users`, sigue estos pasos:

### Paso 1: Eliminar políticas que dependen de admin_users

```sql
-- Eliminar políticas RLS que dependen de admin_users
DROP POLICY IF EXISTS "Only super admin can update reservas config" ON reservas_config;
DROP POLICY IF EXISTS "Admins can manage menu" ON menu;
DROP POLICY IF EXISTS "Admins can manage eventos" ON eventos;
DROP POLICY IF EXISTS "Admins can manage informacion" ON informacion;

-- Eliminar políticas de admin_users
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Super admin can create admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admin can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admin can delete admin users" ON admin_users;
```

### Paso 2: Eliminar tabla admin_users

```sql
-- Eliminar índices
DROP INDEX IF EXISTS idx_admin_users_cedula;
DROP INDEX IF EXISTS idx_admin_users_email;

-- Eliminar la tabla admin_users
DROP TABLE IF EXISTS admin_users CASCADE;
```

### Paso 3: Eliminar usuarios antiguos de Supabase Auth

Ve a Supabase Dashboard → Authentication → Users y elimina los usuarios existentes.

## 2. Configuración de Supabase Auth

No se requiere configuración adicional de tablas. Los roles se almacenan directamente en `app_metadata` de cada usuario en Supabase Auth.

## 3. Crear el primer Super Admin

Como no hay usuarios, necesitas crear el primero manualmente:

1. Ve a Supabase Dashboard → Authentication → Users
2. Click en "Add user"
3. Ingresa el email del super admin
4. Click en "Save"
5. Luego edita el usuario y en "User Metadata" (app_metadata) agrega:
   ```json
   {
     "role": "super_admin",
     "cedula": "12345678"
   }
   ```
6. Establece una contraseña manualmente o envía invitación

**Importante:** Reemplaza `'12345678'` con la cédula real del super admin.

## 4. Configurar service_role_key en la aplicación

Para que las operaciones de gestión de usuarios funcionen, necesitas configurar el `service_role_key`:

```typescript
// En tu archivo environment.ts o supabase.service.ts
export const environment = {
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SERVICE_ROLE_KEY' // Usa el service_role_key, no el anon key
};
```

El `service_role_key` se encuentra en: Supabase Dashboard → Project Settings → API → service_role (secret)

## 5. Proceso para crear nuevos administradores

El proceso para crear nuevos administradores es:

1. **Desde la interfaz web (solo Super Admin):**
   - Ve a `/admin/admins` (Gestión de Admins)
   - Click en "+ Nuevo Administrador"
   - Ingresa: cédula, email y rol
   - Click en "Guardar"
   - El sistema crea automáticamente el usuario en Supabase Auth con el rol asignado

2. **El usuario recibirá:**
   - Un email de confirmación
   - Una contraseña temporal: `Temporal123!`
   - Deberá cambiarla en el primer login

**Nota:** La cédula se almacena en `app_metadata` por temas de seguridad local, aunque no se usa para el login (el login usa email).

## 4. Configurar políticas RLS (opcional)

Si necesitas proteger otras tablas basándote en roles, puedes usar políticas RLS que verifican el rol en `app_metadata`:

```sql
-- Políticas para reservas (solo super_admin y admin)
CREATE POLICY "Admins can manage reservas"
ON reservas FOR ALL
TO authenticated
USING (
  auth.jwt()->>'role' IN ('super_admin', 'admin')
);

-- Políticas para menú (todos los roles)
CREATE POLICY "All roles can manage menu"
ON menu FOR ALL
TO authenticated
USING (
  auth.jwt()->>'role' IN ('super_admin', 'admin', 'editor')
);

-- Políticas para eventos (todos los roles)
CREATE POLICY "All roles can manage eventos"
ON eventos FOR ALL
TO authenticated
USING (
  auth.jwt()->>'role' IN ('super_admin', 'admin', 'editor')
);

-- Políticas para información del sitio (todos los roles)
CREATE POLICY "All roles can manage informacion"
ON sitio_info FOR ALL
TO authenticated
USING (
  auth.jwt()->>'role' IN ('super_admin', 'admin', 'editor')
);

-- Políticas para configuración de reservas (solo super_admin)
CREATE POLICY "Super admin only can manage reservas config"
ON reservas_config FOR ALL
TO authenticated
USING (
  auth.jwt()->>'role' = 'super_admin'
);
```

## 5. Configurar recuperación de contraseña

La recuperación de contraseña usa el sistema nativo de Supabase Auth:

1. El usuario solicita recuperación desde el login
2. Supabase envía un email con enlace de recuperación
3. El usuario establece nueva contraseña
4. El rol se mantiene en `app_metadata` (no se pierde)

## 6. Notas importantes

- **Roles disponibles:** `super_admin` (Administrador Jefe), `admin` (Administrador), y `editor` (Editor)
- **Permisos por rol:**
  - **super_admin:** Acceso total, incluyendo gestión de usuarios
  - **admin:** Gestión de reservas, menú, eventos e información del sitio
  - **editor:** Gestión de menú, eventos e información del sitio (sin reservas)
- **Solo un Super Admin:** El sistema previene eliminar el último Super Admin
- **Seguridad:** Los roles están en `app_metadata` (solo accesible desde el servidor)
- **No se requiere tabla `admin_users`:** Todo se gestiona desde Supabase Auth
- **Admin API:** Las operaciones de gestión de usuarios requieren el service role key
- **Contraseña temporal:** Los nuevos usuarios reciben `Temporal123!` y deben cambiarla

## 7. Verificar configuración

Para verificar que todo está configurado correctamente:

```sql
-- Ver todos los admin users
SELECT * FROM auth.users;

-- Ver políticas de RLS para admin_users
SELECT * FROM pg_policies WHERE tablename = 'auth.users';
```

## 9. Probar el sistema

1. Inicia sesión usando el email y la contraseña
2. Verifica que el sistema reconozca el rol correctamente
3. Como Super Admin, prueba crear un nuevo admin desde `/admin/admins`
4. Verifica que los permisos funcionen correctamente
5. Prueba la recuperación de contraseña usando el email

## 10. Notas importantes

- **El email en Supabase Auth debe coincidir exactamente** con el email en la tabla `admin_users`
- **Solo los `super_admin` pueden gestionar otros admin users** (crear, editar, eliminar)
- **Solo habrá un Super Admin** en el sistema
- Los `admin` pueden gestionar reservas, eventos y menú pero no configuración del sistema ni otros admins
- La cédula se almacena en la tabla `admin_users` por temas de seguridad local
- No se puede eliminar el último Super Admin del sistema
- Si necesitas cambiar el rol de un usuario, actualiza el campo `role` en la tabla `admin_users`
