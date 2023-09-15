import { Card } from "../interfaces/Card.interface";
import { CardAnalyse } from "../interfaces/CardAnalyse.interface";
import { PotentialResult } from "../interfaces/PotentialResults.interface";
import { Suit } from "../interfaces/Suit.interface";

// excluded Royal flush - because is like comparing 2 straight flush + high card
// excluded high card - this is the last step to check
// Indexes/Powers info:
// 0 - Nothing
// 1 - One pair
// 2 - Two Pairs
// 3 - Three of a kind
// 4 - Straight
// 5 - Flush
// 6 - Full house
// 7 - Four of a kind
// 8 - Straight flush
const potentialResults: PotentialResult[] = [
    {
        name: 'Nothing',
        power: 0
    },
    {
        name: 'One Pair',
        power: 1
    },
    {
        name: 'Two Pairs',
        power: 2
    },
    {
        name: 'Three of a kind',
        power: 3
    },
    {
        name: 'Straight',
        power: 4
    },
    {
        name: 'Flush',
        power: 5
    },
    {
        name: 'Full house',
        power: 6
    },
    {
        name: 'Four of a kind',
        power: 7
    },
    {
        name: 'Straight flush',
        power: 8
    }
];

const CheckWinner = {
    preparePlayer: async (player: string[]): Promise<CardAnalyse> => {
        // cards of players: keept in order of card value, keep the noOfCards of that value
        let cards: Card[] = [
            {
                cardPower: 2,
                cardValue: '2',
                noOfCards: 0
            },
            {
                cardPower: 3,
                cardValue: '3',
                noOfCards: 0
            },
            {
                cardPower: 4,
                cardValue: '4',
                noOfCards: 0
            },
            {
                cardPower: 5,
                cardValue: '5',
                noOfCards: 0
            },
            {
                cardPower: 6,
                cardValue: '6',
                noOfCards: 0
            },
            {
                cardPower: 7,
                cardValue: '7',
                noOfCards: 0
            },
            {
                cardPower: 8,
                cardValue: '8',
                noOfCards: 0
            },
            {
                cardPower: 9,
                cardValue: '9',
                noOfCards: 0
            },
            {
                cardPower: 10,
                cardValue: 'T',
                noOfCards: 0
            },
            {
                cardPower: 11,
                cardValue: 'J',
                noOfCards: 0
            },
            {
                cardPower: 12,
                cardValue: 'Q',
                noOfCards: 0
            },
            {
                cardPower: 13,
                cardValue: 'K',
                noOfCards: 0
            },
            {
                cardPower: 14,
                cardValue: 'A',
                noOfCards: 0
            },
        ];

        // keep the maximum of a specific card repeted (it can be 1, 2, 3 or 4 of a kind)
        let maxNoOfCards = 0;

        // check if suit - keep the no of each suit
        let suit: Suit = {
            S: 0,
            D: 0,
            H: 0,
            C: 0,
        };

        player.map((plainCard: string): void => {
            const plainCardValue = plainCard[0];
            const plainCardSuit = plainCard[1];
            cards
                .filter((card: Card) => card.cardValue === plainCardValue)
                .map((card: Card) => {
                    // -->Set: the no of value
                    card.noOfCards++;
                    if(card.noOfCards > maxNoOfCards) {
                        maxNoOfCards = card.noOfCards;
                    }
                    // -->Set: suit of card
                    // neet to transform to any to access with a dynamic key the object
                    (suit as any)[plainCardSuit]++;
                });     
        });
        return {
            cards,
            maxNoOfCards,
            suit
        } as CardAnalyse;
    },
    checkPlayer: async (cards: Card[], maxNoOfCards: number, suit: Suit): Promise<PotentialResult> => {
        // 4 of a kind
        if(maxNoOfCards === 4) {
            return potentialResults[7];
        }

        // 3 of a kind, or full house
        if(maxNoOfCards === 3) {
            // check a pair in cards for a full house
            if(cards.filter((card) => card.noOfCards === 2).length > 0) {
                return potentialResults[6]; // full house
            } else {
                return potentialResults[3]; // three of a kind
            }
        }

        // 2 of a kind (pair) or 2 pairs
        if(maxNoOfCards === 2) {
            // check if there are 2 pairs in the cards
            if(cards.filter((card) => card.noOfCards === 2).length > 1) {
                return potentialResults[2]; // two pairs
            } else {
                return potentialResults[1]; // one pair
            }
        }

        // flush & straight, flush, straight
        if(maxNoOfCards === 1) {
            // check suit
            const isFlush = (suit.C === 5 || suit.D === 5 || suit.H === 5 || suit.S === 5);
            // check straight
            let isStraight = false;
            for (var i = 0; i < cards.length; i++) {
                // get the first card
                if(cards[i].noOfCards === 1) {
                    isStraight = (
                        cards[i + 1].noOfCards === 1 &&
                        cards[i + 2].noOfCards === 1 &&
                        cards[i + 3].noOfCards === 1 &&
                        cards[i + 4].noOfCards === 1
                    );
                    break;
                }
            }
            // straight flush 
            if(isFlush && isStraight) {
                return potentialResults[8]; 
            }
            // flush only
            if(isFlush) {
                return potentialResults[5]; 
            }
            // straight only
            if(isStraight) {
                return potentialResults[4]; 
            }
        }

        return potentialResults[0];
    },
    checkHighestCard: async (power: number, cardsPlayerOne: Card[], cardsPlayerTwo: Card[]): Promise<string> => {
        // 4 of a kind - power 7 (no draw on a 4 of a kind)
        if(power === 7) {
            const singleCardPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 4)[0];
            const singleCardPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 4)[0];
            return (singleCardPlayerOne.cardPower > singleCardPlayerTwo.cardPower) ? '1' : '2';
        }

        // full house || 3 of a kind
        if(power === 6 || power === 3) {
            const threeCardPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 3)[0];
            const threeCardPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 3)[0];
            return (threeCardPlayerOne.cardPower > threeCardPlayerTwo.cardPower) ? '1' : '2';
        }

        // 2 pairs
        if(power === 2) {
            const pairsCardPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 2);
            const pairsCardPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 2);
            // check bigger pair
            if(pairsCardPlayerOne[1].cardPower > pairsCardPlayerTwo[1].cardPower) {
                return '1';
            }
            if(pairsCardPlayerOne[1].cardPower < pairsCardPlayerTwo[1].cardPower) {
                return '2';
            }

            // check smaller pair
            if(pairsCardPlayerOne[0].cardPower > pairsCardPlayerTwo[0].cardPower) {
                return '1';
            }
            if(pairsCardPlayerOne[0].cardPower < pairsCardPlayerTwo[0].cardPower) {
                return '2';
            }

            // 2 pairs are the same - need to take the single card
            const singleCardPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 1)[0];
            const singleCardPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 1)[0];
            if(singleCardPlayerOne.cardPower > singleCardPlayerTwo.cardPower) {
                return '1';
            }
            if(singleCardPlayerOne.cardPower < singleCardPlayerTwo.cardPower) {
                return '2';
            }
            return 'draw';
        }

        // one pair
        if(power === 1) {
            const pairCardPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 2)[0];
            const pairCardPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 2)[0];
            if(pairCardPlayerOne.cardPower > pairCardPlayerTwo.cardPower) {
                return '1';
            }
            if(pairCardPlayerOne.cardPower < pairCardPlayerTwo.cardPower) {
                return '2';
            }
            const singleCardsPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 1);
            const singleCardsPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 1);
            // first biggest card
            if(singleCardsPlayerOne[2].cardPower > singleCardsPlayerTwo[2].cardPower) {
                return '1';
            }
            if(singleCardsPlayerOne[2].cardPower < singleCardsPlayerTwo[2].cardPower) {
                return '2';
            }

            // second biggest card
            if(singleCardsPlayerOne[1].cardPower > singleCardsPlayerTwo[1].cardPower) {
                return '1';
            }
            if(singleCardsPlayerOne[1].cardPower < singleCardsPlayerTwo[1].cardPower) {
                return '2';
            }

            // third biggest card
            if(singleCardsPlayerOne[0].cardPower > singleCardsPlayerTwo[0].cardPower) {
                return '1';
            }
            if(singleCardsPlayerOne[0].cardPower < singleCardsPlayerTwo[0].cardPower) {
                return '2';
            }
            return 'draw';
        }

        // straight || straight flush
        if(power === 4 || power === 8) {
            const filteredCardsPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 1);
            const filteredCardsPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 1);
            if(filteredCardsPlayerOne[4].cardPower > filteredCardsPlayerTwo[4].cardPower) {
                return '1';
            }
            if(filteredCardsPlayerOne[4].cardPower < filteredCardsPlayerTwo[4].cardPower) {
                return '2';
            }
            return 'draw';
        }

        // flush || nothing
        if(power === 5 || power === 0) {
            const filteredCardsPlayerOne = cardsPlayerOne.filter((card) => card.noOfCards === 1);
            const filteredCardsPlayerTwo = cardsPlayerTwo.filter((card) => card.noOfCards === 1);
            // 5 - biggest card compared
            if(filteredCardsPlayerOne[4].cardPower > filteredCardsPlayerTwo[4].cardPower) {
                return '1';
            }
            if(filteredCardsPlayerOne[4].cardPower < filteredCardsPlayerTwo[4].cardPower) {
                return '2';
            }
            // 4 - bigger card compared
            if(filteredCardsPlayerOne[3].cardPower > filteredCardsPlayerTwo[3].cardPower) {
                return '1';
            }
            if(filteredCardsPlayerOne[3].cardPower < filteredCardsPlayerTwo[3].cardPower) {
                return '2';
            }
            // 3 - bigger card compared
            if(filteredCardsPlayerOne[2].cardPower > filteredCardsPlayerTwo[2].cardPower) {
                return '1';
            }
            if(filteredCardsPlayerOne[2].cardPower < filteredCardsPlayerTwo[2].cardPower) {
                return '2';
            }
            // 2 - bigger card compared
            if(filteredCardsPlayerOne[1].cardPower > filteredCardsPlayerTwo[1].cardPower) {
                return '1';
            }
            if(filteredCardsPlayerOne[1].cardPower < filteredCardsPlayerTwo[1].cardPower) {
                return '2';
            }
            // 1 - bigger card compared
            if(filteredCardsPlayerOne[0].cardPower > filteredCardsPlayerTwo[0].cardPower) {
                return '1';
            }
            if(filteredCardsPlayerOne[0].cardPower < filteredCardsPlayerTwo[0].cardPower) {
                return '2';
            }
            return 'draw';
        }

        return 'here should never go';
    }
};

export default CheckWinner;