export default class Track {
    constructor (index) {
        this.bars = [];
        this.index = index;
    }

    render(sender) {
        let left = sender.barBorder.left;
        for (let i = 0; i < this.bars.length; i++) {
            this.bars[i].render(sender, left);
            left += this.bars[i].width;
        }
    }
}