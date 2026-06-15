export interface Reserva {
  id?: number;
  cedula: string;
  nombre_cliente: string;
  telefono: string;
  fecha: string;
  hora: string;
  comensales: number;
  estado: string;
  numero_mesa?: number;
  creado_en?: string;
}

export interface Menu {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen_url?: string;
  disponible: boolean;
  creado_en?: string;
  categorias?: Categoria;
}

export interface Categoria {
  id?: number;
  nombre: string;
  creado_en?: string;
}

export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha_evento: string;
  hora?: string;
  artista?: string;
  genero?: string;
  imagen_banner_url?: string;
  activo: boolean;
  creado_en?: string;
}
