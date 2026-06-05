import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private toast = inject(ToastService);

  isSubmitting = signal(false);

  form = signal<ContactForm>({ name: '', email: '', phone: '', message: '' });

  updateField(field: keyof ContactForm, event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.form.update(f => ({ ...f, [field]: value }));
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitting.set(true);

    setTimeout(() => {
      this.toast.success('¡Mensaje enviado!', 'Te contactaremos pronto.');
      this.form.set({ name: '', email: '', phone: '', message: '' });
      this.isSubmitting.set(false);
    }, 1000);
  }
}
