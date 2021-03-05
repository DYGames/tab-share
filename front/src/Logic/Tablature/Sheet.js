export default class Sheet {
    constructor () {
        this.tracks = [];
        this.bpm = 82;
    }

    render(sender) {
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].render(sender);
        }
    }
}