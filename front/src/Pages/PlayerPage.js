import React from "react"
import MIDI from "midi.js"
import styled from "styled-components";

export default class PlayerPage extends React.Component {
    constructor(props, context, updater) {
        super(props, context, updater);
        this.state = {
            isPluginLoaded: false,
        }

        this.loadPlugin = this.loadPlugin.bind(this);
    }

    componentDidMount() {
        //this.loadPlugin();
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

    playNote(key, chan) {
        if (!this.state.isPluginLoaded)
            return
        var delay = 0;
        var velocity = 127;
        MIDI.setVolume(chan, 127);
        MIDI.noteOn(chan, MIDI.keyToNote[key], velocity, delay);
        MIDI.noteOff(chan, MIDI.keyToNote[key], delay + 0.75);
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
                    <Button onClick={() => { this.loadPlugin("acoustic_grand_piano", 0); }}>Piano</Button>
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