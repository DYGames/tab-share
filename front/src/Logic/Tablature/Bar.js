export default class Bar {
    constructor(index) {
        this.index = index;
        this.chords = [];
        this.width = 0;
    }

    render(sender, left) {
        this.width = sender.barWidth / 16;

        for (let i = 0; i < this.chords.length; i++) {
            this.width += sender.barWidth / Math.pow(2, this.chords[i].tempo % 5);
        }

        this.renderString(sender, this.index, left);
        this.renderBarFrame(sender, this.index, left);
        let delta = left + sender.barWidth / 16;
        for (let i = 0; i < this.chords.length; i++) {
            if (!this.chords[i].active) continue;
            this.chords[i].render(sender, this.index, delta);
            delta += sender.barWidth / Math.pow(2, this.chords[i].tempo % 5);
        }
    }

    renderString(sender, idx, left) {
        sender.ctx.strokeStyle = '#000000';
        sender.ctx.beginPath();
        for (let i = 0; i < sender.stringCount; i++) {
            sender.ctx.moveTo(left, (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + (sender.stringBorder * (i + 1)));
            sender.ctx.lineTo(left + this.width, (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + (sender.stringBorder * (i + 1)));
        }
        sender.ctx.closePath();
        sender.ctx.stroke();
    }

    renderBarFrame(sender, idx, left) {
        let top = (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.barBorder.top;

        sender.ctx.beginPath();
        sender.ctx.moveTo(left, top);
        sender.ctx.lineTo(left, (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.stringBorder * sender.stringCount);
        sender.ctx.moveTo(left + this.width, top);
        sender.ctx.lineTo(left + this.width, (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.stringBorder * sender.stringCount);
        sender.ctx.closePath();
        sender.ctx.stroke();
    }
}