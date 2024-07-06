const {converters} = require('fen-reader');
// import {converters} from 'fen-reader';

export class FenAndPgnMethods {
    static convertFenToArray(fen: string) {
        return converters.fen2array(fen);
    }
}