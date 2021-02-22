import MIDI from 'midi.js';

export default class SheetPlayer {
    static async loadPlugin(inst, chan) {
        return await new Promise(function (resolve, reject) {
            MIDI.loadPlugin({
                soundfontUrl: './soundfont/',
                instrument: inst,
                onprogress: function (state, progress) {},
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

    static async playSheet(sheet, chan) {
        for (let i = 0; i < sheet.bars.length; i++) {
            await new Promise((resolve) => {
                (function chord(j) {
                    if (j >= sheet.bars[i].chords.length) {
						resolve(true);
						return;
					}
                    if (j === -1) {
                        setTimeout(chord.bind(this), 60000 / sheet.bpm / 4, j + 1);
                        return;
                    }

                    let tempo = 0;
                    let delay = 0;
                    for (let k = 0; k < sheet.bars[i].chords[j].notes.length; k++) {
                        tempo = sheet.bars[i].chords[j].notes[k].tempo;
                        if (tempo === 0 || tempo === 5) delay = (60000 / sheet.bpm) * 4;
                        else if (tempo === 1 || tempo === 6) delay = (60000 / sheet.bpm) * 2;
                        else if (tempo === 2 || tempo === 7) delay = 60000 / sheet.bpm;
                        else if (tempo === 3 || tempo === 8) delay = 60000 / sheet.bpm / 2;
                        else if (tempo === 4 || tempo === 9) delay = 60000 / sheet.bpm / 4;
                        this.playNote(sheet.bars[i].chords[j].notes[k].note, chan, delay);
                    }
                    setTimeout(chord.bind(this), delay, j + 1);
                }.bind(this)(i === 0 ? -1 : 0));
            });
        }
    }
}