export default class Chord {
    constructor(index, tempo, active) {
        this.notes = [];
        this.index = index;
        this.tempo = tempo;
        this.active = active;
    }

    render(sender, index, delta) {
        for (let k = 0; k < this.notes.length; k++) {
            let fret = this.notes[k].fret;
            if (fret === 110) continue;
            else if (fret === 120) fret = 'x';
            let y = sender.stringBorder * this.notes[k].string;
            sender.ctx.fillStyle = '#FFFFFF';
            sender.ctx.fillRect(delta, (Math.floor(index / 4) * (sender.stringBorder * (sender.stringCount + 1))) + y - 2, 8, 4);
            sender.ctx.fillStyle = '#000000';
            sender.ctx.fillText(`${fret}`, delta, (Math.floor(index / 4) * (sender.stringBorder * (sender.stringCount + 1))) + y + (8 / 2));
            this.notes[k].rect = { left: delta, top: (Math.floor(index / 4) * (sender.stringBorder * (sender.stringCount + 1))) + y, width: 8, height: 4 };
        }
        sender.ctx.fillStyle = '#000000';
        sender.ctx.fillText(`${["w", "h", "q", "e", "s", "wr", "hr", "qr", "er", "sr"][this.tempo]}`, delta, (Math.floor(index / 4) * (sender.stringBorder * (sender.stringCount + 1))) + sender.stringBorder * (sender.stringCount + 1));

    }

    getNoteByString(string) {
        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].string === string)
                return this.notes[i];
        }
        return null;
    }
}