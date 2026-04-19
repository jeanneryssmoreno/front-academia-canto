# Plan Simplificado - Resonance Academy | Producción

**Fecha:** 18 de Abril, 2026  
**Estado:** En Progreso  
**Objetivo:** Preparar para producción con cambios mínimos necesarios

---

## 📊 Auditoría de Base de Datos

### Tablas Existentes ✅
1. **profiles** - Información básica de usuarios
2. **teachers_metadata** - Datos específicos de profesores (SOLAMENTE id, bio, specialty, hourly_rate)
3. **courses** - Catálogo de cursos
4. **classes** - Clases programadas
5. **enrollments** - Inscripciones de estudiantes
6. **payments** - Pagos de estudiantes

---

### Tabla `profiles` - ESTRUCTURA ACTUAL

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY,              -- ✅ Existe
    full_name TEXT NOT NULL,          -- ✅ Existe
    email TEXT NOT NULL,              -- ✅ Existe
    role USER_ROLE DEFAULT 'student', -- ✅ Existe
    avatar_url TEXT,                  -- ✅ Existe
    created_at TIMESTAMP DEFAULT now() -- ✅ Existe
)
```

### Tabla `teachers_metadata` - ESTRUCTURA ACTUAL

```sql
CREATE TABLE teachers_metadata (
    id UUID PRIMARY KEY,        -- ✅ Existe (FK a profiles)
    bio TEXT,                   -- ✅ Existe
    specialty TEXT,             -- ✅ Existe
    hourly_rate NUMERIC         -- ✅ Existe
)
```

---

## 🔴 CAMPOS CRÍTICOS a Agregar (Lo Mínimo)

### En `profiles` - Solo 3 campos nuevos:

1. **`phone`** - Para contactar al usuario
2. **`updated_at`** - Auditoría de cambios
3. **`is_active`** - Poder desactivar usuarios sin borrar

### En `teachers_metadata` - Solo 2 campos:

1. **`is_verified`** - Profesor verificado por admin
2. **`updated_at`** - Auditoría de cambios

---

## 🔧 SQL Simplificado (Copiar y Pegar en Supabase)

```sql
-- ============================================
-- CAMPOS MÍNIMOS NECESARIOS
-- ============================================

-- En profiles: contacto y auditoría
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- En teachers_metadata: verificación
ALTER TABLE teachers_metadata ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE teachers_metadata ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- ============================================
-- TRIGGERS: Auto actualizar updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS teachers_metadata_updated_at ON teachers_metadata;
CREATE TRIGGER teachers_metadata_updated_at
BEFORE UPDATE ON teachers_metadata
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ÍNDICES para performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
```

---

## 📋 TypeScript Types (Actualizar `database.ts`)

```typescript
export interface Profile {
    id: string
    full_name: string
    email: string
    role: UserRole
    avatar_url: string | null
    created_at: string
    // NUEVOS
    phone?: string | null
    is_active?: boolean
    updated_at?: string | null
}

export interface TeacherMetadata {
    id: string
    bio: string | null
    specialty: string | null
    hourly_rate: number | null
    // NUEVOS
    is_verified?: boolean
    updated_at?: string | null
}
```

---

## ✅ Checklist Mínimo de Producción

### Base de Datos
- [ ] Ejecutar SQL de migraciones arriba
- [ ] Verificar que RLS policies permiten acceso correcto
- [ ] Actualizar types en `database.ts`

### Seguridad Básica
- [ ] HTTPS en Vercel (automático)
- [ ] Variables de entorno en Vercel configuradas
- [ ] `.env.local` en `.gitignore`

### Performance
- [ ] Build sin errores: `npm run build`
- [ ] Verificar que no hay console.errors en producción

### Testing Manual
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Estudiante puede inscribirse
- [ ] Profesor puede crear clase
- [ ] Admin puede ver todo

---

## 🚀 Pasos para Deploy

1. **Ejecutar SQL** (copia el bloque de arriba en Supabase SQL Editor)
2. **Actualizar tipos**: Reemplazar `Profile` y `TeacherMetadata` en `src/types/database.ts`
3. **Build local**: `npm run build` (verificar 0 errores)
4. **Push a GitHub**: `git add . && git commit -m "Add phone and audit fields" && git push`
5. **Vercel deploy automático** (monitorear en dashboard)
6. **Test en producción** (login, inscribirse, crear clase)

---

## 📌 Mejoras Futuras (Opcional - Fase 2)

Estos NO son necesarios para lanzar, pero pueden agregarse después:

- [ ] Fecha de nacimiento
- [ ] Preferencias de notificación
- [ ] Perfil público del profesor
- [ ] Sistema de ratings
- [ ] Calendario integrado
- [ ] Notificaciones por email

---

**¿Todo listo?** ¿Ejecutamos el SQL ahora?
