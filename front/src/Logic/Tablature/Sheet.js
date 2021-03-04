export default class Sheet {
    constructor () {
        this.bars = [];
        this.bpm = 82;
    }

    render(sender) {
        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].render(sender);
        }
    }
}