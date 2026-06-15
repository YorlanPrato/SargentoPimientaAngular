import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { ToastService } from '../../../services/toast.service';
import { Reserva } from '../../../models/supabase';

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reservas.component.html',
})
export class AdminReservasComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private toast = inject(ToastService);

  reservas = signal<Reserva[]>([]);
  isLoading = signal(true);
  editingReserva = signal<Reserva | null>(null);

  async ngOnInit(): Promise<void> {
    if (!localStorage.getItem('adminAuthenticated')) {
      this.router.navigate(['/admin']);
      return;
    }
    await this.loadReservas();
  }

  async loadReservas(): Promise<void> {
    this.isLoading.set(true);
    const { data } = await this.supabase.getReservas();
    if (data) {
      this.reservas.set(data);
    }
    this.isLoading.set(false);
  }

  editReserva(reserva: Reserva): void {
    this.editingReserva.set({ ...reserva });
  }

  cancelEdit(): void {
    this.editingReserva.set(null);
  }

  async saveReserva(): Promise<void> {
    const reserva = this.editingReserva();
    if (!reserva || !reserva.id) return;

    const { error } = await this.supabase.updateReserva(reserva.id, {
      nombre_cliente: reserva.nombre_cliente,
      telefono: reserva.telefono,
      fecha: reserva.fecha,
      hora: reserva.hora,
      comensales: reserva.comensales,
      estado: reserva.estado,
      numero_mesa: reserva.numero_mesa
    });

    if (error) {
      this.toast.error('Error', error.message);
    } else {
      this.toast.success('Éxito', 'Reserva actualizada');
      this.editingReserva.set(null);
      await this.loadReservas();
    }
  }

  async deleteReserva(id: number): Promise<void> {
    if (!confirm('¿Está seguro de eliminar esta reserva?')) return;

    const { error } = await this.supabase.deleteReserva(id);
    if (error) {
      this.toast.error('Error', error.message);
    } else {
      this.toast.success('Éxito', 'Reserva eliminada');
      await this.loadReservas();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  parseInt(value: string): number {
    return parseInt(value, 10);
  }
}
