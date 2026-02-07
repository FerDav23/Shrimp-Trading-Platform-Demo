# Plataforma de Comercialización de Camarón - Frontend

Plataforma frontend para la comercialización de camarón en Ecuador. Centraliza ofertas de empacadoras para que productores vendan, con gestión de logística integrada.

## Stack Tecnológico

- **React 18** con TypeScript
- **Vite** como bundler
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **date-fns** para manejo de fechas

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── contexts/        # Contextos de React (Auth)
├── data/           # Datos dummy (users, offers, sales, logistics)
├── layouts/        # Layouts principales
├── pages/          # Páginas por rol
│   ├── producer/   # Páginas del productor
│   ├── packer/     # Páginas de la empacadora
│   ├── logistics/  # Páginas de logística
│   └── manager/    # Páginas del administrador
├── types/          # Tipos TypeScript
└── App.tsx         # Componente principal con rutas
```

## Autenticación Fake

El sistema utiliza autenticación local con usuarios dummy. Al iniciar sesión, puedes seleccionar uno de los 4 usuarios disponibles:

1. **Juan Pérez** (PRODUCER) - Productor
2. **ROSASUD S.A.S.** (PACKER) - Empacadora
3. **Grupo FJ Logística** (LOGISTICS) - Logística
4. **Admin FJ** (MANAGER) - Administrador

El usuario seleccionado se guarda en `localStorage` y determina el dashboard y las páginas accesibles según su rol.

## Roles y Permisos

- **PRODUCER**: Puede ver ofertas, crear ventas, ver historial de ventas
- **PACKER**: Puede crear y gestionar ofertas, ver ventas recibidas
- **LOGISTICS**: Puede gestionar envíos, ver tarifas, certificados
- **MANAGER**: Acceso completo a usuarios, ofertas, ventas y aprobaciones

## Datos Dummy

Todos los datos están en archivos dentro de `src/data/`:
- `users.ts` - Usuarios del sistema
- `offers.ts` - Ofertas de empacadoras
- `sales.ts` - Ventas realizadas
- `logistics.ts` - Tarifas y camiones de logística

## Notas

- Esta es una aplicación **solo frontend** sin backend ni base de datos
- Todos los cambios son simulados (alertas) y no persisten entre recargas
- Los datos están hardcodeados en archivos TypeScript
- El diseño es responsive y sigue un estilo SaaS moderno
