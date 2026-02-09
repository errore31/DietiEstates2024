import { Component,  Input} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/property';


@Component({
  selector: 'app-card',
  imports: [RouterModule, CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card{

  @Input() properties!: Property;

  // card.component.ts
  handleImageError(event: any) {
    // Se l'immagine del server fallisce, sostituiscila al volo col placeholder
    event.target.src = '/housePlaceholder.jpg';
  }

}
