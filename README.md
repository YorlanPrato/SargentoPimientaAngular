# Sargento Pimienta 2.0 — Angular + Tailwind CSS

Migración del sitio web original (React + Tailwind) a **Angular 19 + Tailwind CSS 4**.

---

## Stack

| Tecnología | Versión | Notas |
|---|---|---|
| Angular | 19 | Standalone components, Signals |
| Tailwind CSS | 4.1 | vía `@tailwindcss/postcss` |
| TypeScript | 5.6 | strict mode |
| Angular Router | 19 | Lazy loading por página |

---

## Estructura del proyecto

```
src/
├── main.ts                          ← Bootstrap de la app
├── index.html
├── styles/
│   └── globals.css                  ← Tailwind v4 + design tokens CSS
└── app/
    ├── app.component.ts/.html       ← Shell: navbar + router-outlet + footer
    ├── app.config.ts                ← Configuración de providers Angular
    ├── app.routes.ts                ← Rutas con lazy loading
    ├── models/
    │   └── data.ts                  ← Datos estáticos (menú, eventos, horarios)
    ├── services/
    │   └── toast.service.ts         ← Servicio de notificaciones (signal-based)
    ├── components/
    │   ├── toast/
    │   │   └── toast.component.ts   ← Componente de toasts
    │   └── events-carousel/
    │       ├── events-carousel.component.ts
    │       └── events-carousel.component.html
    └── pages/
        ├── landing/
        │   ├── landing.component.ts
        │   └── landing.component.html
        ├── menu/
        │   ├── menu.component.ts
        │   └── menu.component.html
        ├── reservation/
        │   ├── reservation.component.ts
        │   └── reservation.component.html
        └── contact/
            ├── contact.component.ts
            └── contact.component.html
```

---

## Instalación y ejecución

### Requisitos previos
- Node.js 20+
- npm 10+

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:4200)
npm start

# 3. Build de producción
npm run build
```

---

## Equivalencias React → Angular

| React (original) | Angular (migración) |
|---|---|
| `useState()` | `signal()` de Angular |
| `useEffect()` | `ngOnInit()` / efectos reactivos |
| `sonner` (toast) | `ToastService` propio con Signals |
| React Router | `@angular/router` con lazy loading |
| Routing manual (`useState`) | `RouterLink` + `RouterLinkActive` |
| `lucide-react` | SVGs inline (sin dependencia externa) |
| shadcn/ui | Componentes propios con Tailwind |
| `className=` | `class=` / `[class]=` |
| `{condition && <div>}` | `@if (condition) { <div> }` |
| `{list.map(...)}` | `@for (item of list; track item.id) { }` |

---

## Design System (idéntico al original)

Las variables CSS en `globals.css` son las mismas del proyecto React:

| Variable | Valor | Uso |
|---|---|---|
| `--background` | `#121212` | Fondo principal |
| `--card` | `#1E1E1E` | Cards y secciones |
| `--muted` | `#2A2A2A` | Superficies secundarias |
| `--primary` | `#F59E0B` | Amarillo/dorado acento |
| `--foreground` | `#F5F5F4` | Texto principal |
| `--muted-foreground` | `#A8A8A8` | Texto secundario |
| `--destructive` | `#DC2626` | Rojo / no disponible |

**Tipografías:** `Urbanist` (headings) + `Inter` (cuerpo) — Google Fonts

---

## Páginas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `LandingComponent` | Hero + Carrusel eventos + Info local |
| `/carta` | `MenuComponent` | Carta con tabs por categoría |
| `/reservar` | `ReservationComponent` | Formulario de reservas con validación |
| `/contacto` | `ContactComponent` | Info + formulario de contacto |

---

## Próximos pasos sugeridos

- [ ] Integrar Google Maps en la página de contacto (`@angular/google-maps`)
- [ ] Conectar formularios a un backend real (API REST o Firebase)
- [ ] Añadir animaciones de transición entre páginas con `@angular/animations`
- [ ] Implementar PWA con `@angular/service-worker`
- [ ] Agregar más ítems al menú desde un JSON o API
