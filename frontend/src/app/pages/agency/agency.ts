import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { Card } from '../../shared/card/card';
import { AgencyModel } from '../../models/agency';
import { AgencyService } from '../../services/agency/agency';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property/property';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user';

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

  isEditing = false; // Flag per capire se il form è in modalità modifica
  currentEditId: number | null = null; //id dell'utente da modificare
  showAddMemberForm = false;
  editingField: string | null = null;

  newAgent: User = {
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    role: 'agent',
    agencyId: undefined
  };

  agencyInfo: AgencyModel = {
    id: undefined,
    businessName: '',
    name: '',
    address: '',     
    phone: '',       
    email: '',        
    Users: undefined,
  }

  constructor(private agencyService: AgencyService, private activateRoute: ActivatedRoute, private propertyService: PropertyService, private userService: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const idParam = this.activateRoute.snapshot.paramMap.get('id'); //restituisce stringa

    if (idParam) {
      const agencyId = +idParam; //conversione a number

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
    else {
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

  editAgencyInfo(field: string) {
    this.editingField = field;

    if(this.agency){
      this.agencyInfo = {
        id: this.agency.id,
        businessName: this.agency.businessName,
        name: this.agency.name,
        address: this.agency.address,
        phone: this.agency.phone,
        email: this.agency.email,
        Users: this.agency.Users,
      }
    }
  }

  toggleAddMemberForm() {
    this.showAddMemberForm = !this.showAddMemberForm;
  }

  addMember() {

    if (this.agency?.id) { //serve per aggiungere l'id all'utente

      this.newAgent.agencyId = this.agency.id;

      this.userService.createAgent(this.newAgent).subscribe({
        next: (response: any) => {
          const user = response.user; //estraggo utente dalla risposta
          if (this.agency && this.agency.Users) {
            this.agency.Users = [...this.agency.Users, user];
          }
          this.closerForm();
          this.toastr.success(`Agente aggiunto con successo`, 'Agente aggiunto')
          console.log('Agente aggiunto con successo');
        },
        error: (err) => {
          console.log('Status Errore:', err.status);
        }
      });
    }
  }

  editMember(editAgent: User) {
    this.isEditing = true;
    this.showAddMemberForm = true;
    this.currentEditId = editAgent.id!;


    this.newAgent = {
      name: editAgent.name,
      surname: editAgent.surname,
      username: editAgent.username,
      email: editAgent.email,
      role: editAgent.role,
      password: '',
      agencyId: editAgent.agencyId
    };
  }

  deleteMember(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        if (this.agency && this.agency.Users) {
          // ricrea l'array escludendo l'agente eliminato
          this.agency.Users = this.agency.Users.filter(user => user.id !== id);
        }
        this.toastr.success(`Agente eliminato con successo`, 'Agente eliminato')
      },
      error: (err) => {
        console.log('Status Errore:', err.status);
      }
    });
  }


  saveMember() {
    if (this.isEditing && this.currentEditId) {
      this.userService.updateUser(this.currentEditId, this.newAgent).subscribe({
        next: (response: any) => {
          const updatedUser = response.user;
          if (this.agency?.Users) {
            const index = this.agency.Users.findIndex(u => u.id === this.currentEditId);
            if (index !== -1) {
              this.agency.Users[index] = updatedUser;
              this.agency.Users = [...this.agency.Users];
            }
          }
          this.closerForm();
          this.toastr.success('Agente aggiornato');
        }
      });
    } else {
      this.addMember();
    }
  }

  saveAgencyField(){
    if (this.agency?.id) {
        this.agencyService.updateAgency(this.agency.id, this.agencyInfo).subscribe({
            next: (response: any) => {
                const updatedAgency = response.agency;
                const currentUsers = this.agency?.Users;
                this.agency = updatedAgency; // Aggiorna la vista

                //Riattacchiamo i membri all'oggetto aggiornato
                if (this.agency) {
                    this.agency.Users = currentUsers;
                }
                
                this.editingField = null;
                this.toastr.success('Info aggiornate');
            },
            error: (err) => console.error(err)
        });
    }
  }

  closerForm(){
    this.showAddMemberForm = false;
    this.isEditing = false;
    this.currentEditId = null;
    this.newAgent = { name: '', surname: '', username: '', email: '', password: '', role: 'agent' };
  }

  cancelEditAgency() {
    this.editingField = null;
  }
}