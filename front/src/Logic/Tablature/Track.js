export default class Track {
    constructor (index) {
        this.bars = [];
        this.index = index;
    }

    render(sender) {
        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].render(sender);
        }
    }
}