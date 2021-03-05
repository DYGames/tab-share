export default class Sheet {
    constructor() {
        this.tracks = [];
        this.currentTrack = 0;
        this.bpm = 82;
    }

    render(sender) {
        this.tracks[this.currentTrack].render(sender);
    }
}