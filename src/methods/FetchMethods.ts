export class FetchMethods {
    static async fetchDailyPuzzle() {
        try {
            const response = await fetch('https://api.chess.com/pub/puzzle/random');
            return await response.json();
        } catch(e) {
            alert(`Error: ${e}
            Please, try again later:(`)
        }
    }
}