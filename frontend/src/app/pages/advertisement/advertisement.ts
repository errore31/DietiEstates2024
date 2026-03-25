import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/property';
import { PropertyService } from '../../services/property/property';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-advertisement',
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './advertisement.html',
  styleUrl: './advertisement.scss',
})
export class Advertisement implements OnInit {

  constructor(private propertyService: PropertyService, private route: ActivatedRoute) { }

  property: Property | undefined;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const propertyId = +idParam;

      this.propertyService.getPropertyById(propertyId).subscribe({
        next: (data) => {
          this.property = data;
          console.log('Proprietà caricate:', this.property);
        },
        error: (err) => console.error('Errore nel caricamento:', err)
      });
    }
    else {
      console.error('Errore nella estrazione ID');
    }
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return 'http://localhost:3000/uploads/' + url;
  }

  @ViewChild('swiper') swiperRef: ElementRef | undefined;

  nextSlide() {
    if (this.swiperRef && this.swiperRef.nativeElement && this.swiperRef.nativeElement.swiper) {
      this.swiperRef.nativeElement.swiper.slideNext();
    }
  }

  prevSlide() {
    if (this.swiperRef && this.swiperRef.nativeElement && this.swiperRef.nativeElement.swiper) {
      this.swiperRef.nativeElement.swiper.slidePrev();
    }
  }

}
