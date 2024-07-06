export class FetchMethods {
    static async fetchDailyPuzzle() {
            const response = await fetch('https://api.chess.com/pub/puzzle/random');
            return await response.json();
    }
}