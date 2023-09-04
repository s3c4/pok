import { describe, test, expect, vi } from 'vitest'
import { render } from "@testing-library/react";
import App from "./App.tsx";

describe('<App />', () => {
    const lines = ['6C 3C 4C 5C 9H 9C 2H 4H 5H 6H'];
    test("Renders the main page", () => {
        vi.spyOn(global, 'fetch').mockReturnValue(Promise.resolve(new Response(new Blob(lines))));
        render(<App></App>);
        expect(true).toBeTruthy()
    });
});
