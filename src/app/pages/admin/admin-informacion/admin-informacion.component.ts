import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { ToastService } from '../../../services/toast.service';

interface SitioInfo {
  id?: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  instagram?: string;
  facebook?: string;
  atmosphere?: string;
}

@Component({
  selector: 'app-admin-informacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-informacion.component.html',
})
export class AdminInformacionComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private toast = inject(ToastService);

  isLoading = signal(true);
  isEditing = signal(false);

  // Sección Inicio
  inicioInfo = signal<SitioInfo>({
    section: 'inicio',
    title: '',
    subtitle: '',
    atmosphere: '',
    address: '',
    hours: '',
    instagram: ''
  });

  // Sección Contacto
  contactoInfo = signal<SitioInfo>({
    section: 'contacto',
    title: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    instagram: '',
    facebook: ''
  });

  async ngOnInit(): Promise<void> {
    const { data: { session } } = await this.supabase.getSession();
    if (!session) {
      this.router.navigate(['/admin']);
      return;
    }
    await this.loadInformation();
  }

  async loadInformation(): Promise<void> {
    this.isLoading.set(true);
    
    const { data: inicioData, error: inicioError } = await this.supabase.getSitioInfo('inicio');
    if (inicioData && !inicioError) {
      this.inicioInfo.set(inicioData);
    }

    const { data: contactoData, error: contactoError } = await this.supabase.getSitioInfo('contacto');
    if (contactoData && !contactoError) {
      this.contactoInfo.set(contactoData);
    }
    
    this.isLoading.set(false);
  }

  startEdit(): void {
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.loadInformation();
  }

  async saveInformation(): Promise<void> {
    this.isLoading.set(true);
    
    const inicio = this.inicioInfo();
    const contacto = this.contactoInfo();

    const { error: inicioError } = await this.supabase.updateSitioInfo('inicio', {
      title: inicio.title,
      subtitle: inicio.subtitle,
      atmosphere: inicio.atmosphere,
      address: inicio.address,
      hours: inicio.hours,
      instagram: inicio.instagram
    });

    if (inicioError) {
      this.toast.error('Error', 'Error al guardar información de Inicio');
      this.isLoading.set(false);
      return;
    }

    const { error: contactoError } = await this.supabase.updateSitioInfo('contacto', {
      title: contacto.title,
      description: contacto.description,
      address: contacto.address,
      phone: contacto.phone,
      email: contacto.email,
      hours: contacto.hours,
      instagram: contacto.instagram,
      facebook: contacto.facebook
    });

    if (contactoError) {
      this.toast.error('Error', 'Error al guardar información de Contacto');
      this.isLoading.set(false);
      return;
    }

    this.toast.success('Éxito', 'Información actualizada correctamente');
    this.isEditing.set(false);
    this.isLoading.set(false);
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  formatPipeSeparated(value: string | undefined): string {
    if (!value) return '';
    return value.replace(/\|/g, '<br>');
  }
}
