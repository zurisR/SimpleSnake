class SnakePart {

    constructor(x, y, size, isHead = false) {
        this.xCord = this.prevXCord = x;
        this.yCord = this.prevYCord = y;
        this.size = size;
        this.isHead = isHead;

        this.draw = this.draw.bind(this);

        this.getPrevCords = this.getPrevCords.bind(this);
        this.getCurrentCords = this.getCurrentCords.bind(this);
        this.setCurrentCords = this.setCurrentCords.bind(this);
    }

    getPrevCords() {
        return [this.prevXCord, this.prevYCord];
    }

    getCurrentCords() {
        return [this.xCord, this.yCord];
    }

    setCurrentCords(x, y) {
        this.prevXCord = this.xCord;
        this.prevYCord = this.yCord;

        this.xCord = x;
        this.yCord = y;
    }

    draw(ctx) {
        ctx.fillStyle = "rgb(0,200,0)";
        ctx.fillRect(this.xCord, this.yCord, this.size, this.size);
        
        ctx.fillStyle='#000';
        ctx.strokeRect(this.xCord - 1, this.yCord - 1, this.size + 2, this.size + 2);
    }   
}

export default SnakePart;