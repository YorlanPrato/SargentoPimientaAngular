import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { ToastService } from '../../../services/toast.service';
import { Evento } from '../../../models/supabase';

@Component({
  selector: 'app-admin-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-eventos.component.html',
})
export class AdminEventosComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private toast = inject(ToastService);

  eventos = signal<Evento[]>([]);
  isLoading = signal(true);
  isEditing = signal(false);
  editingItem = signal<Evento | null>(null);
  newItem = signal<Evento>({
    titulo: '',
    descripcion: '',
    fecha_evento: '',
    activo: true
  });
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);

  async ngOnInit(): Promise<void> {
    const { data: { session } } = await this.supabase.getSession();
    if (!session) {
      this.router.navigate(['/admin']);
      return;
    }
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading.set(true);
    const { data } = await this.supabase.getAllEventos();
    if (data) {
      this.eventos.set(data);
    }
    this.isLoading.set(false);
  }

  startEdit(item: Evento): void {
    this.isEditing.set(true);
    this.editingItem.set({ ...item });
  }

  startNew(): void {
    this.isEditing.set(true);
    this.editingItem.set({
      titulo: '',
      descripcion: '',
      fecha_evento: '',
      hora: '',
      artista: '',
      genero: '',
      activo: true
    });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editingItem.set(null);
    this.selectedFile.set(null);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
    }
  }

  async uploadImage(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.uploadImage('banners-eventos', file, fileName);
    
    if (error || !data) {
      this.toast.error('Error', 'No se pudo subir la imagen');
      return null;
    }

    const publicUrl = this.supabase.getPublicUrl('banners-eventos', data.path);
    return publicUrl;
  }

  async saveItem(): Promise<void> {
    const item = this.editingItem();
    if (!item) return;

    this.isUploading.set(true);

    let imageUrl: string | undefined = item.imagen_banner_url;

    if (this.selectedFile()) {
      imageUrl = await this.uploadImage(this.selectedFile()!) || undefined;
      if (!imageUrl) {
        this.isUploading.set(false);
        return;
      }
    }

    if (item.id) {
      const { error } = await this.supabase.updateEvento(item.id, {
        titulo: item.titulo,
        descripcion: item.descripcion,
        fecha_evento: item.fecha_evento,
        hora: item.hora,
        artista: item.artista,
        genero: item.genero,
        activo: item.activo,
        imagen_banner_url: imageUrl
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Evento actualizado');
      }
    } else {
      const { error } = await this.supabase.createEvento({
        titulo: item.titulo,
        descripcion: item.descripcion,
        fecha_evento: item.fecha_evento,
        hora: item.hora,
        artista: item.artista,
        genero: item.genero,
        activo: item.activo,
        imagen_banner_url: imageUrl
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Evento creado');
      }
    }

    this.isUploading.set(false);
    this.cancelEdit();
    await this.loadData();
  }

  async deleteItem(id: number): Promise<void> {
    if (!confirm('¿Está seguro de eliminar este evento?')) return;

    const { error } = await this.supabase.deleteEvento(id);
    if (error) {
      this.toast.error('Error', error.message);
    } else {
      this.toast.success('Éxito', 'Evento eliminado');
      await this.loadData();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
