class Canvas {
    constructor(div, pattern, height=300) {
        // console.log(pattern);

        this.div = div;
        this.pattern = pattern;
        this.height=height;
        this.radius = height/3;
        this.points={
            1: [1,1],
            2: [2,1],
            3: [3,1],
            4: [1,2],
            5: [2,2],
            6: [3,2],
            7: [1,3],
            8: [2,3],
            9: [3,3],
        }

        this.create();
        this.reset();
        


        let path = {
            strokeStyle: 'steelblue',
            strokeWidth: 10,
            rounded: true,
            endArrow: true,
            arrowRadius: 25,
            arrowAngle: 70,
            closed: false,
        };
        for (let i = 0; i < this.pattern.pattern.length; i++) {
            path[`x${i+1}`]= this.points[ pattern.pattern[i] ][0]*this.radius-this.radius/2;
            path[`y${i+1}`]= this.points[ pattern.pattern[i] ][1]*this.radius-this.radius/2;
        }
        this.canvas.drawLine(path);
    }
    create() {
        $(this.div).prepend(`
        <div class="pattern" id="${this.pattern.id}" style="width:${this.height}px;height:${this.height}px;">
            <canvas height="${this.height}" width="${this.height}">
            </canvas>
            <input type="button" class="delete" value="Delete" onclick="patterns.destroyPattern('${this.pattern.id}')">
        </div>
        `);

        this.canvas = $(`.pattern#${this.pattern.id} canvas`);
        
    }
    reset() {
        for (let i =1; i<10; i++) {
            this.canvas.drawArc({
                fillStyle: '#555',
                x: this.points[i][0]*this.radius-this.radius/2, y: this.points[i][1]*this.radius-this.radius/2,
                radius: this.radius/2-20,
            });
        }
    }
}