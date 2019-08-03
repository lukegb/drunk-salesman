import { Directive, ElementRef, AfterViewInit, Self, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Observable, from, of } from 'rxjs';
import { filter, catchError, tap, map, switchMap } from 'rxjs/operators';
import { } from 'googlemaps';
import { NgControl } from '@angular/forms';
import { Place } from './place';

@Directive({
  selector: '[appMapsAutocomplete]'
})
export class MapsAutocompleteDirective implements AfterViewInit {

  private autocomplete: google.maps.places.Autocomplete;

  @Output() placeChanged = new EventEmitter<Place>();

  constructor(private el: ElementRef, private mapLoader: MapsAPILoader, @Self() private ngControl: NgControl) { }

  private waitForMapsToLoad(): Observable<void> {
    if (!this.autocomplete) {
      return from(this.mapLoader.load())
        .pipe(
          tap(() => this.initAutocomplete())
        );
    }
    return of();
  }

  private initAutocomplete(): void {
    this.autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement);
  }

  ngAfterViewInit() {
    this.waitForMapsToLoad().subscribe(() => {
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        this.placeChanged.emit({
          name: place.name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        })
        this.ngControl.control.patchValue(place.formatted_address);
      });
    });
  }

}
