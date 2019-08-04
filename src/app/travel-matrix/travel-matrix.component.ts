import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Person } from '../person';
import { Place } from '../place';
import { MapsAPILoader } from '@agm/core';

export interface UIMatrix {
  columnHeaders: string[];
  rowHeaders: string[];
  cells: string[][];
}

@Component({
  selector: 'app-travel-matrix',
  templateUrl: './travel-matrix.component.html',
  styleUrls: ['./travel-matrix.component.scss']
})
export class TravelMatrixComponent implements OnInit, OnChanges {

  @Input() people: Person[];
  @Input() places: Place[];

  private mapLoaded: boolean = false;
  private cache = new Map<string, google.maps.DistanceMatrixResponseElement>();
  private dmService: google.maps.DistanceMatrixService;
  uiMatrix: UIMatrix = null;

  constructor(private mapLoader: MapsAPILoader) { }

  ngOnInit() {
    this.mapLoader.load().then(() => {
      this.mapLoaded = true;
      this.dmService = new google.maps.DistanceMatrixService();
      this.generateMatrix();
    });
  }

  ngOnChanges() {
    if (!this.mapLoaded) return;
    this.generateMatrix();
  }

  private placesEqual(a: Place, b: Place): boolean {
    return a.address === b.address && a.latitude === b.latitude && a.longitude === b.longitude;
  }

  private cacheKey(from: Place, to: Place): string {
    return `from:${from.address}!${from.latitude}!${from.longitude}|to:${to.address}!${to.latitude}!${to.longitude}`;
  }

  private inCache(from: Place, to: Place): boolean {
    return this.cache.has(this.cacheKey(from, to));
  }

  private putInCache(from: Place, to: Place, element: google.maps.DistanceMatrixResponseElement) {
    return this.cache.set(this.cacheKey(from, to), element);
  }

  private placeToLatLng(p: Place): google.maps.LatLng {
    return new google.maps.LatLng(p.latitude, p.longitude);
  }

  private matrixRequests(): [Place[], Place[]][] {
    let requests = [];
    for (const place of this.places) {
      let inboundRequest = [[], [place]];
      let outboundRequest = [[place], []];
      for (const person of this.people) {
        if (!this.inCache(person.startingLocation, place)) {
          inboundRequest[0].push(person.startingLocation);
        }
        if (!this.inCache(place, person.endingLocation)) {
          outboundRequest[1].push(person.endingLocation);
        }
      }
      if (inboundRequest[0].length) {
        requests.push(inboundRequest);
      }
      if (outboundRequest[1].length) {
        requests.push(outboundRequest);
      }
    }
    return requests;
  }

  private generateMatrix() {
    console.log('regenerating matrix!');
    let promises: Promise<void>[] = [];
    for (const matrixReq of this.matrixRequests()) {
      promises.push(new Promise<void>((resolve, reject) => {
        const [sourceAddress, destinationAddress] = matrixReq;
        this.dmService.getDistanceMatrix({
          origins: sourceAddress.map(this.placeToLatLng),
          destinations: destinationAddress.map(this.placeToLatLng),
          travelMode: google.maps.TravelMode.TRANSIT,
        }, (response, status) => {
          if (status !== google.maps.DistanceMatrixStatus.OK) {
            console.error('something went wrong with the distance matrix API!', status);
            reject(`something went wrong with the distance matrix API!: ${status}`);
            return;
          }
          for (let i = 0; i < response.rows.length; i++) {
            const row = response.rows[i];
            const source = sourceAddress[i];
            for (let j = 0; j < row.elements.length; j++) {
              const element = row.elements[j];
              const destination = destinationAddress[j];
              this.putInCache(source, destination, element);
            }
          }
          resolve();
        });
      }))
    }
    Promise.all(promises.map(p => p.then(v => true, err => false))).then(() => this.uiMatrix = this.generateUIMatrix());
  }

  private cellText(place: Place, person: Person): string {
    const firstLeg = this.cache.get(this.cacheKey(person.startingLocation, place));
    const secondLeg = this.cache.get(this.cacheKey(place, person.endingLocation));
    return `${firstLeg.duration.text} + ${secondLeg.duration.text}`;
  }

  private score(place: Place): number {
    // Current scoring strategy: just sum everyone's inbound and outbound commutes.
    return this.people.reduce<number>((pv: number, person: Person): number => {
      const firstLeg = this.cache.get(this.cacheKey(person.startingLocation, place));
      const secondLeg = this.cache.get(this.cacheKey(place, person.endingLocation));
      return pv + firstLeg.duration.value + secondLeg.duration.value;
    }, 0);
  }

  private generateUIMatrix(): UIMatrix {
    const orderedPlaces = this.places.map<[Place, number, number]>((p, idx) => [p, this.score(p), idx]).sort((a, b) => a[1] - b[1]);
    return {
      columnHeaders: this.people.map(p => p.name),
      rowHeaders: orderedPlaces.map(p => `${p[0].name} (${p[2] + 1})`),
      cells: orderedPlaces.map(p => this.people.map(person => this.cellText(p[0], person)).concat(p[1].toString())),
    };
  }

}
