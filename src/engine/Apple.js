class Apple {
    constructor(x, y, size) {
        this.xCord = x;
        this.yCord = y;
        this.size = size;
    }

    draw(ctx) {
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(this.xCord, this.yCord, this.size, this.size);
        
        ctx.fillStyle='#000';
        ctx.strokeRect(this.xCord - 1, this.yCord - 1, this.size + 2, this.size + 2);
    }

    getCoords() {
        return [this.xCord, this.yCord];
    }
}

export default Apple;