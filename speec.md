# Especificaciones - 3 Fases de Implementación

## Fase 1: Explorar → Clases de profesores
- Al hacer clic en "Explorar" en el panel de estudiante, mostrar SOLO las clases que los profesores hayan publicado (status: scheduled)
- Cada tarjeta muestra: nombre del curso, nivel, descripción, nombre del profesor, fecha/hora, botón "Inscribirme"
- Si no hay clases disponibles, mostrar mensaje "No hay clases disponibles en este momento"
- Archivos: `src/pages/student/CourseCatalog.tsx`, `src/hooks/useEnrollments.ts`

## Fase 2: Mi Perfil → Información del estudiante
- Al hacer clic en "Mi Perfil" en el panel de estudiante, mostrar la información del estudiante
- Campos visibles: nombre completo, email, rol
- Permitir editar el nombre completo
- Archivo: `src/pages/Profile.tsx`

## Fase 3: Pantalla principal (Landing) separada del panel
- La Landing page (con Antigravity 3D) solo se muestra en la ruta `/` cuando el usuario NO ha iniciado sesión
- Si el usuario ya inició sesión y visita `/`, redirigir automáticamente a su dashboard según su rol
- La Landing NO debe aparecer dentro del panel de estudiante ni profesor
- Archivo: `src/App.tsx`, `src/pages/Landing.tsx`
