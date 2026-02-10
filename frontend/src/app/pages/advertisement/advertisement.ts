import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'; //angular riconosce qualsiasi tipo di tag
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property/property';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advertisement',
  imports: [Navbar, Footer, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './advertisement.html',
  styleUrl: './advertisement.scss',
})
export class Advertisement implements OnInit{

  constructor(private propertyService: PropertyService, private route: ActivatedRoute) {}

  property: Property | undefined;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id'); //restituisce stringa

    if(idParam){
      const propertyId =  +idParam; //conversione a number

      this.propertyService.getPropertyById(propertyId).subscribe({
        next: (data) => {
          this.property = data;
          console.log('Proprietà caricate:', this.property);
        },
        error: (err) => console.error('Errore nel caricamento:', err)
      });
    }
    else{
      console.error('Errore nella estrazione ID');
    }
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return 'http://localhost:3000/uploads/' + url;
  }

}
