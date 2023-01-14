import { Board } from "../models/Board";

const {converters} = require('fen-reader');

export class FenAndPgnMethods {
    static convertFenToArray(fen: string) {
        const arr = converters.fen2array(fen);
        return arr;
    }
}