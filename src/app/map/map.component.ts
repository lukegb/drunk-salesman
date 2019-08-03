import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../person';
import { Place } from '../place';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() people: Person[];
  @Input() places: Place[];

  showPlaceLines: number = null;
  showPersonLines: number = null;

  blueIcon: google.maps.Icon = {
    url: `/assets/mapmarker-blue-hidpi.png`,
  };
  greenIcon: google.maps.Icon = {
    url: `/assets/mapmarker-green-hidpi.png`,
  };
  redIcon: google.maps.Icon = {
    url: `/assets/mapmarker-red-hidpi.png`,
  };

  constructor(private mapLoader: MapsAPILoader) { }

  ngOnInit() {
    this.mapLoader.load().then(() => {
      const labelOrigin = new google.maps.Point(14, 15);
      const anchor = new google.maps.Point(14, 43);
      const scaledSize = new google.maps.Size(27, 43);
      this.blueIcon.labelOrigin = labelOrigin;
      this.blueIcon.anchor = anchor;
      this.blueIcon.scaledSize = scaledSize;
      this.greenIcon.labelOrigin = labelOrigin;
      this.greenIcon.anchor = anchor;
      this.greenIcon.scaledSize = scaledSize;
      this.redIcon.labelOrigin = labelOrigin;
      this.redIcon.anchor = anchor;
      this.redIcon.scaledSize = scaledSize;
    })
  }

  labelForPersonMarker(idx: number): string {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[idx];
  }

  placeClick(idx: number, place: Place): void {
    this.showPlaceLines = idx;
    this.showPersonLines = null;
  }

  personClick(idx: number, person: Person, marker: string): void {
    this.showPersonLines = idx;
    this.showPlaceLines = null;
  }

}
