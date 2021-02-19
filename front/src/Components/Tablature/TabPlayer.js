import React from "react";
import SheetPlayer from "../../Logic/Tablature/SheetPlayer"
import ReadTabFile from "../../Logic/Tablature/ReadTabFile"

export default class TabPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.playerRef = React.createRef();

        this.sheetSize = {
            width: 1300,
            height: 160
        };

        this.barBorder = {
            left: 20,
            right: 20,
            top: 15,
            bottom: 15,
        };

        this.barWidth = (this.sheetSize.width - (this.barBorder.left + this.barBorder.right)) / 4;

        this.stringBorder = 15;
        this.stringCount = 6;
        this.currentSheet = null;
        this.progress = 0;
        this.progressInterval = null;
    }

    componentDidMount() {
        this.ctx = this.playerRef.current.getContext('2d');
        this.ctx.font = '10pt Consolas';
        this.canvasRender();
    }

    renderSheet(sheet) {
        if (sheet === null)
            return;
        for (let i = 0; i < sheet.bars.length; i++) {
            this.renderBar(i);
            let delta = (this.barWidth / 16) + this.barBorder.left;
            for (let j = 0; j < sheet.bars[i].chords.length; j++) {
                for (let k = 0; k < sheet.bars[i].chords[j].notes.length; k++) {
                    let fret = sheet.bars[i].chords[j].notes[k].fret;
                    if (fret === 110) continue;
                    else if (fret === 120) fret = 'x';
                    let y = this.stringBorder * sheet.bars[i].chords[j].notes[k].string;
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.fillRect(delta, y - 2, 8, 4);
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillText(`${fret}`, delta, y + (8 / 2));
                }
                this.ctx.fillStyle = '#000000';
                this.ctx.fillText(`${["w", "h", "q", "e", "s", "wr", "hr", "qr", "er", "sr"][sheet.bars[i].chords[j].notes[0].tempo]}`, delta, this.stringBorder * (this.stringCount + 1));

                let tempo = sheet.bars[i].chords[j].notes[0].tempo;
                if (tempo === 0 || tempo === 5)
                    delta += this.barWidth / 1;
                else if (tempo === 1 || tempo === 6)
                    delta += this.barWidth / 2;
                else if (tempo === 2 || tempo === 7)
                    delta += this.barWidth / 4;
                else if (tempo === 3 || tempo === 8)
                    delta += this.barWidth / 8;
                else if (tempo === 4 || tempo === 9)
                    delta += this.barWidth / 16;
            }
        }
    }

    renderBar(idx) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.barBorder.left + (this.barWidth * idx), this.barBorder.top);
        this.ctx.lineTo(this.barBorder.left + (this.barWidth * idx), this.stringBorder * this.stringCount);
        this.ctx.moveTo(this.barBorder.left + (this.barWidth * (idx + 1)), this.barBorder.top);
        this.ctx.lineTo(this.barBorder.left + (this.barWidth * (idx + 1)), this.stringBorder * this.stringCount);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    renderProgressBar(x) {
        this.ctx.strokeStyle = '#FF00FF';
        this.ctx.beginPath();
        this.ctx.moveTo(this.barBorder.left + x, this.barBorder.top);
        this.ctx.lineTo(this.barBorder.left + x, this.stringBorder * this.stringCount);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    renderString() {
        this.ctx.strokeStyle = '#000000';
        this.ctx.beginPath();
        for (let i = 0; i < this.stringCount; i++) {
            this.ctx.moveTo(0, this.stringBorder * (i + 1));
            this.ctx.lineTo(this.sheetSize.width, this.stringBorder * (i + 1));
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    canvasRender() {
        this.ctx.clearRect(0, 0, this.sheetSize.width, this.sheetSize.height);
        this.renderString();
        this.renderSheet(this.currentSheet);
        this.renderProgressBar(this.progress);
        requestAnimationFrame(this.canvasRender.bind(this));
    }

    playProgress() {
        this.progress += (10 / ((60000 / this.currentSheet.bpm) * 4)) * this.barWidth;
        if (this.progress >= this.barWidth) {
            this.progress = this.barWidth;
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    loadPlugin() {
        SheetPlayer.loadPlugin("distortion_guitar", 2);
    }

    loadSheet() {
        ReadTabFile.read("http://localhost:3001/public/tab.tab").then((sheet) => {
            this.currentSheet = sheet;
        });
    }

    play() {
        if (this.currentSheet === null)
            return;

        if (this.progress === 0)
            SheetPlayer.playSheet(this.currentSheet, 2);

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

    render() {
        return (
            <div>
                <canvas width={this.sheetSize.width} height={this.sheetSize.height} ref={this.playerRef} />
                <div style={{ display: "flex" }}>
                    <button onClick={this.loadPlugin.bind(this)}>Load Plugin</button>
                    <button onClick={this.loadSheet.bind(this)}>Load Sheet</button>
                    <button onClick={this.play.bind(this)}>Play</button>
                    <button onClick={this.pause.bind(this)}>Pause</button>
                    <button onClick={this.stop.bind(this)}>Stop</button>
                </div>
            </div>);
    }
}