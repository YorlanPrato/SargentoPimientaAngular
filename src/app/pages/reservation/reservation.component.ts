import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScCheckboxReCaptcha } from '@semantic-components/re-captcha';
import { ToastService } from '../../services/toast.service';
import { SupabaseService } from '../../services/supabase.service';
import { OPERATING_HOURS } from '../../models/data';
import { Reserva } from '../../models/supabase';

type NationalityType = 'V' | 'E';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FormsModule, CommonModule, ScCheckboxReCaptcha],
  templateUrl: './reservation.component.html',
})
export class ReservationComponent {
  private toast = inject(ToastService);
  private supabase = inject(SupabaseService);

  readonly operatingHours = OPERATING_HOURS;
  readonly guestOptions = [1, 2, 3, 4, 5];
  readonly today = new Date().toISOString().split('T')[0];

  nationality = signal<NationalityType>('V');
  idNumber    = signal('');
  fullName    = signal('');
  phone       = signal('');
  guests      = signal(2);
  selectedDate = signal('');
  selectedTime = signal('');
  recaptchaToken = signal('');

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
  }

  onTimeChange(event: Event): void {
    this.selectedTime.set((event.target as HTMLSelectElement).value);
  }

  onNameChange(event: Event): void {
    this.fullName.set((event.target as HTMLInputElement).value);
  }

  setGuests(n: number): void {
    this.guests.set(n);
  }

  onRecaptchaResolved(token: string | null): void {
    this.recaptchaToken.set(token || '');
  }

  onRecaptchaError(): void {
    this.recaptchaToken.set('');
    this.toast.error('Error de verificación', 'Por favor completa el reCAPTCHA');
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (!this.idNumber() || !this.fullName() || !this.phone() || !this.selectedDate() || !this.selectedTime()) {
      this.toast.error('Campos incompletos', 'Por favor complete todos los campos');
      return;
    }

    if (this.phone().length < 10) {
      this.toast.error('Teléfono inválido', 'El teléfono debe tener al menos 10 dígitos');
      return;
    }

    if (!this.recaptchaToken()) {
      this.toast.error('Verificación requerida', 'Por favor completa el reCAPTCHA');
      return;
    }

    const reserva: Reserva = {
      cedula: `${this.nationality()}-${this.idNumber()}`,
      nombre_cliente: this.fullName(),
      telefono: this.phone(),
      fecha: this.selectedDate(),
      hora: this.selectedTime(),
      comensales: this.guests(),
      estado: 'pendiente'
    };

    this.supabase.createReserva(reserva).then(({ error }) => {
      if (error) {
        this.toast.error('Error al crear reserva', error.message);
        return;
      }

      const g = this.guests();
      this.toast.success(
        '¡Reserva confirmada! Te esperamos.',
        `${this.selectedDate()} a las ${this.selectedTime()} para ${g} ${g === 1 ? 'persona' : 'personas'}`
      );

      // Reset
      this.idNumber.set('');
      this.fullName.set('');
      this.phone.set('');
      this.guests.set(2);
      this.selectedDate.set('');
      this.selectedTime.set('');
    });
  }
}
