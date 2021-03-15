export default class Note {
    constructor(string, fret, note) {
        this.string = string;
        this.fret = fret;
        this.note = note;
        this.rect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
    }
}