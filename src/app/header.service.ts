import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  title$ = new BehaviorSubject<string>('Drunken Salesman');

  setTitle(t: string) {
    this.title$.next(t);
  }
  getTitle(): Observable<string> {
    return this.title$;
  }
}
