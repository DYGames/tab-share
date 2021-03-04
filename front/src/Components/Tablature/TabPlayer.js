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
        if(this.currentSheet !== null)
            this.currentSheet.render(this);
        this.renderProgressBar(this.progress);
        requestAnimationFrame(this.renderCanvas.bind(this));
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
        if (this.progress >= this.barWidth * this.currentSheet.bars.length) {
            this.progress = this.barWidth * this.currentSheet.bars.length - 1;
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
            requestAnimationFrame(this.renderCanvas.bind(this));
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