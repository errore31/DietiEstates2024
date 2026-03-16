import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestAgencyService } from '../../../services/agency/request-agency-service';
import { RequestAgency } from '../../../models/request-agency';
import { ToastrService } from 'ngx-toastr';
import { Footer } from '../../../shared/footer/footer';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  requests: RequestAgency[] = [];
  loading: boolean = true;

  constructor(
    private requestAgencyService: RequestAgencyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    this.requestAgencyService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Errore nel caricamento delle richieste.', 'Errore');
        this.loading = false;
      }
    });
  }

  approve(id: number) {
    if (confirm('Sei sicuro di voler approvare questa richiesta? Verrà creata l\'agenzia e l\'account amministratore.')) {
      this.requestAgencyService.approveRequest(id).subscribe({
        next: (res) => {
          this.toastr.success(res.message, 'Approvata');
          this.loadRequests();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Errore durante l\'approvazione.', 'Errore');
        }
      });
    }
  }

  reject(id: number) {
    if (confirm('Sei sicuro di voler rifiutare questa richiesta? I dati verranno eliminati permanentemente.')) {
      this.requestAgencyService.rejectRequest(id).subscribe({
        next: (res) => {
          this.toastr.warning(res.message, 'Rifiutata');
          this.loadRequests();
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Errore durante il rifiuto.', 'Errore');
        }
      });
    }
  }
}
