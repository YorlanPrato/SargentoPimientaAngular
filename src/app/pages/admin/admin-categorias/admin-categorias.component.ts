import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { ToastService } from '../../../services/toast.service';
import { Categoria } from '../../../models/supabase';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categorias.component.html',
})
export class AdminCategoriasComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private toast = inject(ToastService);

  categorias = signal<Categoria[]>([]);
  isLoading = signal(true);
  isEditing = signal(false);
  editingItem = signal<Categoria | null>(null);
  newItem = signal<Categoria>({ nombre: '' });

  async ngOnInit(): Promise<void> {
    if (!localStorage.getItem('adminAuthenticated')) {
      this.router.navigate(['/admin']);
      return;
    }
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading.set(true);
    const { data } = await this.supabase.getCategorias();
    if (data) {
      this.categorias.set(data);
    }
    this.isLoading.set(false);
  }

  startEdit(item: Categoria): void {
    this.isEditing.set(true);
    this.editingItem.set({ ...item });
  }

  startNew(): void {
    this.isEditing.set(true);
    this.editingItem.set({ nombre: '' });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editingItem.set(null);
  }

  async saveItem(): Promise<void> {
    const item = this.editingItem();
    if (!item || !item.nombre) return;

    if (item.id) {
      const { error } = await this.supabase.updateCategoria(item.id, {
        nombre: item.nombre
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Categoría actualizada');
      }
    } else {
      const { error } = await this.supabase.createCategoria({
        nombre: item.nombre
      });

      if (error) {
        this.toast.error('Error', error.message);
      } else {
        this.toast.success('Éxito', 'Categoría creada');
      }
    }

    this.cancelEdit();
    await this.loadData();
  }

  async deleteItem(id: string): Promise<void> {
    if (!confirm('¿Está seguro de eliminar esta categoría?')) return;

    const { error } = await this.supabase.deleteCategoria(id);
    if (error) {
      this.toast.error('Error', error.message);
    } else {
      this.toast.success('Éxito', 'Categoría eliminada');
      await this.loadData();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
