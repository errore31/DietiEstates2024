import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { Router } from '@angular/router';
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
              protected location: Location, private toastr: ToastrService, private authService: AuthService){}

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

  //Recupero agente
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.newProperty.agentId = user.id; 
      }
    });
  }

  createProperty(){
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
