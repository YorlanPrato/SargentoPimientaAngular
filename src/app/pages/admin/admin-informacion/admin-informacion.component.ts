import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { ToastService } from '../../../services/toast.service';

interface SitioInfo {
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  atmosphere?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  instagram?: string;
  facebook?: string;
}

@Component({
  selector: 'app-admin-informacion',
  standalone: true,
  templateUrl: './admin-informacion.component.html'
})
export class AdminInformacionComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private toast = inject(ToastService);

  isLoading = signal(true);
  isEditing = signal(false);

  // Signals para información de Inicio
  inicioInfo = signal<SitioInfo>({
    section: 'inicio',
    title: '',
    subtitle: '',
    atmosphere: '',
    address: '',
    hours: '',
    instagram: ''
  });

  // Signals para información de Contacto
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

  // Copia de seguridad para cancelar edición
  originalInicioInfo: SitioInfo | null = null;
  originalContactoInfo: SitioInfo | null = null;

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
    if (inicioError) {
      this.toast.error('Error', 'Error al cargar información de Inicio');
    } else if (inicioData) {
      this.inicioInfo.set(inicioData);
    }

    const { data: contactoData, error: contactoError } = await this.supabase.getSitioInfo('contacto');
    if (contactoError) {
      this.toast.error('Error', 'Error al cargar información de Contacto');
    } else if (contactoData) {
      this.contactoInfo.set(contactoData);
    }

    this.isLoading.set(false);
  }

  startEdit(): void {
    this.originalInicioInfo = { ...this.inicioInfo() };
    this.originalContactoInfo = { ...this.contactoInfo() };
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    if (this.originalInicioInfo) {
      this.inicioInfo.set(this.originalInicioInfo);
    }
    if (this.originalContactoInfo) {
      this.contactoInfo.set(this.originalContactoInfo);
    }
    this.isEditing.set(false);
    this.originalInicioInfo = null;
    this.originalContactoInfo = null;
  }

  async saveInformation(): Promise<void> {
    this.isLoading.set(true);

    const { error: inicioError } = await this.supabase.updateSitioInfo('inicio', this.inicioInfo());
    if (inicioError) {
      this.toast.error('Error', 'Error al guardar información de Inicio');
      this.isLoading.set(false);
      return;
    }

    const { error: contactoError } = await this.supabase.updateSitioInfo('contacto', this.contactoInfo());
    if (contactoError) {
      this.toast.error('Error', 'Error al guardar información de Contacto');
      this.isLoading.set(false);
      return;
    }

    this.toast.success('Éxito', 'Información actualizada correctamente');
    this.isEditing.set(false);
    this.originalInicioInfo = null;
    this.originalContactoInfo = null;
    this.isLoading.set(false);
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
