import MIDI from 'midi.js';

export default class SheetPlayer {
    static async loadPlugin(inst, chan) {
        return await new Promise(function (resolve, reject) {
            MIDI.loadPlugin({
                soundfontUrl: './soundfont/',
                instrument: inst,
                onprogress: function (state, progress) { },
                onsuccess: function () {
                    MIDI.programChange(chan, MIDI.GM.byName[inst].number);
                    resolve(true);
                },
            });
        });
    }

    static playNote(key, chan, delay) {
        MIDI.setVolume(chan, 127);
        MIDI.noteOn(chan, MIDI.keyToNote[key], 127, 0);
        MIDI.noteOff(chan, MIDI.keyToNote[key], delay * 0.001);
    }

    static playSheet(sheet, chan) {
        for (let l = 0; l < sheet.tracks.length; l++) {
            new Promise(async () => {
                for (let i = 0; i < sheet.tracks[l].bars.length; i++) {
                    await new Promise((resolve) => {
                        (function chord(j) {
                            if (j >= sheet.tracks[l].bars[i].chords.length) {
                                resolve(true);
                                return;
                            }

                            if (j === -1 || !sheet.tracks[l].bars[i].chords[j].active) {
                                setTimeout(chord.bind(this), 60000 / sheet.bpm / 4, j + 1);
                                return;
                            }

                            let delay = 0;
                            for (let k = 0; k < sheet.tracks[l].bars[i].chords[j].notes.length; k++) {
                                delay = (60000 / sheet.bpm) * (Math.pow(2, (4 - (sheet.tracks[l].bars[i].chords[j].tempo % 5))) / 4);
                                this.playNote(sheet.tracks[l].bars[i].chords[j].notes[k].note, chan, delay);
                            }
                            setTimeout(chord.bind(this), delay, j + 1);
                        }.bind(this)(i === 0 ? -1 : 0));
                    });
                }
            });
        }
    }
}