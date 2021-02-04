import Sheet from "./Sheet"
import Bar from "./Bar"
import Note from "./Note"
import "whatwg-fetch"

export default class ReadTabFile {
    static read(path) {
        fetch(path, {
            method: "GET",
            credentials: "include",
        }).then((response) => { return response.arrayBuffer(); }).then((response) => {
            let sheet = new Sheet();
            const array = Array.from(new Uint8Array(response));
            console.log(array);
            let mode = 0;
            let tempo = 0;
            let index = -1;
            let string = 1;

            sheet.bars.push(new Bar());
            for (let i = 0; i < array.length; i++) {
                if (array[i] === 127) {
                    mode = 1;
                    string = 1;
                    index++;
                }
                else {
                    if (mode === 1) {
                        if (array[i] > 4) {
                            let note = new Note();
                            note.tempo = array[i];
                            note.index = index;
                            note.string = 0;
                            note.fret = 0;
                            sheet.bars[sheet.bars.length - 1].notes.push(note);
                        }
                        else {
                            tempo = array[i];
                            mode = 2;
                        }
                    }
                    else if (mode === 2) {
                        let note = new Note();
                        note.tempo = tempo;
                        note.index = index;
                        if ([69, 65, 68, 71, 66, 101].includes(array[i])) {
                            note.string = array[i];
                            i++;
                            note.fret = array[i];
                        } else {
                            note.string = string;
                            note.fret = array[i];
                            string++;
                        }
                        sheet.bars[sheet.bars.length - 1].notes.push(note);
                    }
                }
            }
            console.log(sheet);
            return sheet;
        });
    }
}