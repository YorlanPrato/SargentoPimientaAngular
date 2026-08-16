import { Component, signal, inject, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { SupabaseService } from '../../services/supabase.service';
import { OPERATING_HOURS } from '../../models/data';
import { Reserva } from '../../models/supabase';
import { SmsConfirmationModalComponent } from '../../components/sms-confirmation-modal/sms-confirmation-modal.component';
import jsPDF from 'jspdf';

type NationalityType = 'V' | 'E';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FormsModule, CommonModule, SmsConfirmationModalComponent],
  templateUrl: './reservation.component.html',
})
export class ReservationComponent implements AfterViewInit {
  private toast = inject(ToastService);
  private supabase = inject(SupabaseService);

  readonly operatingHours = OPERATING_HOURS;
  guestOptions = signal<number[]>([1, 2, 3, 4, 5]);
  tableOptions = signal<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  readonly today = new Date().toISOString().split('T')[0];

  nationality = signal<NationalityType>('V');
  idNumber    = signal('');
  fullName    = signal('');
  phone       = signal('');
  guests      = signal<number | null>(null);
  selectedDate = signal('');
  selectedTime = signal('');
  selectedTable = signal<number | null>(null);
  availableTables = signal<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  reservas = signal<Reserva[]>([]);
  recaptchaToken = signal('');
  recaptchaSiteKey = (import.meta as any).env?.['RECAPTCHA_SITE_KEY'] || '6LcaeCAtAAAAAJITlUfGGbA1M5F-V0WI4tutTyN0';
  
  // SMS Confirmation
  showSmsModal = signal(false);
  pendingReserva = signal<Reserva | null>(null);
  customerEmail = signal('');

  formatTo12Hour(time24: string): string {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  onIdChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const numbers = raw.replace(/\D/g, '');
    this.idNumber.set(numbers.slice(0, 9));
  }

  onPhoneChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.phone.set(raw.slice(0, 11));
  }

  onNationalityChange(event: Event): void {
    this.nationality.set((event.target as HTMLSelectElement).value as NationalityType);
  }

  onDateChange(event: Event): void {
    this.selectedDate.set((event.target as HTMLInputElement).value);
    this.loadAvailableTables();
  }

  onTimeChange(event: Event): void {
    this.selectedTime.set((event.target as HTMLSelectElement).value);
    this.loadAvailableTables();
  }

  onNameChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    // Solo permitir letras, espacios, tildes, dieresis, ñ y apóstrofes
    const validChars = raw.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s']/g, '');
    this.fullName.set(validChars);
  }

  setGuests(n: number): void {
    this.guests.set(n);
  }

  onRecaptchaResolved(token: string): void {
    this.recaptchaToken.set(token);
  }

  onRecaptchaError(): void {
    this.recaptchaToken.set('');
    this.toast.error('Error de verificación', 'Por favor completa el reCAPTCHA');
  }

  ngAfterViewInit(): void {
    this.loadRecaptchaScript();
    this.loadConfig();
    this.loadReservas();
  }

  async loadReservas(): Promise<void> {
    const { data, error } = await this.supabase.getReservas();
    if (data) {
      this.reservas.set(data);
    } else if (error) {
      console.error('Error loading reservas:', error);
    }
  }

  async loadConfig(): Promise<void> {
    const { data, error } = await this.supabase.getReservasConfig();
    if (data) {
      const maxGuests = data.max_comensales;
      const numTables = data.num_mesas;
      
      this.guestOptions.set(Array.from({ length: maxGuests }, (_, i) => i + 1));
      this.tableOptions.set(Array.from({ length: numTables }, (_, i) => i + 1));
      this.availableTables.set(Array.from({ length: numTables }, (_, i) => i + 1));
    } else if (error) {
      console.error('Error loading config:', error);
    }
  }

  loadRecaptchaScript(): void {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(() => this.renderRecaptcha(), 500);
    };
    document.head.appendChild(script);
  }

  renderRecaptcha(): void {
    const container = document.getElementById('recaptcha-container');
    if (container && (window as any).grecaptcha && (window as any).grecaptcha.render) {
      try {
        (window as any).grecaptcha.render(container, {
          sitekey: this.recaptchaSiteKey,
          callback: (token: string) => this.onRecaptchaResolved(token),
          'error-callback': () => this.onRecaptchaError(),
          'expired-callback': () => this.onRecaptchaError()
        });
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
      }
    } else {
      console.error('grecaptcha not available or render function not found');
    }
  }

  setTable(n: number): void {
    this.selectedTable.set(n);
  }

  async loadAvailableTables(): Promise<void> {
    if (!this.selectedDate() || !this.selectedTime()) {
      this.availableTables.set(this.tableOptions());
      return;
    }

    const occupiedTables = this.reservas()
      .filter((r: Reserva) => r.fecha === this.selectedDate() && r.hora === this.selectedTime())
      .map((r: Reserva) => r.numero_mesa);

    const available = this.tableOptions().filter((table: number) => !occupiedTables.includes(table));
    this.availableTables.set(available);

    if (this.selectedTable() && !available.includes(this.selectedTable()!)) {
      this.selectedTable.set(null);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.idNumber() &&
      this.fullName() &&
      this.phone() &&
      this.phone().length >= 10 &&
      this.selectedDate() &&
      this.selectedTime() &&
      this.guests() &&
      this.selectedTable()
    );
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid()) {
      this.toast.error('Campos incompletos', 'Por favor complete todos los campos correctamente');
      return;
    }

    const reserva: Reserva = {
      cedula: `${this.nationality()}-${this.idNumber()}`,
      nombre_cliente: this.fullName(),
      telefono: this.phone(),
      fecha: this.selectedDate(),
      hora: this.selectedTime(),
      comensales: this.guests()!,
      estado: 'pendiente',
      numero_mesa: this.selectedTable()!
    };

    // Guardar reserva pendiente y mostrar modal de SMS
    this.pendingReserva.set(reserva);
    this.showSmsModal.set(true);
  }

  onSmsModalClose(): void {
    this.showSmsModal.set(false);
    this.pendingReserva.set(null);
    this.customerEmail.set('');
  }

  async onRequestCode(email: string): Promise<void> {
    this.customerEmail.set(email);
    
    // Enviar código OTP con Supabase
    const { error } = await this.supabase.sendOtp(email);
    
    if (error) {
      this.toast.error('Error al enviar código', error.message);
      return;
    }
    
    this.toast.success('Código enviado', `Se ha enviado un código de verificación a ${email}`);
  }

  async onSmsConfirm(code: string): Promise<void> {
    const email = this.customerEmail();
    if (!email) {
      this.toast.error('Error', 'No hay correo registrado');
      this.showSmsModal.set(false);
      return;
    }

    // Verificar OTP con Supabase
    const { error } = await this.supabase.verifyOtp(email, code);
    
    if (error) {
      this.toast.error('Código incorrecto', 'El código ingresado no es válido');
      return;
    }

    const reserva = this.pendingReserva();
    if (!reserva) {
      this.toast.error('Error', 'No hay reserva pendiente');
      this.showSmsModal.set(false);
      return;
    }

    // Guardar en Supabase
    const { error: reservaError } = await this.supabase.createReserva(reserva);
    if (reservaError) {
      this.toast.error('Error al crear reserva', reservaError.message);
      this.showSmsModal.set(false);
      return;
    }

    this.toast.success(
      '¡Reserva confirmada! Te esperamos.',
      `${reserva.fecha} a las ${reserva.hora} para ${reserva.comensales} ${reserva.comensales === 1 ? 'persona' : 'personas'}`
    );

    // Reset
    this.idNumber.set('');
    this.fullName.set('');
    this.phone.set('');
    this.guests.set(null);
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.selectedTable.set(null);
    this.availableTables.set(this.tableOptions());
    this.showSmsModal.set(false);
    this.pendingReserva.set(null);
    this.customerEmail.set('');

    // Generar PDF del recibo
    this.generateReceipt(reserva);
  }

  generateReceipt(reserva: Reserva): void {
    const doc = new jsPDF();
    
    // Configuración de colores
    const primaryColor = '#F59E0B';
    const textColor = '#1E1E1E';
    const mutedColor = '#6B7280';
    
    // Título
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.text('Sargento Pimienta 2.0', 105, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(16);
    doc.setTextColor(textColor);
    doc.text('Recibo de Reserva', 105, 35, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    
    // Información de la reserva
    doc.setFontSize(12);
    doc.setTextColor(mutedColor);
    doc.text('Detalles de la Reserva', 20, 55);
    
    doc.setTextColor(textColor);
    doc.setFontSize(11);
    let y = 65;
    
    doc.text(`Nombre: ${reserva.nombre_cliente}`, 20, y);
    y += 10;
    doc.text(`Cédula: ${reserva.cedula}`, 20, y);
    y += 10;
    doc.text(`Teléfono: ${reserva.telefono}`, 20, y);
    y += 10;
    doc.text(`Fecha: ${reserva.fecha}`, 20, y);
    y += 10;
    doc.text(`Hora: ${this.formatTo12Hour(reserva.hora)}`, 20, y);
    y += 10;
    doc.text(`Comensales: ${reserva.comensales}`, 20, y);
    y += 10;
    doc.text(`Mesa: ${reserva.numero_mesa}`, 20, y);
    y += 10;
    doc.text(`Estado: ${reserva.estado}`, 20, y);
    
    // Línea separadora
    doc.setDrawColor(primaryColor);
    doc.line(20, y + 5, 190, y + 5);
    
    // Mensaje de confirmación
    y += 20;
    doc.setFontSize(10);
    doc.setTextColor(mutedColor);
    doc.text('Gracias por su reserva. Te esperamos en Sargento Pimienta 2.0.', 105, y, { align: 'center' });
    
    y += 10;
    doc.text('Presente este recibo al llegar al restaurante.', 105, y, { align: 'center' });
    
    // Fecha de generación
    const now = new Date();
    doc.setFontSize(8);
    doc.setTextColor(mutedColor);
    doc.text(`Generado: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 105, 280, { align: 'center' });
    
    // Guardar PDF
    doc.save(`recibo-reserva-${reserva.cedula}-${reserva.fecha}.pdf`);
  }
}
