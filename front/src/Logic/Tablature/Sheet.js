export default class Sheet {
    constructor () {
        this.tracks = [];
    }

    render(sender) {
        for (let i = 0; i < this.tracks.length; i++) {
            this.tracks[i].render(sender);
        }
    }
}