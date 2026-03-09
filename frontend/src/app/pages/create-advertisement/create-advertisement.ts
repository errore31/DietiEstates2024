import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { Router, ActivatedRoute } from '@angular/router';
import { Property } from '../../models/property';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { PropertyService } from '../../services/property/property';
import { AuthService } from '../../services/auth-service/auth';

@Component({
  selector: 'app-create-advertisement',
  imports: [Navbar, Footer, CommonModule, FormsModule],
  templateUrl: './create-advertisement.html',
  styleUrl: './create-advertisement.scss',
})
export class CreateAdvertisement implements OnInit {

  constructor(private propertyService: PropertyService, private route: Router,
    private activatedRoute: ActivatedRoute,
    protected location: Location, private toastr: ToastrService, private authService: AuthService) { }

  isEditMode: boolean = false;
  editingPropertyId: number | null = null;

  newAddress: string = '';
  city: string = '';

  newProperty = {
    title: '',
    description: '',
    price: undefined as number | undefined,
    address: '',
    type: '',
    category: '',
    latitude: 0,
    longitude: 0,
    agentId: undefined as number | undefined,

    PropertiesFeature: {
      roomCount: 1,
      area: undefined as unknown as number,
      hasElevator: false,
      floor: 0,
      energyClass: 'G'
    }
  };

  //array di immagini
  selectedFiles: File[] = [];

  imagePreviews: string[] = [];

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);

        //serve per vedere l'anteprima dell'immagine
        const reader = new FileReader();
        const url = URL.createObjectURL(file);
        this.imagePreviews.push(url);
      }
    }
    event.target.value = '';
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  //Recupero agente e eventuale immobile da modificare
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.newProperty.agentId = user.id;
      }
    });

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.editingPropertyId = +id;
        this.loadProperty(this.editingPropertyId);
      }
    });
  }

  loadProperty(id: number) {
    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.newProperty = {
          title: property.title || '',
          description: property.description || '',
          price: property.price,
          address: property.address || '',
          type: property.type || '',
          category: property.category || '',
          latitude: property.latitude || 0,
          longitude: property.longitude || 0,
          agentId: property.agentId,
          PropertiesFeature: property.PropertiesFeature ? {
            roomCount: property.PropertiesFeature.roomCount || 1,
            area: property.PropertiesFeature.area,
            hasElevator: property.PropertiesFeature.hasElevator || false,
            floor: property.PropertiesFeature.floor || 0,
            energyClass: property.PropertiesFeature.energyClass || 'G'
          } : {
            roomCount: 1,
            area: undefined as unknown as number,
            hasElevator: false,
            floor: 0,
            energyClass: 'G'
          }
        };

        if (property.address) {
          const parts = property.address.split(',');
          if (parts.length > 1) {
            this.city = parts.pop()?.trim() || '';
            this.newAddress = parts.join(',').trim();
          } else {
            this.city = '';
            this.newAddress = property.address;
          }
        }
      },
      error: (err) => {
        this.toastr.error('Errore nel caricamento proprietà.');
        console.error(err);
      }
    });
  }

  onSubmit() {
    this.newProperty.address = `${this.newAddress}, ${this.city}`;

    // Creazione del FormData per passare le immagini (come su postman)
    const formData = new FormData();

    // Appendi i dati testuali (FormData accetta stringhe)
    formData.append('title', this.newProperty.title);
    formData.append('description', this.newProperty.description);
    formData.append('price', (this.newProperty.price || 0).toString());
    formData.append('address', this.newProperty.address);
    formData.append('type', this.newProperty.type);
    formData.append('category', this.newProperty.category);
    formData.append('latitude', this.newProperty.latitude.toString());
    formData.append('longitude', this.newProperty.longitude.toString());

    if (this.newProperty.agentId) {
      formData.append('agentId', this.newProperty.agentId.toString());
    }

    // Appendi l'oggetto PropertiesFeature convertendolo in stringa JSON
    formData.append('PropertiesFeature', JSON.stringify(this.newProperty.PropertiesFeature));

    this.selectedFiles.forEach((file) => {
      formData.append('image', file, file.name);
    });

    if (this.isEditMode && this.editingPropertyId) {
      this.propertyService.updateProperty(this.editingPropertyId, formData).subscribe({
        next: () => {
          this.toastr.success('Immobile modificato con successo!');
          this.imagePreviews.forEach(url => URL.revokeObjectURL(url));
          this.location.back();
        },
        error: (err) => {
          this.toastr.error('Errore durante la modifica dell\'immobile.');
          console.error(err);
        }
      });
    } else {
      this.propertyService.createProperty(formData).subscribe({
        next: () => {
          this.toastr.success('Immobile creato con successo!');
          this.imagePreviews.forEach(url => URL.revokeObjectURL(url)); //pulizia memoria browser
          this.location.back();
        },
        error: (err) => {
          this.toastr.error('Errore durante la creazione immobile.');
          console.error(err);
        }
      });
    }
  }
}
