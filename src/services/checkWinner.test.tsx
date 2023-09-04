import { describe, expect, test } from 'vitest';
import CheckWinner from './checkWinner.tsx';
import { CardAnalyse } from '../interfaces/CardAnalyse.interface.tsx';
import { PotentialResult } from '../interfaces/PotentialResults.interface.tsx';

describe('checkWinner service', () => {

    function setTest(playerOne: string[], playerTwo: string[]): Promise<string | void> {
        return Promise.all([
            CheckWinner.preparePlayer(playerOne),
            CheckWinner.preparePlayer(playerTwo)
          ]).then((preparePlayers: CardAnalyse[]) => {
            return Promise.all([
              CheckWinner.checkPlayer(preparePlayers[0].cards, preparePlayers[0].maxNoOfCards, preparePlayers[0].suit),
              CheckWinner.checkPlayer(preparePlayers[1].cards, preparePlayers[1].maxNoOfCards, preparePlayers[1].suit)
            ]).then((results: PotentialResult[]) => {
              // player 1 wins
              if(results[0].power > results[1].power) {
                return '1';
              }
              // player 2 wins
              if(results[1].power > results[0].power) {
                return '2';
              }
              // draw
              if(results[1].power === results[0].power) {
                  return CheckWinner.checkHighestCard(results[1].power, preparePlayers[0].cards, preparePlayers[1].cards);
              }
            });
        });
    }

    // 4 of a kind
    test("Check equal 4 of a kind & highest card - player 1 wins", async () => {
        const playerOne = ['8C', '8D', '8S', '8H', '4S'];
        const playerTwo = ['7C', '7D', '7S', '7H', '5S'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toBe('1');
        });
    });

    test("Check equal 4 of a kind & highest card - player 2 wins", async () => {
        const playerOne = ['7C', '7D', '7S', '7H', '5S'];
        const playerTwo = ['8C', '8D', '8S', '8H', '4S'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    // 3 of a kind
    test("Check equal 3 of a kind & highest card - player 1 wins", async () => {
        const playerOne = ['8C', '8D', '8S', '6S', '4S'];
        const playerTwo = ['7C', '7D', '7S', '3S', '4S'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check equal 3 of a kind & highest card - player 2 wins", async () => {
        const playerOne = ['7C', '7D', '7S', '3S', '4S'];
        const playerTwo = ['8C', '8D', '8S', '6S', '4S'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    // full house
    test("Check full house", async () => {
        const playerOne = ['8C', '8D', '8S', '6S', '6H'];
        const playerTwo = ['7D', '2S', '5D', '3S', 'AC'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    // 2 pairs
    test("Check 2 pairs - player 1 wins with the bigger pair", async () => {
        const playerOne = ['9C', '9D', '2S', '7C', '7D'];
        const playerTwo = ['8S', '8H', '2H', '6S', '6H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check 2 pairs - player 1 wins with the smaller pair", async () => {
        const playerOne = ['8C', '8D', '2S', '7C', '7D'];
        const playerTwo = ['8S', '8H', '2H', '6S', '6H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check 2 pairs - player 2 wins with the bigger pair", async () => {
        const playerOne = ['8S', '8H', '2H', '6S', '6H'];
        const playerTwo = ['9C', '9D', '2S', '7C', '7D'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check 2 pairs - player 2 wins with the smaller pair", async () => {
        const playerOne = ['8S', '8H', '2H', '6S', '6H'];
        const playerTwo = ['8C', '8D', '2S', '7C', '7D'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check 2 pairs - player 1 wins of single bigger card", async () => {
        const playerOne = ['8C', '8D', '3S', '6C', '6D'];
        const playerTwo = ['8S', '8H', '2H', '6S', '6H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check 2 pairs - player 2 wins of single bigger card", async () => {
        const playerOne = ['8C', '8D', '2S', '6C', '6D'];
        const playerTwo = ['8S', '8H', '3H', '6S', '6H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check 2 pairs - draw", async () => {
        const playerOne = ['8C', '8D', '2S', '6C', '6D'];
        const playerTwo = ['8S', '8H', '2H', '6S', '6H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('draw');
        });
    });

    // 1 pair
    test("Check 1 pair - player 1 wins bigger pair cards", async () => {
        const playerOne = ['9C', '9D', '2S', '3S', '4S'];
        const playerTwo = ['8S', '8H', '2H', '3H', '4H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check 1 pair - player 2 wins bigger pair cards", async () => {
        const playerOne = ['9C', '9D', '2S', '3S', '4S'];
        const playerTwo = ['TS', 'TH', '2H', '3H', '4H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check 1 pair - pair equal - player 1 wins with the first bigger card", async () => {
        const playerOne = ['2C', '2D', '7S', '8S', '9S'];
        const playerTwo = ['2S', '2H', '3H', '4H', '6H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check 1 pair - pair equal - player 1 wins with the second bigger card", async () => {
        const playerOne = ['2C', '2D', '7S', '8S', '9S'];
        const playerTwo = ['2S', '2H', '3H', '4H', '9H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check 1 pair - pair equal - player 1 wins with the third bigger card", async () => {
        const playerOne = ['2C', '2D', '7S', '8S', '9S'];
        const playerTwo = ['2S', '2H', '3H', '8H', '9H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check 1 pair - pair equal - player 2 wins with the first bigger card", async () => {
        const playerOne = ['2C', '2D', '3S', '4S', '6S'];
        const playerTwo = ['2S', '2H', '7H', '8H', '9H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check 1 pair - pair equal - player 2 wins with the second bigger card", async () => {
        const playerOne = ['2C', '2D', '3S', '4S', '9S'];
        const playerTwo = ['2S', '2H', '7H', '8H', '9H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check 1 pair - pair equal - player 2 wins with the third bigger card", async () => {
        const playerOne = ['2C', '2D', '3S', '8S', '9S'];
        const playerTwo = ['2S', '2H', '7H', '8H', '9H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check 1 pair - pair equal - highest cards are all equal - result is a draw", async () => {
        const playerOne = ['2C', '2D', '7S', '8S', '9S'];
        const playerTwo = ['2S', '2H', '7H', '8H', '9H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('draw');
        });
    });

    // straight
    test("Check straight - straight equal - check highest card - player 1 wins", async () => {
        const playerOne = ['3H', '4H', '5H', '6H', '7D'];
        const playerTwo = ['2C', '3C', '4C', '5C', '6S'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check straight - straight equal - check highest card - player 2 wins", async () => {
        const playerOne = ['2C', '3C', '4C', '5C', '6S'];
        const playerTwo = ['3H', '4H', '5H', '6H', '7D'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check straight - straight equal - check highest card - draw", async () => {
        const playerOne = ['2C', '3C', '4C', '5C', '6S'];
        const playerTwo = ['2H', '3H', '4H', '5H', '6D'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('draw');
        });
    });

    // flush
    test("Check flush - flush equal - check first highest card - player 1 wins", async () => {
        const playerOne = ['3C', '4C', '5C', '6C', 'AC'];
        const playerTwo = ['2H', '3H', '4H', '5H', '7H'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check flush - flush equal - check second highest card - player 1 wins", async () => {
        const playerOne = ['3C', '4C', '5C', 'KC', 'AC'];
        const playerTwo = ['2H', '3H', '4H', '5H', 'AH'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check flush - flush equal - check third highest card - player 1 wins", async () => {
        const playerOne = ['3C', '4C', 'QC', 'KC', 'AC'];
        const playerTwo = ['2H', '3H', '4H', 'KH', 'AH'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check flush - flush equal - check fourth highest card - player 1 wins", async () => {
        const playerOne = ['3C', 'JC', 'QC', 'KC', 'AC'];
        const playerTwo = ['2H', '3H', 'QH', 'KH', 'AH'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check flush - flush equal - check fifth highest card - player 1 wins", async () => {
        const playerOne = ['3C', 'JC', 'QC', 'KC', 'AC'];
        const playerTwo = ['2H', 'JH', 'QH', 'KH', 'AH'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('1');
        });
    });

    test("Check flush - flush equal - check first highest card - player 2 wins", async () => {
        const playerOne = ['2H', '3H', '4H', '5H', '7H'];
        const playerTwo = ['3C', '4C', '5C', '6C', 'AC'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check flush - flush equal - check second highest card - player 2 wins", async () => {
        const playerOne = ['2H', '3H', '4H', '5H', 'AH'];
        const playerTwo = ['3C', '4C', '5C', 'KC', 'AC'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check flush - flush equal - check third highest card - player 2 wins", async () => {
        const playerOne = ['2H', '3H', '4H', 'KH', 'AH'];
        const playerTwo = ['3C', '4C', 'QC', 'KC', 'AC'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check flush - flush equal - check fourth highest card - player 2 wins", async () => {
        const playerOne = ['2H', '3H', 'QH', 'KH', 'AH'];
        const playerTwo = ['3C', 'JC', 'QC', 'KC', 'AC'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check flush - flush equal - check fifth highest card - player 2 wins", async () => {
        const playerOne = ['2H', 'JH', 'QH', 'KH', 'AH'];
        const playerTwo = ['3C', 'JC', 'QC', 'KC', 'AC'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('2');
        });
    });

    test("Check flush - flush equal - check all highest cards - equal", async () => {
        const playerOne = ['3H', 'JH', 'QH', 'KH', 'AH'];
        const playerTwo = ['3C', 'JC', 'QC', 'KC', 'AC'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('draw');
        });
    });

    // straight flush
    test("Check straight flush - draw", async () => {
        const playerOne = ['2C', '3C', '4C', '5C', '6C'];
        const playerTwo = ['2D', '3D', '4D', '5D', '6D'];
        await setTest(playerOne, playerTwo).then((res) => {
            expect(res).toEqual('draw');
        });
    });
});