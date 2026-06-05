import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { Menu, Categoria } from '../../models/supabase';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  private supabase = inject(SupabaseService);

  categories = signal<Categoria[]>([]);
  menuItems = signal<Menu[]>([]);
  activeCategory = signal<string>('');

  currentItems = computed<Menu[]>(() => {
    if (!this.activeCategory()) return [];
    return this.menuItems().filter(item => item.categoria_id === this.categories().find(c => c.nombre === this.activeCategory())?.id);
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    const [categoriasData, menuData] = await Promise.all([
      this.supabase.getCategorias(),
      this.supabase.getMenu()
    ]);

    if (categoriasData.data) {
      this.categories.set(categoriasData.data);
      if (categoriasData.data.length > 0) {
        this.activeCategory.set(categoriasData.data[0].nombre);
      }
    }

    if (menuData.data) {
      this.menuItems.set(menuData.data);
    }
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }
}
