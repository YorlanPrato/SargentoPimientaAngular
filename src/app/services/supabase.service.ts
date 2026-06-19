import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = (import.meta as any).env?.['SUPABASE_URL'] || 'https://mbtqfihaqdvofudfdpbw.supabase.co';
    const supabaseAnonKey = (import.meta as any).env?.['SUPABASE_ANON_KEY'] || 'sb_publishable_55PinTLjnU1CYVdARWfgUw_1MTKMdnU';
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // Reservas
  async getReservas() {
    return await this.supabase.from('reservas').select('*');
  }

  async createReserva(reserva: any) {
    return await this.supabase.from('reservas').insert(reserva);
  }

  async updateReserva(id: number, reserva: any) {
    return await this.supabase.from('reservas').update(reserva).eq('id', id);
  }

  async deleteReserva(id: number) {
    return await this.supabase.from('reservas').delete().eq('id', id);
  }

  // Menú
  async getMenu() {
    return await this.supabase.from('menu').select('*, categorias(*)');
  }

  async createPlato(plato: any) {
    return await this.supabase.from('menu').insert(plato);
  }

  async updatePlato(id: string, plato: any) {
    return await this.supabase.from('menu').update(plato).eq('id', id);
  }

  async deletePlato(id: string) {
    return await this.supabase.from('menu').delete().eq('id', id);
  }

  // Categorías
  async getCategorias() {
    return await this.supabase.from('categorias').select('*');
  }

  async createCategoria(categoria: any) {
    return await this.supabase.from('categorias').insert(categoria);
  }

  async updateCategoria(id: string, categoria: any) {
    return await this.supabase.from('categorias').update(categoria).eq('id', id);
  }

  async deleteCategoria(id: string) {
    return await this.supabase.from('categorias').delete().eq('id', id);
  }

  // Eventos
  async getEventos() {
    return await this.supabase.from('eventos').select('*').eq('activo', true);
  }

  async getAllEventos() {
    return await this.supabase.from('eventos').select('*');
  }

  async createEvento(evento: any) {
    return await this.supabase.from('eventos').insert(evento);
  }

  async updateEvento(id: number, evento: any) {
    return await this.supabase.from('eventos').update(evento).eq('id', id);
  }

  async deleteEvento(id: number) {
    return await this.supabase.from('eventos').delete().eq('id', id);
  }

  // Subida de imágenes
  async uploadImage(bucket: string, file: File, fileName: string) {
    console.log('=== UPLOAD IMAGE ===');
    console.log('Bucket:', bucket);
    console.log('File:', file);
    console.log('FileName:', fileName);
    console.log('FileSize:', file.size);
    console.log('FileType:', file.type);

    const { data, error } = await this.supabase.storage.from(bucket).upload(fileName, file);

    console.log('Upload data:', data);
    console.log('Upload error:', error);

    return { data, error };
  }

  async getPublicUrl(bucket: string, path: string) {
    console.log('=== GET PUBLIC URL ===');
    console.log('Bucket:', bucket);
    console.log('Path:', path);

    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);

    console.log('Public URL data:', data);
    console.log('Public URL:', data.publicUrl);

    return data.publicUrl;
  }

  async deleteImage(bucket: string, path: string) {
    return await this.supabase.storage.from(bucket).remove([path]);
  }
}
