import Sheet from "./Sheet"
import Bar from "./Bar"
import Note from "./Note"
import "whatwg-fetch"
import Track from "./Track";
import Chord from "./Chord";

export default class ReadTabFile {
    static async read(path) {
        let sheet = new Sheet();
        return await fetch(path, {
            method: "GET",
            credentials: "include",
        }).then((response) => { return response.arrayBuffer(); }).then((response) => {
            const array = Array.from(new Uint8Array(response));
            let mode = 0;
            let tempo = 3;
            let noteIndex = -1;
            let barIndex = 0;
            let trackIndex = 0;
            let string = 1;

            for (let i = 0; i < array.length; i++) {
                if (array[i] === 125) {
                    sheet.tracks.push(new Track(trackIndex));
                    trackIndex++;
                    barIndex = 0;
                    noteIndex = 0;
                }
                else if (array[i] === 126) {
                    sheet.tracks[trackIndex - 1].bars.push(new Bar(barIndex));
                    noteIndex = 0;
                    barIndex++;
                }
                else if (array[i] === 127) {
                    sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords.push(new Chord(noteIndex, 3, true))
                    mode = 1;
                    string = 1;
                    noteIndex++;
                }
                else {
                    if (mode === 1) {
                        if (array[i] > 4) {
                            let note = new Note();
                            sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[noteIndex - 1].tempo = array[i];
                            sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[noteIndex - 1].index = noteIndex;
                            note.string = 0;
                            note.fret = 0;
                            note.note = 0;
                            note.active = true;
                            sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[noteIndex - 1].notes.push(note);
                            tempo = array[i];
                        }
                        else {
                            tempo = array[i];
                            mode = 2;
                        }
                    }
                    else if (mode === 2) {
                        let note = new Note();
                        note.active = true;
                        sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[noteIndex - 1].tempo = tempo;
                        sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[noteIndex - 1].index = noteIndex;
                        let strings = [69, 65, 68, 71, 66, 101];
                        if (strings.includes(array[i])) {
                            note.string = 6 - strings.indexOf(array[i]);
                            i++;
                            note.fret = array[i];
                        } else {
                            note.string = string;
                            note.fret = array[i];
                            string++;
                        }
                        if (note.fret !== 110 && note.fret !== 120)
                            note.note = [[],
                            ["E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Cb5"],
                            ["B3", "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab5"],
                            ["G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4"],
                            ["D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3"],
                            ["A2", "Bb2", "B2", "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3"],
                            ["E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3"]][note.string][note.fret];
                        sheet.tracks[trackIndex - 1].bars[barIndex - 1].chords[noteIndex - 1].notes.push(note);
                    }
                }
            }

            console.log(sheet);
            return sheet;
        });
    }
}