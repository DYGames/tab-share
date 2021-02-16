import React from "react"
import MIDI from "midi.js"
import TabPlayer from "../Components/Tablature/TabPlayer";

export default class PlayerPage extends React.Component {
    render() {
        return (
            <div>
                <TabPlayer></TabPlayer>
            </div>
        );
    }
}