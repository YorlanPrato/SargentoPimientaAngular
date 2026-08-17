# Guía de Usuario y Mantenimiento
## Sistema de Gestión Web - Sargento Pimienta 2.0

---

## Índice

1. [Presentación del Sistema](#presentación-del-sistema)
2. [Versiones del Software](#versiones-del-software)
3. [Credenciales de Acceso](#credenciales-de-acceso)
4. [Sistema de Gestión (CMS)](#sistema-de-gestión-cms)
5. [Supabase - Gestión de Backend](#supabase---gestión-de-backend)
6. [Netlify - Despliegue y Dominios](#netlify---despliegue-y-dominios)
7. [Solución de Problemas Comunes](#solución-de-problemas-comunes)
8. [Cambio de Dominio](#cambio-de-dominio)
9. [Mantenimiento Periódico](#mantenimiento-periódico)

---

## Presentación del Sistema

El sistema de gestión web de Sargento Pimienta 2.0 es una plataforma completa para la administración del restaurante, que incluye:

- **Gestión de Reservas:** Control de reservas de clientes, configuración de mesas y comensales máximos
- **Gestión de Menú:** Administración de platos disponibles
- **Gestión de Eventos:** Control de eventos especiales, artistas y promociones
- **Gestión de Información:** Edición de datos generales del sitio web
- **Gestión de Usuarios:** Control de accesos administrativos con diferentes roles

### Arquitectura del Sistema

```
Frontend (Angular) → Supabase (Backend + Auth + Database) → Netlify (Hosting)
```

---

## Versiones del Software

### Frontend
- **Framework:** Angular 19.0.0
- **TypeScript:** 5.6.0
- **TailwindCSS:** 3.4.0
- **Build Tool:** Angular CLI 19.0.0
- **Package Manager:** npm

### Bibliotecas Principales
- **@supabase/supabase-js:** 2.107.0 (Cliente de Supabase)
- **jspdf:** 4.2.1 (Generación de PDF)
- **lucide-angular:** 0.477.0 (Iconos)
- **rxjs:** 7.8.0 (Programación reactiva)
- **zone.js:** 0.15.0 (Zona de cambio de Angular)

### Servicios Externos
- **Supabase:** Backend-as-a-Service (versión actual al desarrollo)
- **Netlify:** Plataforma de hosting (versión actual al desarrollo)
- **Google reCAPTCHA:** Protección contra bots (versión actual al desarrollo)

### Entorno de Desarrollo
- **Node.js:** [CONFIGURAR]
- **npm:** [CONFIGURAR]

---

## Credenciales de Acceso

### Panel de Administración (CMS)
- **URL:** `https://sargento-pimienta.netlify.app/admin`
- **Usuario:** Administrador Jefe (super_admin)
- **Contraseña:** [CONFIGURAR]
- **Recuperación:** Sistema de recuperación por email integrado

### Supabase Dashboard
- **URL:** `https://supabase.com/dashboard`
- **Proyecto:** Sargento Pimienta
- **Usuario:** [CONFIGURAR]
- **Contraseña:** [CONFIGURAR]

### Netlify Dashboard
- **URL:** `https://app.netlify.com`
- **Sitio:** Sargento Pimienta
- **Usuario:** [CONFIGURAR]
- **Contraseña:** [CONFIGURAR]

### Claves Importantes (Guardar en lugar seguro)

**Supabase:**
- **Project URL:** `https://mbtqfihaqdvofudfdpbw.supabase.co`
- **Anon Key:** `sb_publishable_55PinTLjnU1CYVdARWfgUw_1MTKMdnU`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idHFmaWhhcWR2b2Z1ZGZkcGJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQyODQwNSwiZXhwIjoyMDk1MDA0NDA1fQ.1dsSdyCgSpbwD7chVudSMoYKJhOOAQRtJjKVYvYwuMM`

**Netlify:**
- **Site ID:** [CONFIGURAR]
- **API Key:** [CONFIGURAR]

---

## Sistema de Gestión (CMS)

### Roles de Usuario

El sistema cuenta con 3 niveles de acceso:

#### 1. Administrador Jefe (super_admin)
- **Acceso total** a todas las funcionalidades
- Gestión de usuarios administrativos
- Configuración del sistema
- Gestión de reservas, menú, eventos e información

#### 2. Administrador (admin)
- Gestión de reservas
- Gestión de menú
- Gestión de eventos
- Gestión de información del sitio
- **Sin acceso** a gestión de usuarios

#### 3. Editor (editor)
- Gestión de menú
- Gestión de eventos
- Gestión de información del sitio
- **Sin acceso** a reservas ni usuarios

### Funcionalidades del CMS

#### Gestión de Reservas
- **Ver reservas:** Listado completo con estado
- **Editar reservas:** Modificar datos de clientes, fechas, mesas
- **Eliminar reservas:** Cancelar reservas existentes
- **Configurar límites:** Establecer comensales máximos y número de mesas

#### Gestión de Menú
- **Agregar platos:** Crear nuevos items del menú
- **Editar platos:** Modificar nombre, descripción, precio, imagen
- **Eliminar platos:** Quitar items del menú
- **Gestión de categorías:** Organizar por tipo de plato

#### Gestión de Eventos
- **Crear eventos:** Agregar nuevos eventos especiales
- **Editar eventos:** Modificar fecha, artista, descripción, banner
- **Activar/Desactivar:** Control de visibilidad de eventos
- **Gestión de banners:** Subir imágenes promocionales

#### Gestión de Información
- **Datos del restaurante:** Horarios, dirección, teléfono
- **Información de contacto:** Email, redes sociales
- **Políticas del establecimiento:** Términos y condiciones

#### Gestión de Usuarios
- **Crear administradores:** Generar nuevos usuarios con roles
- **Editar usuarios:** Modificar roles y datos de acceso
- **Eliminar usuarios:** Revocar accesos (excepto el último super_admin)
- **Contraseñas temporales:** Sistema automático de generación

### Flujo de Trabajo Típico

1. **Iniciar sesión:** Acceder al panel con credenciales
2. **Seleccionar módulo:** Elegir la sección a gestionar
3. **Realizar cambios:** Crear, editar o eliminar contenido
4. **Guardar cambios:** Confirmar modificaciones
5. **Verificar:** Revisar cambios en el sitio web

---

## Supabase - Gestión de Backend

### ¿Qué es Supabase?

Supabase es la plataforma backend que proporciona:
- **Autenticación:** Gestión de usuarios y sesiones
- **Base de datos:** Almacenamiento de datos (reservas, menú, eventos)
- **Storage:** Almacenamiento de imágenes (banners, fotos de platos)
- **API REST:** Interfaz de comunicación con el frontend

### Estructura de Datos

#### Tablas Principales
- **reservas:** Datos de reservas de clientes
- **menu:** Items del menú del restaurante
- **eventos:** Eventos especiales y promociones
- **sitio_info:** Información general del establecimiento
- **reservas_config:** Configuración de límites de reservas

#### Autenticación
- **auth.users:** Usuarios del sistema administrativo
- **app_metadata:** Almacenamiento de roles y datos adicionales

### Gestión de Usuarios en Supabase

#### Ver Usuarios
1. Acceder a Supabase Dashboard
2. Ir a Authentication → Users
3. Ver listado de usuarios con sus roles

#### Crear Usuario Manualmente
1. Authentication → Users → Add user
2. Ingresar email
3. Editar usuario → User Metadata (app_metadata)
4. Agregar:
   ```json
   {
     "role": "super_admin",
     "cedula": "12345678"
   }
   ```
5. Establecer contraseña

#### Resetear Contraseña
1. Authentication → Users
2. Seleccionar usuario
3. Click en "Reset password"
4. Enviar email de recuperación

#### Solución de Problemas con Usuarios

**Problema: Usuario no puede iniciar sesión**
- Verificar que el email sea correcto
- Confirmar que el usuario esté en Authentication → Users
- Verificar que tenga `app_metadata` con rol asignado
- Resetear contraseña desde Supabase Dashboard

**Problema: Usuario sin permisos**
- Verificar el rol en `app_metadata`
- Confirmar que el rol sea válido: `super_admin`, `admin`, o `editor`
- Actualizar el rol si es necesario

**Problema: Error de autenticación**
- Verificar que el usuario esté confirmado
- Revisar logs de autenticación en Supabase
- Verificar que el service_role_key esté configurado correctamente

### Gestión de Base de Datos

#### SQL Editor
Para consultas directas a la base de datos:
1. Supabase Dashboard → SQL Editor
2. Escribir consulta SQL
3. Ejecutar y revisar resultados

#### Consultas Útiles
```sql
-- Ver todas las reservas
SELECT * FROM reservas ORDER BY fecha DESC;

-- Ver reservas pendientes
SELECT * FROM reservas WHERE estado = 'pendiente';

-- Ver eventos activos
SELECT * FROM eventos WHERE activo = true;

-- Ver configuración de reservas
SELECT * FROM reservas_config;
```

### Storage (Almacenamiento de Imágenes)

#### Buckets
- **banners-eventos:** Imágenes de eventos especiales
- **menu-images:** Fotos de platos del menú

#### Gestión de Archivos
1. Storage → Seleccionar bucket
2. Ver archivos existentes
3. Subir nuevos archivos
4. Eliminar archivos no utilizados

---

## Netlify - Despliegue y Dominios

### ¿Qué es Netlify?

Netlify es la plataforma de hosting que:
- **Aloja el frontend:** Servidor web para la aplicación Angular
- **Gestiona dominios:** Configuración de URLs y DNS
- **Automatiza despliegues:** Integración con Git
- **Proporciona HTTPS:** Certificados SSL automáticos

### Configuración Actual

- **Sitio:** Sargento Pimienta
- **URL actual:** `https://sargento-pimienta.netlify.app`
- **Framework:** Angular
- **Build command:** `ng build`
- **Publish directory:** `dist/sargento-pimienta`

### Gestión de Despliegues

#### Despliegue Manual
1. Acceder a Netlify Dashboard
2. Seleccionar el sitio
3. Click en "Deploys"
4. Click en "Trigger deploy"
5. Seleccionar rama (main)
6. Confirmar despliegue

#### Despliegue Automático
Los despliegues se activan automáticamente al:
- Hacer push a la rama principal
- Crear un pull request
- Fusionar cambios

### Variables de Entorno

Las variables de entorno en Netlify deben incluir:
- `SUPABASE_URL`: URL del proyecto Supabase
- `SUPABASE_ANON_KEY`: Clave pública de Supabase
- `SUPABASE_SERVICE_KEY`: Clave de servicio de Supabase

**Importante:** La `SUPABASE_SERVICE_KEY` está configurada directamente en el código por ahora, pero debería migrarse a variables de entorno.

---

## Solución de Problemas Comunes

### Problemas de Autenticación

#### Usuario no puede iniciar sesión
1. **Verificar credenciales:** Confirmar email y contraseña
2. **Verificar estado del usuario:** En Supabase Dashboard → Authentication → Users
3. **Resetear contraseña:** Usar función de recuperación
4. **Verificar rol:** Confirmar que tenga `app_metadata` con rol válido

#### Error de permisos
1. **Verificar rol del usuario:** En Supabase Dashboard
2. **Confirmar permisos del rol:** Revisar configuración en el código
3. **Actualizar rol si es necesario:** Editar `app_metadata`

### Problemas de Datos

#### Reservas no se muestran
1. **Verificar conexión a Supabase:** Revisar consola del navegador
2. **Verificar políticas RLS:** En Supabase Dashboard → Database → Policies
3. **Verificar datos:** Usar SQL Editor para confirmar datos existentes

#### Imágenes no cargan
1. **Verificar bucket de Storage:** En Supabase Dashboard
2. **Verificar permisos del bucket:** Debe ser público
3. **Verificar URL de la imagen:** Confirmar que sea correcta

### Problemas de Despliegue

#### Sitio no actualiza después de cambios
1. **Verificar despliegue:** En Netlify Dashboard → Deploys
2. **Limpiar caché:** Ctrl+F5 en el navegador
3. **Verificar rama:** Confirmar que los cambios estén en la rama correcta

#### Error de compilación
1. **Verificar logs de compilación:** En Netlify Dashboard
2. **Verificar dependencias:** `npm install` localmente
3. **Verificar configuración de Angular:** Revisar `angular.json`

---

## Cambio de Dominio

### Proceso de Cambio de Dominio

#### 1. Adquirir Nuevo Dominio
- Comprar dominio en proveedor (GoDaddy, Namecheap, etc.)
- Configurar DNS apuntando a Netlify

#### 2. Configurar Dominio en Netlify
1. Netlify Dashboard → Domain settings
2. Click en "Add custom domain"
3. Ingresar nuevo dominio
4. Configurar DNS según instrucciones de Netlify

#### 3. Actualizar Servicios y Claves

**Supabase:**
- **No requiere cambios** (el dominio del frontend no afecta a Supabase)

**Netlify:**
- Actualizar dominio principal en Domain settings
- Configurar redirecciones del dominio antiguo al nuevo

**Google reCAPTCHA:**
- Acceder a Google reCAPTCHA Console: https://www.google.com/recaptcha/admin
- Seleccionar el sitio existente o crear uno nuevo
- Agregar el nuevo dominio en la lista de dominios autorizados
- Obtener nuevas claves (Site Key y Secret Key)
- Actualizar las claves en el código de la aplicación
- **Importante:** Mantener el dominio antiguo durante la transición

**Código de la Aplicación:**
- Actualizar claves de reCAPTCHA si cambiaron
- Verificar URLs absolutas en el código (si existen)
- Actualizar variables de entorno si se usan

**Variables de Entorno:**
- Actualizar `RECAPTCHA_SITE_KEY` si cambió
- Actualizar `RECAPTCHA_SECRET_KEY` si cambió
- No requieren cambios Supabase URLs (son independientes del dominio)

#### 4. Verificar Funcionalidad
- Probar todas las rutas del nuevo dominio
- Verificar autenticación
- Confirmar carga de imágenes
- Probar formularios y reservas
- **Verificar reCAPTCHA:** Probar que el captcha funcione correctamente en el nuevo dominio

#### 5. Configurar Redirecciones
En Netlify, configurar redirección 301 del dominio antiguo:
```netlify.toml
[[redirects]]
  from = "https://sargento-pimienta.netlify.app/*"
  to = "https://nuevo-dominio.com/:splat"
  status = 301
```

### Checklist de Cambio de Dominio

- [ ] Adquirir nuevo dominio
- [ ] Configurar DNS para Netlify
- [ ] Agregar dominio en Netlify Dashboard
- [ ] Verificar certificado SSL
- [ ] Probar funcionalidad completa
- [ ] Configurar redirecciones
- [ ] Actualizar documentación
- [ ] Notificar a usuarios del cambio

---

## Mantenimiento Periódico

### Tareas Diarias
- **Monitorear reservas:** Revisar nuevas reservas pendientes
- **Verificar eventos:** Confirmar eventos del día
- **Revisar logs:** Buscar errores en consola

### Tareas Semanales
- **Backup de datos:** Exportar datos importantes de Supabase
- **Revisar usuarios:** Verificar actividad de administradores
- **Actualizar contenido:** Revisar y actualizar menú, eventos
- **Verificar imágenes:** Eliminar archivos no utilizados

### Tareas Mensuales
- **Revisar seguridad:** Actualizar contraseñas si es necesario
- **Auditoría de usuarios:** Eliminar usuarios inactivos
- **Optimizar imágenes:** Comprimir imágenes grandes
- **Verificar dependencias:** Actualizar paquetes npm

### Tareas Trimestrales
- **Revisar políticas RLS:** Verificar seguridad de base de datos
- **Auditoría de accesos:** Revisar logs de autenticación
- **Plan de contingencia:** Preparar procedimientos de emergencia
- **Capacitación:** Actualizar conocimientos del equipo

### Tareas Anuales
- **Renovar dominios:** Verificar vencimiento de dominios
- **Revisar costos:** Evaluar costos de servicios
- **Actualizar documentación:** Revisar y actualizar guías
- **Plan de mejoras:** Identificar áreas de mejora

---

### Recursos Adicionales
- **Documentación de Supabase:** https://supabase.com/docs
- **Documentación de Angular:** https://angular.io/docs
- **Documentación de Netlify:** https://docs.netlify.com

---

## Notas Finales

Esta guía debe mantenerse actualizada con cualquier cambio en el sistema. Se recomienda revisar periódicamente la configuración y actualizar la documentación según sea necesario.

**Última actualización:** Agosto 2026
**Versión del sistema:** 1.0
