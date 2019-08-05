import { Place } from './place';
import { Person } from './person';
import 'firebase/firestore';

export interface Plot {
    name: string;
    people: Person[];
    places: Place[];
    createdAt?: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
}

export const DEFAULT_PLOT: Plot = {
    name: 'My Amazing Plot',
    people: [],
    places: [
        {
            name: 'Brewdog Clerkenwell',
            address: '45-47 Clerkenwell Rd, Farringdon, London EC1M 5RS, UK',
            latitude: 51.522391,
            longitude: -0.103772,
        },
        {
            name: 'Brewdog Soho',
            address: '21 Poland St, Soho, London W1F 8QG, UK',
            latitude: 51.51507,
            longitude: -0.137224,
        },
        {
            name: 'Brewdog Tower Hill',
            address: '21 Great Tower St, London EC3R 5AR, UK',
            latitude: 51.510606,
            longitude: -0.080892,
        },
        {
            name: 'Brewdog Seven Dials',
            address: '142 Shaftesbury Ave, London WC2H 8HJ, UK',
            latitude: 51.513386,
            longitude: -0.128743,
        },
        {
            name: 'Brewdog Shoreditch',
            address: '51 Bethnal Green Rd, Shoreditch, London E1 6LA, UK',
            latitude: 51.524566,
            longitude: -0.07268,
        },
        {
            name: 'Brewdog Canary Wharf',
            address: '2 Churchill Pl, Canary Wharf, London E14 5RB',
            latitude: 51.504467,
            longitude: -0.015013,
        },
        {
            name: 'Brewdog Angel',
            address: '21-31 Essex Rd, The Angel, London N1 2SA',
            latitude: 51.536994,
            longitude: -0.101222,
        },
        {
            name: 'Cask Pub & Kitchen',
            address: '6 Charlwood St, Lillington and Longmoore Gardens, London SW1V 2EE, UK',
            latitude: 51.491131,
            longitude: -0.137365,
        },
        {
            name: 'Craft Beer Co Islington',
            address: '55 White Lion St, Islington, London N1 9PP, UK',
            latitude: 51.532746,
            longitude: -0.110972,
        },
    ],
};