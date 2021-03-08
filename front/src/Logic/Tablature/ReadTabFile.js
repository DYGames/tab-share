import Sheet from "./Sheet"
import Bar from "./Bar"
import Note from "./Note"
import "whatwg-fetch"
import Chord from "./Chord";
import Track from "./Track";

export default class ReadTabFile {
    static async read(path) {
        let sheet = new Sheet();
        return await fetch(path, {
            method: "GET",
            credentials: "include",
        }).then((response) => { return response.arrayBuffer(); }).then((response) => {
            const array = Array.from(new Uint8Array(response));
            let mode = 0;
            let tempo = 0;
            let noteIndex = -1;
            let barIndex = 0;
            let trackIndex = 0;
            let string = 1;

            for (let i = 0; i < array.length; i++) {
                if(array[i] === 125) {
                    sheet.tracks.push(new Track(trackIndex));
                    trackIndex++;
                    barIndex = 0;
                    noteIndex = 0;
                }
                else if(array[i] === 126) {
                    sheet.tracks[trackIndex - 1].bars.push(new Bar(barIndex));
                    barIndex++;
                }
                else if (array[i] === 127) {
                    mode = 1;
                    string = 1;
                    noteIndex++;
                    sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.push(new Chord());
                }
                else {
                    if (mode === 1) {
                        if (array[i] > 4) {
                            let note = new Note();
                            sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.length - 1].tempo = array[i];
                            sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.length - 1].index = noteIndex;
                            note.string = 0;
                            note.fret = 0;
                            note.note = 0;
                            sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.length - 1].notes.push(note);
                        }
                        else {
                            tempo = array[i];
                            mode = 2;
                        }
                    }
                    else if (mode === 2) {
                        let note = new Note();
                        sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.length - 1].tempo = tempo;
                        sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.length - 1].index = noteIndex;
                        if ([69, 65, 68, 71, 66, 101].includes(array[i])) {
                            note.string = array[i];
                            i++;
                            note.fret = array[i];
                        } else {
                            note.string = string;
                            note.fret = array[i];
                            string++;
                        }
                        switch (note.string) {
                            case 69:
                                note.string = 6;
                                break;
                            case 65:
                                note.string = 5;
                                break;
                            case 68:
                                note.string = 4;
                                break;
                            case 71:
                                note.string = 3;
                                break;
                            case 66:
                                note.string = 2;
                                break;
                            case 101:
                                note.string = 1;
                                break;
                            default:
                                break;
                        }
                        if (note.fret !== 110 && note.fret !== 120)
                            note.note = [[],
                            ["E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Cb5"],
                            ["B3", "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab5"],
                            ["G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4"],
                            ["D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3"],
                            ["A2", "Bb2", "B2", "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3"],
                            ["E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3"]][note.string][note.fret];
                            sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.length - 1].notes.push(note);
                    }
                }
            }

            console.log(sheet);
            return sheet;
        });
    }
}