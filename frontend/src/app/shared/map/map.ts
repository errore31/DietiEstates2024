import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class Map implements AfterViewInit, OnChanges {


  @Input() mapId: string = 'map'; // ID univoco se hai più mappe nella stessa pagina
  @Input() center: [number, number] = [41.9028, 12.4964]; // Centro default (Roma)
  @Input() zoom: number = 13;
  @Input() isEditable: boolean = false; // Se true, permette di piazzare un marker
  @Input() markers: any[] = []; // Per la ricerca: array di immobili con lat e lng
  @Input() cityBoundary: string = ''; // Nome della città per mostrare i confini

  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  private map!: L.Map;
  private singleMarker: L.Marker | undefined;
  private markerLayer = L.layerGroup();
  private boundaryLayer: L.GeoJSON | undefined;

  ngAfterViewInit() {
    this.initMap();
  }

  // Se i markers o la città cambiano, aggiorniamo la mappa
  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes['markers']) {
        this.displayMarkers();
      }
      if (changes['cityBoundary']) {
        this.drawCityBoundary();
      }
    }
  }

  private drawCityBoundary() {
    if (this.boundaryLayer) {
      this.map.removeLayer(this.boundaryLayer);
      this.boundaryLayer = undefined;
    }

    if (!this.cityBoundary || this.cityBoundary.trim() === '') return;

    // Estraiamo solo il nome principale (es: "San Giovanni a Teduccio" da "San Giovanni a Teduccio, NA, Ita")
    // Questo aiuta Nominatim a trovare il quartiere/comune come area (poligono) e non come punto specifico.
    const baseLocation = this.cityBoundary.split(',')[0].trim();

    // Aumentiamo il limite a 15 per trovare il risultato che ha i confini (poligono) tra i vari risultati (es: quartieri)
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(baseLocation)}&format=json&polygon_geojson=1&limit=15&countrycodes=it`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Cerchiamo il primo risultato che contenga un poligono o multipoligono
          const areaData = data.find((item: any) =>
            item.geojson && (item.geojson.type === 'Polygon' || item.geojson.type === 'MultiPolygon')
          ) || data[0];

          if (areaData.geojson && (areaData.geojson.type === 'Polygon' || areaData.geojson.type === 'MultiPolygon')) {
            this.boundaryLayer = L.geoJSON(areaData.geojson, {
              style: {
                color: '#6e44ff',
                weight: 4,
                opacity: 0.8,
                fillColor: '#6e44ff',
                fillOpacity: 0.15
              }
            }).addTo(this.map);

            // Adatta la visuale ai confini trovati con un po' di padding
            const bounds = this.boundaryLayer.getBounds();
            this.map.fitBounds(bounds, { padding: [30, 30] });
          } else {
            // Se non c'è un poligono (es: risultato puntuale), centriamo solo la mappa
            this.map.setView([parseFloat(areaData.lat), parseFloat(areaData.lon)], 14);
          }
        }
      })
      .catch(err => console.error('Errore nel recupero confini:', err));
  }

  private initMap() {
    this.map = L.map(this.mapId).setView(this.center, this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);

    if (this.isEditable) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        this.setSingleMarker(lat, lng);
        this.locationSelected.emit({ lat, lng });
        console.log(lat, lng);
      });
    } else {
      this.displayMarkers();
      if (this.cityBoundary) this.drawCityBoundary();
    }
  }

  // Per la creazione: gestisce un solo marker
  private setSingleMarker(lat: number, lng: number) {
    if (this.singleMarker) {
      this.singleMarker.setLatLng([lat, lng]);
    } else {
      this.singleMarker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  // Per la ricerca: visualizza molti markers
  private displayMarkers() {
    this.markerLayer.clearLayers();
    this.markers.forEach(m => {
      if (m.latitude && m.longitude) {
        L.marker([m.latitude, m.longitude])
          .bindPopup(`<b>${m.title}</b><br>${m.price}€`)
          .addTo(this.markerLayer);
      }
    });
  }

}
