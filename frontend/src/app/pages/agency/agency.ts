import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { Card } from '../../shared/card/card';
import { AgencyModel } from '../../models/agency';
import { AgencyService } from '../../services/agency/agency';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property/property';

@Component({
  selector: 'app-agency',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer, Card],
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
})
export class Agency implements OnInit {
  agency: AgencyModel | undefined;
  allProperties: Property[] = [];

  constructor(private agencyService: AgencyService, private activateRoute: ActivatedRoute, private propertyService: PropertyService) {}

  ngOnInit(): void {
    const idParam = this.activateRoute.snapshot.paramMap.get('id'); //restituisce stringa

    if(idParam){
      const agencyId =  +idParam; //conversione a number

      // prendo le utenze
      this.agencyService.getAgencyById(agencyId).subscribe({
        next: (data) => this.agency = data,
        error: (err) => console.error('Errore Agency:', err)
      });

      // prendo gli immobili 
      this.propertyService.getPropertiesByAgency(agencyId).subscribe({
        next: (data) => {
          this.allProperties = data;
          console.log('Immobili caricati con foto:', this.allProperties);
        },
        error: (err) => console.error('Errore Properties:', err)
      });
    }
    else{
      console.error('Errore nella estrazione ID');
    }
    
  }

  // --- Funzioni di Gestione ---
  createProperty() {
    alert('Apre modale creazione immobile');
  }

  editProperty(id: number) {
    alert(`Modifica immobile ${id}`);
  }

  deleteProperty(id: number) {
    
  }

  editAgencyInfo() {
    alert('Modifica informazioni agenzia');
  }

  addMember() {
    alert('Aggiungi nuovo membro del team');
  }

  editMember(id: number) {
    alert(`Modifica membro ${id}`);
  }

  deleteMember(id: number) {
    
  }
}