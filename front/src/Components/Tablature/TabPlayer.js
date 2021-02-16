import React from "react";
import styled from "styled-components";
import SheetPlayer from "../../Logic/Tablature/SheetPlayer"
import ReadTabFile from "../../Logic/Tablature/ReadTabFile"

export default class TabPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.playerRef = React.createRef();
    }

    componentDidMount() {
        this.ctx = this.playerRef.current.getContext('2d');
        this.ctx.font = '16pt Consolas';
        this.ctx.beginPath();
        this.ctx.moveTo(20, 20);
        this.ctx.lineTo(20, 120);
        this.ctx.moveTo(780, 20);
        this.ctx.lineTo(780, 120);
        for (let i = 0; i < 6; i++) {
            this.ctx.moveTo(0, 20 * (i + 1));
            this.ctx.lineTo(800, 20 * (i + 1));
        }
        this.ctx.closePath();
        this.ctx.stroke();

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
                <canvas width={800} height={150} ref={this.playerRef} />
                <Div>
                    <Button onClick={() => {
                        SheetPlayer.loadPlugin("distortion_guitar", 2);
                    }}>Guitar</Button>
                    <Button onClick={() => {
                        ReadTabFile.read("http://localhost:3001/public/tab.tab").then((sheet) => {
                            let idx = -1, delta = 0;
                            for (let i = 0; i < sheet.bars.length; i++) {
                                for (let j = 0; j < sheet.bars[i].notes.length; j++) {
                                    if (sheet.bars[i].notes[j].index !== idx) {
                                        let tempo = sheet.bars[i].notes[j].tempo;
                                        if (tempo === 0 || tempo === 5)
                                            delta += (800 - 40) / 1;
                                        else if (tempo === 1 || tempo === 6)
                                            delta += (800 - 40) / 2;
                                        else if (tempo === 2 || tempo === 7)
                                            delta += (800 - 40) / 4;
                                        else if (tempo === 3 || tempo === 8)
                                            delta += (800 - 40) / 8;
                                        else if (tempo === 4 || tempo === 9)
                                            delta += (800 - 40) / 16;
                                    }
                                    idx = sheet.bars[i].notes[j].index;
                                    let fret = sheet.bars[i].notes[j].fret;
                                    if (fret === 110) continue;
                                    else if (fret === 120) fret = 'x';
                                    let y = 20 * sheet.bars[i].notes[j].string;
                                    this.ctx.fillStyle = '#FFFFFF';
                                    this.ctx.fillRect(delta - 20, y - 2, 12, 4);
                                    this.ctx.fillStyle = '#000000';
                                    this.ctx.fillText(`${fret}`, delta - 20, y + (16 / 2));
                                }
                            }
                            SheetPlayer.playSheet(sheet, 2);
                        });
                    }}>Sheet</Button>
                </Div>
                <Div>
                    <Button onClick={() => {
                        SheetPlayer.loadPlugin("acoustic_grand_piano", 0);
                    }}>Piano</Button>
                    <Button onClick={() => {
                        ReadTabFile.read("http://localhost:3001/public/tab.tab").then((sheet) => { SheetPlayer.playSheet(sheet, 0); });
                    }}>Sheet</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C2", 0); }}>C2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("Db2", 0); }}>Db2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("D2", 0); }}>D2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("Eb2", 0); }}>Eb2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("E2", 0); }}>E2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("F2", 0); }}>F2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("Gb2", 0); }}>Gb2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("G2", 0); }}>G2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("Ab2", 0); }}>Ab2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("A2", 0); }}>A2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("Bb2", 0); }}>Bb2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("B2", 0); }}>B2</Button>
                </Div>
                <Div>
                    <Button onClick={() => { SheetPlayer.loadPlugin("synth_drum", 1); }}>Drum</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C1", 1); }}>C1</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C2", 1); }}>C2</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C3", 1); }}>C3</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C4", 1); }}>C4</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C5", 1); }}>C5</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C6", 1); }}>C6</Button>
                    <Button onClick={() => { SheetPlayer.playNote("C7", 1); }}>C7</Button>
                </Div>
            </div>);
    }
}