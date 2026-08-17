import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://mbtqfihaqdvofudfdpbw.supabase.co';
    const supabaseAnonKey = 'sb_publishable_55PinTLjnU1CYVdARWfgUw_1MTKMdnU';
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idHFmaWhhcWR2b2Z1ZGZkcGJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQyODQwNSwiZXhwIjoyMDk1MDA0NDA1fQ.1dsSdyCgSpbwD7chVudSMoYKJhOOAQRtJjKVYvYwuMM';
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Cliente con service_role_key para operaciones de administración
    if (supabaseServiceKey) {
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    } else {
      console.warn('Service role key no configurado. Las operaciones de administración no funcionarán.');
      this.supabaseAdmin = this.supabase;
    }
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get adminClient(): SupabaseClient {
    return this.supabaseAdmin;
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

  // Auth
  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getSession() {
    return await this.supabase.auth.getSession();
  }

  // OTP para verificación de reservas
  async sendOtp(email: string) {
    return await this.supabase.auth.signInWithOtp({
      email: email
    });
  }

  async verifyOtp(email: string, token: string) {
    return await this.supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'email'
    });
  }

  // Configuración de Reservas
  async getReservasConfig() {
    return await this.supabase.from('reservas_config').select('*').single();
  }

  async updateReservasConfig(config: { max_comensales: number; num_mesas: number }) {
    return await this.supabase.from('reservas_config').update(config).eq('id', (await this.getReservasConfig()).data?.id);
  }

  // Información del Sitio
  async getSitioInfo(section: string) {
    return await this.supabase.from('sitio_info').select('*').eq('section', section).single();
  }

  async getAllSitioInfo() {
    return await this.supabase.from('sitio_info').select('*');
  }

  async updateSitioInfo(section: string, data: any) {
    return await this.supabase.from('sitio_info').update(data).eq('section', section);
  }

  // Admin Users
  async getAdminUsers() {
    return await this.supabase.from('admin_users').select('*');
  }

  async getAdminUserByCedula(cedula: string) {
    return await this.supabase.from('admin_users').select('*').eq('cedula', cedula).single();
  }

  async getAdminUserByEmail(email: string) {
    return await this.supabase.from('admin_users').select('*').eq('email', email).single();
  }

  async createAdminUser(adminUser: any) {
    return await this.supabase.from('admin_users').insert(adminUser);
  }

  async updateAdminUser(id: string, adminUser: any) {
    return await this.supabase.from('admin_users').update(adminUser).eq('id', id);
  }

  async deleteAdminUser(id: string) {
    return await this.supabase.from('admin_users').delete().eq('id', id);
  }

  // Métodos para gestión de usuarios con app_metadata (requiere service_role_key)
  async createAdminUserWithMetadata(email: string, password: string, role: string, cedula: string) {
    return await this.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        role,
        cedula
      }
    });
  }

  async updateUserMetadata(userId: string, metadata: any) {
    return await this.supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: metadata
    });
  }

  async deleteUser(userId: string) {
    return await this.supabaseAdmin.auth.admin.deleteUser(userId);
  }
}
