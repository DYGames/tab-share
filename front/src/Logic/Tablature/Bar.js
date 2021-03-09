import Chord from "./Chord";

export default class Bar {
    constructor(index) {
        this.index = index;
        this.chords = [];
        for (let j = 0; j < 8; j++) {
            this.chords.push(new Chord(j, 3, true));
        }
    }

    render(sender) {
        this.renderString(sender, this.index);
        this.renderBarFrame(sender, this.index);
        let delta = (sender.barWidth * (this.index % 4)) + (sender.barWidth / 16) + sender.barBorder.left;
        for (let i = 0; i < this.chords.length; i++) {
            if (!this.chords[i].active) continue;
            this.chords[i].render(sender, this.index, delta);
            let tempo = this.chords[i].tempo;
            if (tempo === 0 || tempo === 5)
                delta += sender.barWidth / 1;
            else if (tempo === 1 || tempo === 6)
                delta += sender.barWidth / 2;
            else if (tempo === 2 || tempo === 7)
                delta += sender.barWidth / 4;
            else if (tempo === 3 || tempo === 8)
                delta += sender.barWidth / 8;
            else if (tempo === 4 || tempo === 9)
                delta += sender.barWidth / 16;
        }
    }

    renderString(sender, idx) {
        sender.ctx.strokeStyle = '#000000';
        sender.ctx.beginPath();
        for (let i = 0; i < sender.stringCount; i++) {
            sender.ctx.moveTo(sender.barBorder.left + (sender.barWidth * ((idx % 4))), (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + (sender.stringBorder * (i + 1)));
            sender.ctx.lineTo(sender.barBorder.left + (sender.barWidth * ((idx % 4) + 1)), (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + (sender.stringBorder * (i + 1)));
        }
        sender.ctx.closePath();
        sender.ctx.stroke();
    }

    renderBarFrame(sender, idx) {
        sender.ctx.beginPath();
        sender.ctx.moveTo(sender.barBorder.left + (sender.barWidth * ((idx % 4))), (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.barBorder.top);
        sender.ctx.lineTo(sender.barBorder.left + (sender.barWidth * ((idx % 4))), (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.stringBorder * sender.stringCount);
        sender.ctx.moveTo(sender.barBorder.left + (sender.barWidth * ((idx % 4) + 1)), (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.barBorder.top);
        sender.ctx.lineTo(sender.barBorder.left + (sender.barWidth * ((idx % 4) + 1)), (Math.floor(idx / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.stringBorder * sender.stringCount);
        sender.ctx.closePath();
        sender.ctx.stroke();
    }
}