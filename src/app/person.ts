import { Place } from './place';

export interface Person {
    id: string;
    name: string;
    startingLocation: Place;
    endingLocation: Place;
}