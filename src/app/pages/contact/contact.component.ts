import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

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
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  private supabase = inject(SupabaseService);

  isLoading = signal(true);
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
    await this.loadInformation();
  }

  async loadInformation(): Promise<void> {
    this.isLoading.set(true);

    const { data: contactoData, error: contactoError } = await this.supabase.getSitioInfo('contacto');
    if (contactoData && !contactoError) {
      this.contactoInfo.set(contactoData);
    }

    this.isLoading.set(false);
  }

  formatPipeSeparated(value: string | undefined): string {
    if (!value) return '';
    return value.replace(/\|/g, '<br>');
  }
}
