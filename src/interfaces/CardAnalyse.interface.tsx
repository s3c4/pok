import { Card } from "./Card.interface";
import { Suit } from "./Suit.interface";

export interface CardAnalyse {
    cards: Card[];
    maxNoOfCards: number;
    suit: Suit;
}