import React from "react";
import logo from "../../logo.svg"
import styled from "styled-components"
import SheetPlayer from "../../Logic/Tablature/SheetPlayer"
import ReadTabFile from "../../Logic/Tablature/ReadTabFile"
import Note from "../../Logic/Tablature/Note";
import Bar from "../../Logic/Tablature/Bar";
import Chord from "../../Logic/Tablature/Chord";

export default class TabPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sheetChanged: false,
            loadedPluginIndex: -1,
        }

        this.playerRef = React.createRef();

        this.sheetSize = {
            width: 1000,
            height: 800
        };

        this.barBorder = {
            left: 20,
            right: 20,
            top: 15,
            bottom: 15,
        };

        this.barWidth = (this.sheetSize.width - (this.barBorder.left + this.barBorder.right)) / 4;

        this.currentSheet = null;
        this.stringBorder = 15;
        this.stringCount = 6;
        this.progress = 0;
        this.progressInterval = null;
        this.currentChannel = 0;
        this.currentTempo = 0;
        this.isEdit = false;
        this.inputNote = "";
    }

    componentDidMount() {
        this.ctx = this.playerRef.current.getContext('2d');
        this.ctx.font = '10pt Consolas';
        this.playerRef.current.addEventListener("click", (e) => {
            this.isEdit = !this.isEdit;
            if (!this.isEdit) {
                let bar = this.currentSheet.tracks[this.currentSheet.currentTrack].bars[this.editBar];
                if (bar.chords.length === 0) {
                    for (let i = 0; i < 8; i++) {
                        bar.chords.push(new Chord(i, 3));
                    }
                }
                //this.editIndex + 1, this.currentTempo, 
                bar.chords[this.editIndex].notes.push(new Note(this.editString + 1, Number(this.inputNote), [[],
                ["E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Cb5"],
                ["B3", "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab5"],
                ["G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4"],
                ["D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3"],
                ["A2", "Bb2", "B2", "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3"],
                ["E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3"]][this.editString + 1][Number(this.inputNote)]));
                console.log(this.currentSheet);
                requestAnimationFrame(this.renderCanvas.bind(this));
                return;
            }
            this.inputNote = "";
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            this.editString = (Math.round(y / this.stringBorder) - 1) % 7;
            this.editBar = Math.floor((x - this.barBorder.left) / this.barWidth) + (Math.floor((Math.round(y / this.stringBorder) - 1) / (this.stringCount + 1)) * 4);
            this.editIndex = Math.floor(((x - this.barBorder.left) - (Math.floor((x - this.barBorder.left) / this.barWidth) * this.barWidth)) / (this.barWidth / 8));
            requestAnimationFrame(this.renderCanvas.bind(this));
        });
        window.onkeypress = (e) => {
            if (!this.isEdit) return;
            this.inputNote += String.fromCharCode(e.keyCode);
            requestAnimationFrame(this.renderCanvas.bind(this));
        };
        this.renderCanvas();
    }

    renderCanvas() {
        this.ctx.clearRect(0, 0, this.sheetSize.width, this.sheetSize.height);

        if (this.currentSheet !== null)
            this.currentSheet.render(this);

        this.renderProgressBar(this.progress);

        if (this.isEdit)
            this.renderEditor();
    }

    renderEditor() {
        let delta = (this.barWidth * (this.editBar % 4)) + (this.barWidth / 16) + this.barBorder.left + (this.editIndex * (this.barWidth / 8));
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(delta - 1, (Math.floor(this.editBar / 4) * (this.stringBorder * (this.stringCount + 1))) + (this.stringBorder * (this.editString + 1)) - 9, 18, 18);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(delta, (Math.floor(this.editBar / 4) * (this.stringBorder * (this.stringCount + 1))) + (this.stringBorder * (this.editString + 1)) - 8, 16, 16);
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(`${this.inputNote}`, delta, (Math.floor(this.editBar / 4) * (this.stringBorder * (this.stringCount + 1))) + (this.stringBorder * (this.editString + 1)) + 4);
    }

    renderProgressBar(x) {
        let idx = Math.floor(x / this.barWidth);
        this.ctx.strokeStyle = '#FF00FF';
        this.ctx.beginPath();
        this.ctx.moveTo(this.barBorder.left + (x - (Math.floor(idx / 4)) * (this.barWidth * 4)), (Math.floor(idx / 4) * (this.stringBorder * (this.stringCount + 1)) + this.barBorder.top));
        this.ctx.lineTo(this.barBorder.left + (x - (Math.floor(idx / 4)) * (this.barWidth * 4)), (Math.floor(idx / 4) * (this.stringBorder * (this.stringCount + 1)) + this.stringBorder * this.stringCount));
        this.ctx.closePath();
        this.ctx.stroke();
    }

    playProgress() {
        this.progress += (10 / ((60000 / this.currentSheet.bpm) * 4)) * this.barWidth;
        requestAnimationFrame(this.renderCanvas.bind(this));
        if (this.progress >= this.barWidth * this.currentSheet.tracks[0].bars.length) {
            this.progress = this.barWidth * this.currentSheet.tracks[0].bars.length - 1;
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    loadPlugin(plugin, chan) {
        SheetPlayer.loadPlugin(plugin, chan).then((value) => {
            this.currentChannel = chan;
            this.setState({ loadedPluginIndex: chan });
        });
    }

    loadSheet(url) {
        ReadTabFile.read(url).then((sheet) => {
            this.currentSheet = sheet;
            this.setState({ sheetChanged: !this.state.sheetChanged });
            requestAnimationFrame(this.renderCanvas.bind(this));
        });
    }

    play() {
        if (this.currentSheet === null)
            return;

        if (this.progress === 0)
            SheetPlayer.playSheet(this.currentSheet, this.currentChannel);

        if (this.progressInterval !== null)
            clearInterval(this.progressInterval);

        this.progressInterval = setInterval(this.playProgress.bind(this), 10);
    }

    pause() {
        if (this.progressInterval !== null)
            clearInterval(this.progressInterval);
    }

    stop() {
        this.progress = 0;

        if (this.progressInterval !== null)
            clearInterval(this.progressInterval);
    }

    changeTrack(index) {
        if (this.currentSheet !== null) {
            this.currentSheet.currentTrack = index;
            requestAnimationFrame(this.renderCanvas.bind(this));
        }
    }

    changeNote(index) {
        this.currentTempo = index;
    }

    addBar() {
        this.currentSheet.tracks[this.currentSheet.currentTrack].bars.push(new Bar(this.currentSheet.tracks[this.currentSheet.currentTrack].bars.length));
        requestAnimationFrame(this.renderCanvas.bind(this));
    }

    render() {
        const Cell = styled.td`
            border: 1px solid #f6f8fa;
            border-radius: 6px;
            padding: 0 0 0 0;
        `;
        let noteButtons = [];
        let noteIds = ["온음표", "2분음표", "4분음표", "8분음표", "16분음표", "온쉼표", "2분쉼표", "4분쉼표", "8분쉼표", "16분쉼표"];
        for (let i = 0; i < noteIds.length; i += 2) {
            noteButtons.push(
                <tr key={i}>
                    <Cell>
                        <button onClick={this.changeNote.bind(this, i)}>
                            <div>
                                <img src={logo} alt=""></img>
                                <span>{noteIds[i]}</span>
                            </div>
                        </button>
                    </Cell>
                    <Cell>
                        <button onClick={this.changeNote.bind(this, i + 1)}>
                            <div>
                                <img src={logo} alt=""></img>
                                <span>{noteIds[i + 1]}</span>
                            </div>
                        </button>
                    </Cell>
                </tr>);
        }
        let trackButtons = [];
        if (this.currentSheet !== null) {
            for (let i = 0; i < this.currentSheet.tracks.length; i++) {
                trackButtons.push(
                    <tr key={i}>
                        <Cell>
                            <button onClick={this.changeTrack.bind(this, i)}>
                                <div>
                                    <img src={logo} alt=""></img>
                                    <span>Guitar {i + 1}</span>
                                </div>
                            </button>
                        </Cell>
                    </tr>);
            }
        }
        return (
            <table style={{ height: "1px" }}>
                <tbody>
                    <tr>
                        <td>
                            <div style={{ float: "left", width: "140px", height: "100%" }}>
                                <table style={{ borderColor: "transparent" }}>
                                    <tbody>
                                        {noteButtons}
                                        <tr>
                                            <Cell>
                                                <button onClick={this.addBar.bind(this)}>
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>Add Bar</span>
                                                    </div>
                                                </button>
                                            </Cell>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ float: "left", height: "100%" }}>
                                <table style={{ borderColor: "transparent" }}>
                                    <tbody>
                                        {trackButtons}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                        <td>
                            <canvas width={this.sheetSize.width} height={this.sheetSize.height} ref={this.playerRef} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                        <td>
                            <div style={{ display: "flex" }}>
                                <button onClick={this.loadPlugin.bind(this, "distortion_guitar", 1)}>{this.state.loadedPluginIndex === 1 ? "Plugin Loaded" : "guitar"}</button>
                                <button onClick={this.loadPlugin.bind(this, "acoustic_grand_piano", 2)}>{this.state.loadedPluginIndex === 2 ? "Plugin Loaded" : "piano"}</button>
                                <button onClick={this.loadSheet.bind(this, `${process.env.REACT_APP_BACKEND_HOST}/public/tab.tab`)}>Load Sheet1</button>
                                <button onClick={this.loadSheet.bind(this, `${process.env.REACT_APP_BACKEND_HOST}/public/stair.tab`)}>Load Sheet2</button>
                                <button onClick={this.play.bind(this)}>Play</button>
                                <button onClick={this.pause.bind(this)}>Pause</button>
                                <button onClick={this.stop.bind(this)}>Stop</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>);
    }
}