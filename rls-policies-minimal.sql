-- ============================================
-- RLS POLICIES MÍNIMAS - Para Producción
-- ============================================
-- Solo lo ESENCIAL para que funcione
-- ============================================

-- PROFILES: Ver y editar propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- COURSES: Todos pueden leer (ya existe, pero por si acaso)
DROP POLICY IF EXISTS "Authenticated users can read courses" ON courses;
CREATE POLICY "Authenticated users can read courses" 
ON courses FOR SELECT 
TO authenticated 
USING (true);

-- CLASSES: Ver clases y profesores gestionar las suyas
DROP POLICY IF EXISTS "Users can view classes" ON classes;
CREATE POLICY "Users can view classes" 
ON classes FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Teachers can manage own classes" ON classes;
CREATE POLICY "Teachers can manage own classes" 
ON classes FOR ALL 
TO authenticated 
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- ENROLLMENTS: Estudiantes inscribirse y ver sus inscripciones
DROP POLICY IF EXISTS "Users can view enrollments" ON enrollments;
CREATE POLICY "Users can view enrollments" 
ON enrollments FOR SELECT 
TO authenticated 
USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can enroll" ON enrollments;
CREATE POLICY "Students can enroll" 
ON enrollments FOR INSERT 
TO authenticated 
WITH CHECK (student_id = auth.uid());

-- PAYMENTS: Ver propios pagos
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" 
ON payments FOR SELECT 
TO authenticated 
USING (student_id = auth.uid());

-- ============================================
-- LISTO! Esto es suficiente para arrancar
-- Las políticas de admin se pueden agregar después
-- ============================================
