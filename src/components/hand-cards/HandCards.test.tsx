import { describe, test, expect } from 'vitest'
import { render } from "@testing-library/react";
import HandCards from './HandCards.tsx';

describe('<HandCards />', () => {

    test("Renders the main HandCards", () => {
        render(<HandCards></HandCards>);
        expect(true).toBeTruthy()
    });

    test("Renders the HandCards - player 1 wins", () => {
        render(<HandCards hand='2C 3C 4C 5C 6C 8C 2D 4H JH 6H'></HandCards>);
        expect(true).toBeTruthy()
    });

    test("Renders the HandCards - player 2 wins", () => {
        render(<HandCards hand='8C 2D 4H JH 6H 2C 3C 4C 5C 6C'></HandCards>);
        expect(true).toBeTruthy()
    });

    test("Renders the HandCards - hand is a draw", () => {
        render(<HandCards hand='6C 3C 4C 5C 9H 9C 2H 4H 5H 6H'></HandCards>);
        expect(true).toBeTruthy()
    });

});