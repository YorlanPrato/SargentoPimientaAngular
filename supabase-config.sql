-- Script para crear tabla de configuración de reservas
-- Ejecutar esto en el SQL Editor de Supabase

-- Crear tabla de configuración de reservas
CREATE TABLE IF NOT EXISTS reservas_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  max_comensales INTEGER NOT NULL DEFAULT 10,
  num_mesas INTEGER NOT NULL DEFAULT 20,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar configuración inicial
INSERT INTO reservas_config (max_comensales, num_mesas)
VALUES (10, 20)
ON CONFLICT DO NOTHING;

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_reservas_config_updated_at
  BEFORE UPDATE ON reservas_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE reservas_config ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos (público)
CREATE POLICY "Permitir lectura de configuración de reservas a todos"
  ON reservas_config FOR SELECT
  USING (true);

-- Política para permitir actualización solo a usuarios autenticados
CREATE POLICY "Permitir actualización de configuración de reservas a autenticados"
  ON reservas_config FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política para permitir inserción solo a usuarios autenticados
CREATE POLICY "Permitir inserción de configuración de reservas a autenticados"
  ON reservas_config FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ─── Tabla de Información del Sitio ───────────────────────────────────────

-- Crear tabla de información del sitio
CREATE TABLE IF NOT EXISTS sitio_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- 'inicio' o 'contacto'
  title TEXT,
  subtitle TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  hours TEXT,
  instagram TEXT,
  facebook TEXT,
  atmosphere TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(section)
);

-- Insertar información inicial - Sección Inicio
INSERT INTO sitio_info (section, title, subtitle, atmosphere, address, hours, instagram)
VALUES (
  'inicio',
  'Sargento Pimienta 2.0',
  'Donde la música se encuentra con la gastronomía excepcional',
  'Sumérgete en la atmósfera bohemia de nuestro bar-restaurante, donde cada noche es una celebración del rock clásico y la cocina contemporánea. Desde los acordes de las guitarras hasta los sabores exquisitos de nuestros platos, cada detalle está diseñado para crear momentos inolvidables.',
  'Calle 14 entre carrera 20 y 21, Barrio Obrero, San Cristóbal, Táchira',
  'Sábado - Jueves: 5:00 PM - 02:00 AM|Domingo - Lunes: Cerrado',
  'https://www.instagram.com/sargentopimienta_sc/'
)
ON CONFLICT (section) DO NOTHING;

-- Insertar información inicial - Sección Contacto
INSERT INTO sitio_info (section, title, description, address, phone, email, hours, instagram, facebook)
VALUES (
  'contacto',
  'Contacto',
  '¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.',
  'Calle 14 entre carrera 20 y 21, Barrio Obrero, San Cristóbal, Táchira',
  '0276-3550841',
  'info@sargentopimienta.com|reservas@sargentopimienta.com',
  'Sábado - Jueves: 5:00 PM - 02:00 AM|Domingo - Lunes: Cerrado',
  'https://www.instagram.com/sargentopimienta_sc/',
  'https://www.facebook.com/sargentopimientaSC/?locale=es_LA'
)
ON CONFLICT (section) DO NOTHING;

-- Crear trigger para actualizar updated_at en sitio_info
CREATE TRIGGER update_sitio_info_updated_at
  BEFORE UPDATE ON sitio_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE sitio_info ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos
CREATE POLICY "Permitir lectura de información del sitio a todos"
  ON sitio_info FOR SELECT
  USING (true);

-- Política para permitir actualización solo a usuarios autenticados
CREATE POLICY "Permitir actualización de información del sitio a autenticados"
  ON sitio_info FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política para permitir inserción solo a usuarios autenticados
CREATE POLICY "Permitir inserción de información del sitio a autenticados"
  ON sitio_info FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
