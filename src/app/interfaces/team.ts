import { Countries, Player } from './player';

export interface Team {
    $key?: string; // Key opcional de Firebase
    name: string;
    country: Countries;
    players: Player[];
}
