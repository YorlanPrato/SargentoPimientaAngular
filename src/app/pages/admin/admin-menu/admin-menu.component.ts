import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { ToastService } from '../../../services/toast.service';
import { Menu, Categoria } from '../../../models/supabase';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-menu.component.html',
  styleUrls: []
})
export class AdminMenuComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private toast = inject(ToastService);

  menuItems = signal<Menu[]>([]);
  categorias = signal<Categoria[]>([]);
  isLoading = signal(true);
  isEditing = signal(false);
  isEditingCategoria = signal(false);
  editingItem = signal<Menu | null>(null);
  editingCategoria = signal<Categoria | null>(null);
  newItem = signal<Menu>({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria_id: '',
    disponible: true
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
    const [menuData, categoriasData] = await Promise.all([
      this.supabase.getMenu(),
      this.supabase.getCategorias()
    ]);

    if (menuData.data) this.menuItems.set(menuData.data);
    if (categoriasData.data) this.categorias.set(categoriasData.data);
    this.isLoading.set(false);
  }

  startEdit(item: Menu): void {
    this.isEditing.set(true);
    this.editingItem.set({ ...item });
  }

  startNew(): void {
    console.log('=== START NEW ===');
    console.log('Categorias disponibles:', this.categorias());
    console.log('Primera categoria ID:', this.categorias()[0]?.id);

    this.isEditing.set(true);
    this.editingItem.set({
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria_id: this.categorias()[0]?.id || '',
      disponible: true
    });

    console.log('Editing item after startNew:', this.editingItem());
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
    const { data, error } = await this.supabase.uploadImage('imagenes-menu', file, fileName);
    
    if (error || !data) {
      this.toast.error('Error', 'No se pudo subir la imagen');
      return null;
    }

    const publicUrl = this.supabase.getPublicUrl('imagenes-menu', data.path);
    return publicUrl;
  }

  async saveItem(): Promise<void> {
    const item = this.editingItem();
    if (!item) return;

    console.log('=== SAVE ITEM ===');
    console.log('Item:', item);
    console.log('Categoria ID:', item.categoria_id);
    console.log('Categoria ID type:', typeof item.categoria_id);

    if (!item.categoria_id) {
      this.toast.error('Error', 'Por favor selecciona una categoría');
      return;
    }

    this.isUploading.set(true);

    let imageUrl: string | undefined = item.imagen_url;

    if (this.selectedFile()) {
      imageUrl = await this.uploadImage(this.selectedFile()!) || undefined;
      if (!imageUrl) {
        this.isUploading.set(false);
        return;
      }
    }

    if (item.id) {
      const { error } = await this.supabase.updatePlato(item.id, {
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        categoria_id: item.categoria_id,
        disponible: item.disponible,
        imagen_url: imageUrl
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Plato actualizado');
      }
    } else {
      const { error } = await this.supabase.createPlato({
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        categoria_id: item.categoria_id,
        disponible: item.disponible,
        imagen_url: imageUrl
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Plato creado');
      }
    }

    this.isUploading.set(false);
    this.cancelEdit();
    await this.loadData();
  }

  async deleteItem(id: string): Promise<void> {
    if (!confirm('¿Está seguro de eliminar este plato?')) return;

    const { error } = await this.supabase.deletePlato(id);
    if (error) {
      this.toast.error('Error', error.message);
    } else {
      this.toast.success('Éxito', 'Plato eliminado');
      await this.loadData();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  parseInt(value: string): number {
    return parseInt(value, 10);
  }

  // Métodos para gestión de categorías
  startEditCategoria(categoria: Categoria): void {
    this.isEditingCategoria.set(true);
    this.editingCategoria.set({ ...categoria });
  }

  startNewCategoria(): void {
    this.isEditingCategoria.set(true);
    this.editingCategoria.set({
      nombre: ''
    });
  }

  cancelEditCategoria(): void {
    this.isEditingCategoria.set(false);
    this.editingCategoria.set(null);
  }

  async saveCategoria(): Promise<void> {
    const categoria = this.editingCategoria();
    if (!categoria) return;

    if (!categoria.nombre.trim()) {
      this.toast.error('Error', 'El nombre de la categoría es requerido');
      return;
    }

    if (categoria.id) {
      const { error } = await this.supabase.updateCategoria(categoria.id, {
        nombre: categoria.nombre
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Categoría actualizada');
      }
    } else {
      const { error } = await this.supabase.createCategoria({
        nombre: categoria.nombre
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Categoría creada');
      }
    }

    this.cancelEditCategoria();
    await this.loadData();
  }

  // Obtener platos agrupados por categoría
  getItemsByCategoria(): Map<string, Menu[]> {
    const grouped = new Map<string, Menu[]>();
    for (const item of this.menuItems()) {
      const catId = item.categoria_id || 'sin-categoria';
      if (!grouped.has(catId)) {
        grouped.set(catId, []);
      }
      grouped.get(catId)!.push(item);
    }
    return grouped;
  }

  getCategoriaNombre(categoriaId: string): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }

  // Métodos para filtrado en template
  getItemsByCategoriaId(categoriaId: string | undefined): Menu[] {
    if (!categoriaId) return [];
    return this.menuItems().filter(m => m.categoria_id === categoriaId);
  }

  getItemsWithoutCategoria(): Menu[] {
    return this.menuItems().filter(m => !m.categoria_id);
  }

  hasItemsWithoutCategoria(): boolean {
    return this.menuItems().some(m => !m.categoria_id);
  }

  async handleDeleteCategoria(id: string | undefined): Promise<void> {
    if (!id) return;
    if (!confirm('¿Está seguro de eliminar esta categoría? Los platos asociados perderán su categoría.')) return;

    const { error } = await this.supabase.deleteCategoria(id);
    if (error) {
      this.toast.error('Error', error.message);
    } else {
      this.toast.success('Éxito', 'Categoría eliminada');
      await this.loadData();
    }
  }
}
