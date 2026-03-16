import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequestAgencyService } from '../../services/agency/request-agency-service';
import { RequestAgency } from '../../models/request-agency';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-create-agency-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Footer],
  templateUrl: './create-agency-request.html',
  styleUrl: './create-agency-request.scss'
})
export class CreateAgencyRequest {
  requestData: RequestAgency = {
    businessName: '',
    agencyName: '',
    address: '',
    phone: '',
    email: '',
    name: '',
    surname: '',
    username: ''
  };

  constructor(
    private requestAgencyService: RequestAgencyService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    // Basic validation
    if (!this.requestData.businessName || !this.requestData.agencyName || !this.requestData.email || !this.requestData.username) {
      this.toastr.error('Per favore, compila tutti i campi obbligatori.', 'Attenzione');
      return;
    }

    this.requestAgencyService.submitRequest(this.requestData).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Richiesta inviata con successo!', 'Successo');
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        if (error.status === 400 && error.error?.error && Array.isArray(error.error.error)) {
          error.error.error.forEach((errItem: any) => {
            this.toastr.error(errItem.msg, 'Errore di Validazione');
          });
        } else {
          this.toastr.error('Errore durante l\'invio della richiesta.', 'Errore');
        }
      }
    });
  }
}
