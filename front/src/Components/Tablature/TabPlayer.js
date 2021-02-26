import React from "react";
import logo from "../../logo.svg"
import styled from "styled-components"
import SheetPlayer from "../../Logic/Tablature/SheetPlayer"
import ReadTabFile from "../../Logic/Tablature/ReadTabFile"

export default class TabPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPluginLoaded: false,
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

        this.stringBorder = 15;
        this.stringCount = 6;
        this.currentSheet = null;
        this.progress = 0;
        this.progressInterval = null;
        this.currentChannel = 0;
    }

    componentDidMount() {
        this.ctx = this.playerRef.current.getContext('2d');
        this.ctx.font = '10pt Consolas';
        this.renderCanvas();
    }

    renderCanvas() {
        this.ctx.clearRect(0, 0, this.sheetSize.width, this.sheetSize.height);
        this.renderSheetTab(this.currentSheet);
        requestAnimationFrame(this.renderCanvas.bind(this));
    }

    renderSheetTab(sheet) {

        if (sheet === null)
            return;

        for (let i = 0; i < sheet.bars.length; i++) {
            this.renderString(i);
            this.renderBarFrame(i);
            let delta = (this.barWidth * i) + (this.barWidth / 16) + this.barBorder.left;
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

        this.renderProgressBar(this.progress);
    }

    renderBarFrame(idx) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.barBorder.left + (this.barWidth * ((idx % 4))), this.barBorder.top);
        this.ctx.lineTo(this.barBorder.left + (this.barWidth * ((idx % 4))), this.stringBorder * this.stringCount);
        this.ctx.moveTo(this.barBorder.left + (this.barWidth * ((idx % 4) + 1)), this.barBorder.top);
        this.ctx.lineTo(this.barBorder.left + (this.barWidth * ((idx % 4) + 1)), this.stringBorder * this.stringCount);
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

    renderString(idx) {
        this.ctx.strokeStyle = '#000000';
        this.ctx.beginPath();
        for (let i = 0; i < this.stringCount; i++) {
            this.ctx.moveTo(this.barBorder.left + (this.barWidth * ((idx % 4))), (Math.floor(idx / 4) * (this.stringBorder * (this.stringCount + 1))) + (this.stringBorder * (i + 1)));
            this.ctx.lineTo(this.barBorder.left + (this.barWidth * ((idx % 4) + 1)), (Math.floor(idx / 4) * (this.stringBorder * (this.stringCount + 1))) + (this.stringBorder * (i + 1)));
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    playProgress() {
        this.progress += (10 / ((60000 / this.currentSheet.bpm) * 4)) * this.barWidth;
        if (this.progress >= this.barWidth * this.currentSheet.bars.length) {
            this.progress = this.barWidth * this.currentSheet.bars.length;
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    loadPlugin(plugin, chan) {
        //if (this.state.isPluginLoaded)
        //    return;
        SheetPlayer.loadPlugin(plugin, chan).then((value) => {
            this.currentChannel = chan;
            this.setState({ isPluginLoaded: value });
        });
    }

    loadSheet(url) {
        ReadTabFile.read(url).then((sheet) => {
            this.currentSheet = sheet;
        });
    }

    play() {
        if (this.currentSheet === null || !this.state.isPluginLoaded)
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

    render() {
        const TabText = styled.a`    
            text-decoration: none;
            color: black;
        `;
        const Cell = styled.td`
            border: 1px solid black;
            padding: 0 0 0 0;
        `;

        return (
            <table style={{ height: "1px" }}>
                <tbody>
                    <tr>
                        <td>
                            <div style={{ float: "left", height: "100%" }}>
                                <table style={{ borderSpacing: "0px"/*, height: "100%" */}}>
                                    <tbody>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>온음</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ float: "left", height: "100%" }}>
                                <table style={{ borderSpacing: "0px"/*, height: "100%" */}}>
                                    <tbody>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>Guitar</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>Bass</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>Vocal</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
                                        <tr>
                                            <Cell>
                                                <TabText href="#!">
                                                    <div>
                                                        <img src={logo} alt=""></img>
                                                        <span>Drum</span>
                                                    </div>
                                                </TabText>
                                            </Cell>
                                        </tr>
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
                                <button onClick={this.loadPlugin.bind(this, "distortion_guitar", 1)}>{this.state.isPluginLoaded ? "Plugin Loaded" : "Load Plugin"}</button>
                                <button onClick={this.loadPlugin.bind(this, "acoustic_grand_piano", 2)}>{this.state.isPluginLoaded ? "Plugin Loaded" : "Load Plugin"}</button>
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