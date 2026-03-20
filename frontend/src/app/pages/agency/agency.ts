import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Card } from '../../shared/card/card';
import { AgencyModel } from '../../models/agency';
import { AgencyService } from '../../services/agency/agency';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property/property';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user';
import { AuthService } from '../../services/auth-service/auth';



@Component({
  selector: 'app-agency',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './agency.html',
  styleUrl: './agency.scss',
})
export class Agency implements OnInit {


  currentUser$;

  constructor(private agencyService: AgencyService, private activateRoute: ActivatedRoute,
    private propertyService: PropertyService, private userService: UserService,
    private toastr: ToastrService, private authService: AuthService, private router: Router) {

    this.currentUser$ = this.authService.currentUser$;

  }


  agency: AgencyModel | undefined;
  allProperties: Property[] = [];
  selectedCategory: 'vendita' | 'affitto' = 'vendita';


  isEditing = false;
  currentEditId: number | null = null;
  showAddMemberForm = false;
  editingField: string | null = null;
  isAgencyAdmin = false;
  isAgent = false;


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


  ngOnInit(): void {
    const idParam = this.activateRoute.snapshot.paramMap.get('id');

    if (idParam) {
      const agencyId = +idParam;

      this.agencyService.getAgencyById(agencyId).subscribe({
        next: (data) => {
          this.agency = data;

          this.authService.currentUser$.subscribe(user => {
            this.checkAdminPermissions(user);
          });
        },
        error: (err) => console.error('Errore Agency:', err)
      });


      this.propertyService.getPropertiesByAgency(agencyId).subscribe({
        next: (data) => {
          this.allProperties = data;
        },
        error: (err) => console.error('Errore Properties:', err)
      });
    }
    else {
      console.error('Errore nella estrazione ID');
    }
  }

  setCategory(category: 'vendita' | 'affitto') {
    this.selectedCategory = category;
  }

  get filteredProperties() {
    return this.allProperties.filter(prop =>
      prop.category?.toLowerCase() === this.selectedCategory
    );
  }

  private checkAdminPermissions(user: any) {
    if (user && user.role === 'agencyAdmin' && user.agencyId === this.agency?.id) {
      this.isAgencyAdmin = true;
    } else {
      this.isAgencyAdmin = false;
    }

    if (user && user.role === 'agent' && user.agencyId === this.agency?.id) {
      this.isAgent = true;
    } else {
      this.isAgent = false;
    }

  }

  createProperty() {
    this.router.navigate(['/properties/create']);
  }

  editProperty(id?: number) {
    const user = this.authService.currentUserSubject?.value;
    const isOwner = this.allProperties.find(prop => prop.id === id)?.agentId === user?.id;

    if (isOwner || this.isAgencyAdmin) {
      this.router.navigate(['/properties/edit', id]);
    } else {
      this.toastr.error('Non hai il permesso per modificare l\'immobile', 'Errore');
    }
  }

  deleteProperty(id: number) {
    this.propertyService.deleteProperty(id).subscribe({
      next: () => {
        this.allProperties = this.allProperties.filter(prop => prop.id !== id);
        this.toastr.success(`Immobile eliminato con successo`, 'Immobile eliminato')
        this.router.navigate(['/agency', this.agency?.id]);
      },
      error: (err) => {
        if (err.status === 403) {
          this.toastr.error('Non hai il permesso per eliminare questo immobile', 'Errore');
        } else {
          this.toastr.error('Errore durante l\'eliminazione dell\'immobile', 'Errore');
        }
      }
    });
  }

  editAgencyInfo(field: string) {
    this.editingField = field;

    if (this.agency) {
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
    if (!this.newAgent.name || !this.newAgent.surname || !this.newAgent.username || !this.newAgent.email || !this.newAgent.password) {
      this.toastr.error('Compila tutti i campi obbligatori per l\'agente.', 'Attenzione');
      return;
    }

    if (this.agency?.id) {

      this.newAgent.agencyId = this.agency.id;

      this.userService.createAgent(this.newAgent).subscribe({
        next: (response: any) => {
          const user = response.user;
          if (this.agency && this.agency.Users) {
            this.agency.Users = [...this.agency.Users, user];
          }
          this.closerForm();
          this.toastr.success(`Agente aggiunto con successo`, 'Agente aggiunto')
        },
        error: (err) => {

          if (err.status === 400 && err.error?.error && Array.isArray(err.error.error)) {
            err.error.error.forEach((errItem: any) => {
              this.toastr.error(errItem.msg, 'Errore di validazione');
            });
          } else if (err.status === 400 && err.error?.errors) {
            this.toastr.error(err.error.errors[0].msg, 'Errore di validazione');
          } else if (err.error && err.error.message) {
            this.toastr.error(err.error.message, 'Errore');
          } else {
            this.toastr.error('Errore durante la creazione dell\'agente.', 'Errore');
          }

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
      if (!this.newAgent.name || !this.newAgent.surname || !this.newAgent.username || !this.newAgent.email) {
        this.toastr.error('Compila i campi obbligatori per l\'agente.', 'Attenzione');
        return;
      }

      this.userService.updateAgent(this.currentEditId, this.newAgent).subscribe({
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
        },
        error: (err) => {
          if (err.status === 400 && err.error?.error && Array.isArray(err.error.error)) {
            err.error.error.forEach((errItem: any) => {
              this.toastr.error(errItem.msg, 'Errore di validazione');
            });
          } else {
            this.toastr.error('Errore durante l\'aggiornamento dell\'agente.', 'Errore');
          }
        }
      });
    } else {
      this.addMember();
    }
  }

  saveAgencyField() {
    if (this.agency?.id) {

      this.agencyService.updateAgency(this.agency.id, this.agencyInfo).subscribe({
        next: (response: any) => {
          const updatedAgency = response.agency;
          const currentUsers = this.agency?.Users;
          this.agency = updatedAgency;

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

  closerForm() {
    this.showAddMemberForm = false;
    this.isEditing = false;
    this.currentEditId = null;
    this.newAgent = { name: '', surname: '', username: '', email: '', password: '', role: 'agent' };
  }

  cancelEditAgency() {
    this.editingField = null;
  }

  isPromoModalOpen = false;
  currentPromoPropertyId: number | null = null;
  promoMessageText: string = '';

  createPromotion(id?: number) {
    if (!id) return;
    this.currentPromoPropertyId = id;
    this.promoMessageText = '';
    this.isPromoModalOpen = true;
  }

  closePromoModal() {
    this.isPromoModalOpen = false;
    this.currentPromoPropertyId = null;
    this.promoMessageText = '';
  }

  submitPromotion() {
    if (!this.currentPromoPropertyId || !this.promoMessageText.trim()) {
      this.toastr.error('Inserisci il testo della promozione', 'Attenzione');
      return;
    }

    this.propertyService.sendPromotion(this.currentPromoPropertyId, this.promoMessageText).subscribe({
      next: (res) => {
        this.toastr.success('Promozione inviata con successo!', 'Notifiche Generate');
        this.closePromoModal();
      },
      error: (err) => {
        this.toastr.error('Errore durante l\'invio della promozione', 'Errore');
        this.closePromoModal();
      }
    });
  }
}