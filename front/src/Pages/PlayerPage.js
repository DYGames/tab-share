import React from "react"
import MIDI from "midi.js"
import styled from "styled-components";
import ReadTabFile from "../Logic/Tablature/ReadTabFile";

export default class PlayerPage extends React.Component {
    constructor(props, context, updater) {
        super(props, context, updater);
        this.state = {
            isPluginLoaded: false,
        }

        this.loadPlugin = this.loadPlugin.bind(this);
        this.playNote = this.playNote.bind(this);
    }

    loadPlugin(inst, chan) {
        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            instrument: inst,
            onprogress: function (state, progress) {
            },
            onsuccess: function () {
                this.setState({ isPluginLoaded: true });
                MIDI.programChange(chan, MIDI.GM.byName[inst].number);
            }.bind(this)
        });
    }

    playNote(key, chan, delay) {
        if (!this.state.isPluginLoaded)
            return
        MIDI.setVolume(chan, 127);
        MIDI.noteOn(chan, MIDI.keyToNote[key], 127, 0);
        MIDI.noteOff(chan, MIDI.keyToNote[key], delay * 0.001);
    }

    stopNote(chan, note) {
        //MIDI.noteOff(chan, note, 0);
        MIDI.stopAllNotes();
    }

    playSheet(sheet, chan) {
        for (let i = 0; i < sheet.bars.length; i++) {
            let idx = 0;
            (function note(j) {
                let tempo = 0;
                let delay = 0;
                for (; j < sheet.bars[i].notes.length; j++) {
                    if (sheet.bars[i].notes[j].index === idx) {
                        tempo = sheet.bars[i].notes[j].tempo;
                        if (tempo === 0 || tempo === 5)
                            delay = (60000 / sheet.bpm) * 4;
                        else if (tempo === 1 || tempo === 6)
                            delay = (60000 / sheet.bpm) * 2;
                        else if (tempo === 2 || tempo === 7)
                            delay = (60000 / sheet.bpm);
                        else if (tempo === 3 || tempo === 8)
                            delay = (60000 / sheet.bpm) / 2;
                        else if (tempo === 4 || tempo === 9)
                            delay = (60000 / sheet.bpm) / 4;
                        this.playNote(sheet.bars[i].notes[j].note, chan, delay);
                    }
                    else
                        break;
                }
                idx++;
                setTimeout(note.bind(this), delay, j);
            }.bind(this)(0));
        }
    }

    render() {
        const Button = styled.button`
            float: left;
        `;

        const Div = styled.div`
            display: inline-block;
            width: 100%;
        `;

        return (
            <div>
                <Div>

                    <Button onClick={() => {
                        this.loadPlugin("distortion_guitar", 2);
                    }}>Guitar</Button>
                    <Button onClick={() => {
                        ReadTabFile.read("http://localhost:3001/public/tab.tab").then((sheet) => { this.playSheet(sheet, 2); });
                    }}>Sheet</Button>
                </Div>
                <Div>
                    <Button onClick={() => {
                        this.loadPlugin("acoustic_grand_piano", 0);
                    }}>Piano</Button>
                    <Button onClick={() => {
                        ReadTabFile.read("http://localhost:3001/public/tab.tab").then((sheet) => { this.playSheet(sheet, 0); });
                    }}>Sheet</Button>
                    <Button onClick={() => { this.playNote("C2", 0); }}>C2</Button>
                    <Button onClick={() => { this.playNote("Db2", 0); }}>Db2</Button>
                    <Button onClick={() => { this.playNote("D2", 0); }}>D2</Button>
                    <Button onClick={() => { this.playNote("Eb2", 0); }}>Eb2</Button>
                    <Button onClick={() => { this.playNote("E2", 0); }}>E2</Button>
                    <Button onClick={() => { this.playNote("F2", 0); }}>F2</Button>
                    <Button onClick={() => { this.playNote("Gb2", 0); }}>Gb2</Button>
                    <Button onClick={() => { this.playNote("G2", 0); }}>G2</Button>
                    <Button onClick={() => { this.playNote("Ab2", 0); }}>Ab2</Button>
                    <Button onClick={() => { this.playNote("A2", 0); }}>A2</Button>
                    <Button onClick={() => { this.playNote("Bb2", 0); }}>Bb2</Button>
                    <Button onClick={() => { this.playNote("B2", 0); }}>B2</Button>
                </Div>
                <Div>
                    <Button onClick={() => { this.loadPlugin("synth_drum", 1); }}>Drum</Button>
                    <Button onClick={() => { this.playNote("C1", 1); }}>C1</Button>
                    <Button onClick={() => { this.playNote("C2", 1); }}>C2</Button>
                    <Button onClick={() => { this.playNote("C3", 1); }}>C3</Button>
                    <Button onClick={() => { this.playNote("C4", 1); }}>C4</Button>
                    <Button onClick={() => { this.playNote("C5", 1); }}>C5</Button>
                    <Button onClick={() => { this.playNote("C6", 1); }}>C6</Button>
                    <Button onClick={() => { this.playNote("C7", 1); }}>C7</Button>
                </Div>
            </div>
        );
    }
}