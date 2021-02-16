import React from "react";
import styled from "styled-components";
import SheetPlayer from "../../Logic/Tablature/SheetPlayer"
import ReadTabFile from "../../Logic/Tablature/ReadTabFile"

export default class TabPlayer extends React.Component {
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
                        SheetPlayer.loadPlugin("distortion_guitar", 2);
                    }}>Guitar</Button>
                    <Button onClick={() => {
                        ReadTabFile.read("http://localhost:3001/public/tab.tab").then((sheet) => { SheetPlayer.playSheet(sheet, 2); });
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