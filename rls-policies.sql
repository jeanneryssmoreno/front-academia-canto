-- ============================================
-- RLS POLICIES - Resonance Academy
-- ============================================
-- EJECUTAR EN SUPABASE → SQL Editor
-- ============================================

-- ============================================
-- TABLA: profiles
-- ============================================

-- Usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Usuarios pueden actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Permitir insert en registro (necesario para signUp)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Admins pueden ver todos los perfiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Admins pueden actualizar cualquier perfil
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" 
ON profiles FOR UPDATE 
TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- TABLA: courses
-- ============================================

-- Todos los autenticados pueden ver cursos
DROP POLICY IF EXISTS "Authenticated users can read courses" ON courses;
CREATE POLICY "Authenticated users can read courses" 
ON courses FOR SELECT 
TO authenticated 
USING (true);

-- Solo admins pueden crear/editar cursos
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
CREATE POLICY "Admins can manage courses" 
ON courses FOR ALL 
TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- TABLA: classes
-- ============================================

-- Estudiantes pueden ver clases programadas
DROP POLICY IF EXISTS "Students can view scheduled classes" ON classes;
CREATE POLICY "Students can view scheduled classes" 
ON classes FOR SELECT 
TO authenticated 
USING (
    status = 'scheduled' OR 
    teacher_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Profesores pueden crear sus propias clases
DROP POLICY IF EXISTS "Teachers can create classes" ON classes;
CREATE POLICY "Teachers can create classes" 
ON classes FOR INSERT 
TO authenticated 
WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher' AND
    teacher_id = auth.uid()
);

-- Profesores pueden actualizar sus propias clases
DROP POLICY IF EXISTS "Teachers can update own classes" ON classes;
CREATE POLICY "Teachers can update own classes" 
ON classes FOR UPDATE 
TO authenticated 
USING (teacher_id = auth.uid());

-- Profesores pueden eliminar sus propias clases
DROP POLICY IF EXISTS "Teachers can delete own classes" ON classes;
CREATE POLICY "Teachers can delete own classes" 
ON classes FOR DELETE 
TO authenticated 
USING (teacher_id = auth.uid());

-- Admins pueden gestionar todas las clases
DROP POLICY IF EXISTS "Admins can manage all classes" ON classes;
CREATE POLICY "Admins can manage all classes" 
ON classes FOR ALL 
TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- TABLA: enrollments
-- ============================================

-- Estudiantes pueden ver sus propias inscripciones
DROP POLICY IF EXISTS "Students can view own enrollments" ON enrollments;
CREATE POLICY "Students can view own enrollments" 
ON enrollments FOR SELECT 
TO authenticated 
USING (
    student_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
);

-- Estudiantes pueden inscribirse
DROP POLICY IF EXISTS "Students can enroll" ON enrollments;
CREATE POLICY "Students can enroll" 
ON enrollments FOR INSERT 
TO authenticated 
WITH CHECK (
    student_id = auth.uid() AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'student'
);

-- Estudiantes pueden cancelar sus inscripciones
DROP POLICY IF EXISTS "Students can cancel enrollments" ON enrollments;
CREATE POLICY "Students can cancel enrollments" 
ON enrollments FOR DELETE 
TO authenticated 
USING (student_id = auth.uid());

-- Admins pueden gestionar todas las inscripciones
DROP POLICY IF EXISTS "Admins can manage enrollments" ON enrollments;
CREATE POLICY "Admins can manage enrollments" 
ON enrollments FOR ALL 
TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- TABLA: payments
-- ============================================

-- Estudiantes pueden ver sus propios pagos
DROP POLICY IF EXISTS "Students can view own payments" ON payments;
CREATE POLICY "Students can view own payments" 
ON payments FOR SELECT 
TO authenticated 
USING (
    student_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Solo admins pueden crear/actualizar pagos
DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
CREATE POLICY "Admins can manage payments" 
ON payments FOR ALL 
TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- TABLA: teachers_metadata
-- ============================================

-- Profesores pueden ver su propia metadata
DROP POLICY IF EXISTS "Teachers can view own metadata" ON teachers_metadata;
CREATE POLICY "Teachers can view own metadata" 
ON teachers_metadata FOR SELECT 
TO authenticated 
USING (
    id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Profesores pueden actualizar su propia metadata
DROP POLICY IF EXISTS "Teachers can update own metadata" ON teachers_metadata;
CREATE POLICY "Teachers can update own metadata" 
ON teachers_metadata FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- Profesores pueden crear su metadata al registrarse
DROP POLICY IF EXISTS "Teachers can insert own metadata" ON teachers_metadata;
CREATE POLICY "Teachers can insert own metadata" 
ON teachers_metadata FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());

-- Admins pueden gestionar toda la metadata
DROP POLICY IF EXISTS "Admins can manage teachers metadata" ON teachers_metadata;
CREATE POLICY "Admins can manage teachers metadata" 
ON teachers_metadata FOR ALL 
TO authenticated 
USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ============================================
-- FIN DE POLÍTICAS RLS
-- ============================================
-- Todas las tablas deben tener RLS habilitado:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE teachers_metadata ENABLE ROW LEVEL SECURITY;
-- ============================================
