import { Place } from './place';

export interface Person {
    name: string;
    startingLocation: Place;
    endingLocation: Place;
}