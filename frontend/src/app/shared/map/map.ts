import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
export class Map implements AfterViewInit, OnChanges, OnDestroy {

  // FIX 1: Generiamo un ID univoco casuale di default per evitare conflitti nel DOM
  @Input() mapId: string = `map-${Math.random().toString(36).substring(2, 9)}`;

  @Input() center: [number, number] = [41.9028, 12.4964];
  @Input() zoom: number = 13;
  @Input() isEditable: boolean = false;
  @Input() markers: any[] = [];
  @Input() initialMarker: [number, number] | null = null;
  @Input() cityBoundary: string = '';
  @Input() navigationOnMapClick: boolean = false; // Nuovo input per abilitare/disabilitare il click navigazione

  constructor(private router: Router) { }

  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  @Output() mapClicked = new EventEmitter<string>(); // Nuovo output che emette il nome del luogo

  private map!: L.Map;
  private singleMarker: L.Marker | undefined;
  private markerLayer = L.layerGroup();
  private boundaryLayer: L.GeoJSON | undefined;

  // Aggiungiamo il ResizeObserver
  private resizeObserver: ResizeObserver | undefined;

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    // FIX 2: Pulizia accurata dell'observer e della mappa
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.map) {
      this.map.remove();
    }
  }

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

    const baseLocation = this.cityBoundary.split(',')[0].trim();
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(baseLocation)}&format=json&polygon_geojson=1&limit=15&countrycodes=it`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
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

            const bounds = this.boundaryLayer.getBounds();
            this.map.fitBounds(bounds, { padding: [30, 30] });
          } else {
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

    const mapElement = document.getElementById(this.mapId);
    if (mapElement) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      });
      this.resizeObserver.observe(mapElement);
    }

    if (this.isEditable) {
      if (this.initialMarker) {
        this.setSingleMarker(this.initialMarker[0], this.initialMarker[1]);
        this.map.setView(this.initialMarker, this.zoom);
      }

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        this.setSingleMarker(lat, lng);
        this.locationSelected.emit({ lat, lng });
      });
    } else {
      this.displayMarkers();
      if (this.cityBoundary) this.drawCityBoundary();

      // Quando clicco sulla mappa in modalità non-editabile, se la navigazione è abilitata cerco il luogo
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        if (this.navigationOnMapClick) {
          const { lat, lng } = e.latlng;
          this.reverseGeocodeAndNavigate(lat, lng);
        }
      });
    }
  }

  private reverseGeocodeAndNavigate(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.display_name) {
          const address = data.address;
          const locationName = address.city || address.town || address.village || address.suburb || data.display_name.split(',')[0];

          if (locationName) {
            console.log('Emissione luogo cliccato:', locationName);
            this.mapClicked.emit(locationName);
            this.router.navigate(['/searches', locationName]);
          }
        }
      })
      .catch(err => console.error('Errore durante il reverse geocoding:', err));
  }

  private setSingleMarker(lat: number, lng: number) {
    if (this.singleMarker) {
      this.singleMarker.setLatLng([lat, lng]);
    } else {
      this.singleMarker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  private displayMarkers() {
    this.markerLayer.clearLayers();
    this.markers.forEach(m => {
      if (m.latitude && m.longitude) {
        const popupContent = `
            <div class="map-popup-text">
              <b class="popup-title">${m.title}</b>
              <span class="popup-price">${m.price}€</span>
              <div class="popup-actions">
                <button class="btn-popup-detail" data-id="${m.id}">Vedi Dettagli</button>
              </div>
            </div>
          `;

        const marker = L.marker([m.latitude, m.longitude])
          .bindPopup(popupContent, {
            maxWidth: 200,
            minWidth: 150
          });

        marker.on('popupopen', (e) => {
          const container = e.popup.getElement();
          if (container) {
            const btn = container.querySelector('.btn-popup-detail');
            if (btn) {
              btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (id) {
                  this.router.navigate(['/advertisement', id]);
                }
              });
            }
          }
        });

        marker.addTo(this.markerLayer);
      }
    });
  }
}