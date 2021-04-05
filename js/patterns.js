class Session {
    constructor() {
        console.log('%cSession created', "color: green; font-size: 2em");
        this.all = Object.entries(localStorage);
    }
    load(item) {
        let value = [];
        if (localStorage.getItem(item) !== null) {
            value = JSON.parse(localStorage.getItem(item));
            for (let i =0; i < value.length; i++) {
                new Canvas('#patterns', value[i]);
            }
        }
        console.log(`%cSession details (${value.length} patterns):`, "color: #aa2;");
        $(`#${item}Total`).text(`(${value.length} schémas au total)`);
        return(value);
    }
    save(item, value) {
        localStorage.setItem(item, JSON.stringify(value));
        console.log('%cSession saved', "color: green;");
    }
}


class Canvas {
    constructor(div, pattern) {

        this.div = div;
        this.pattern = pattern;
        this.height=300;
        this.radius = this.height/3;
        this.points={
            "1": [1,1],
            "2": [2,1],
            "3": [3,1],
            "4": [1,2],
            "5": [2,2],
            "6": [3,2],
            "7": [1,3],
            "8": [2,3],
            "9": [3,3],
        }

        this.create();
        this.drawBase();
        this.drawPattern();
    }
    create() {
        $(this.div).prepend(`
        <div class="pattern" id="${this.pattern}" style="width:${this.height}px;height:${this.height}px;">
            <canvas height="${this.height}" width="${this.height}">
            </canvas>
            <input type="button" class="delete" value="Supprimer" onclick="patterns.destroyPattern('${this.pattern}')">
        </div>
        `);

        this.canvas = $(`.pattern#${this.pattern} canvas`);
        
    }
    drawBase() {
        this.canvas.clearCanvas();
        for (let i =1; i<10; i++) {
            this.canvas.drawArc({
                fillStyle: '#555',
                x: this.points[i][0]*this.radius-this.radius/2, y: this.points[i][1]*this.radius-this.radius/2,
                radius: this.radius/2-20,
            });
        }
    }
    drawPattern() {
        let pattern = {
            strokeStyle: 'steelblue',
            strokeWidth: 5,
            rounded: true,
            endArrow: true,
            arrowRadius: 25,
            arrowAngle: 70,
            closed: false,
            shadowX: 1,
            shadowY: 2,
            shadowBlur: 10,
            shadowColor: '#222'
        };
        this.canvas.drawArc({
            fillStyle: 'steelblue',
            x: this.points[ this.pattern[0] ][0]*this.radius-this.radius/2, 
            y: this.points[ this.pattern[0] ][1]*this.radius-this.radius/2,
            radius: this.radius/3-20,
            start: 0, end: 2*Math.PI,
            ccw: true,
            inDegrees: false
        });
        this.canvas.drawArc({
            fillStyle: '#888',
            x: this.points[ this.pattern[this.pattern.length-1] ][0]*this.radius-this.radius/2, 
            y: this.points[ this.pattern[this.pattern.length-1] ][1]*this.radius-this.radius/2,
            radius: this.radius/3-20,
            start: 0, end: 2*Math.PI,
            ccw: true,
            inDegrees: false
        });
        for (let i = 0; i < this.pattern.length; i++) {
            pattern[`x${i+1}`]= this.points[ this.pattern[i] ][0]*this.radius-this.radius/2;
            pattern[`y${i+1}`]= this.points[ this.pattern[i] ][1]*this.radius-this.radius/2;
        }
        this.canvas.drawLine(pattern);
    }
}



class Pattern {
    constructor(first, size, hard, random, patterns) {
        this.first = first;
        this.size = size;
        this.hard = hard;
        this.random = random;
        this.pattern = [];
        this.patterns = patterns;
        this.map = [1,2,3,4,5,6,7,8,9];
        this.coords= {
            1: {
                near: [2,5,4],
                direct: {
                    3:2,
                    9:5,
                    7:4
                }
            },
            2: { 
                near: [3,6,5,4,1],
                direct: {
                    8:5
                }
            },
            3: {
                near: [6,5,2],
                direct: {
                    1:2,
                    7:5,
                    9:6
                }
            },
            4: {
                near: [1,2,5,8,7],
                direct: {
                    6:5
                }
            },
            5: {
                near: [1,2,3,6,9,8,7,4], 
                direct: {} 
            },
            6: {
                near: [9,8,5,2,3],
                direct: {
                    4:5
                }
            },
            7: {
                near:[4,5,8],
                direct: {
                    1:4,
                    3:5,
                    9:8
                }
            },
            8: {
                near: [7,4,5,6,9],
                direct: {
                    2:5
                }
            },
            9: {
                near: [8,5,6],
                direct: {
                    7:8,
                    1:5,
                    3:6
                }
            }
        };

        for (let i=0; i<size; i++){
            this.addPoint(i);
        }
        console.log(this.pattern.join(""));
        
    }
    get() {
        return(this.pattern.join(""));
    }
    remove(item) {
        let index = this.map.indexOf(item);
        if (index !== -1) this.map.splice(index, 1);
    }
    getRandomPoint() { // Récupérer un point au hasard dans ceux possibles
        let previous = this.pattern[this.pattern.length - 1];

        // si hard -> n'importe quel point libre peut suivre 
        if (this.hard) {
            let possible = this.map[Math.floor(Math.random() * this.map.length)];
            // si direct, on prend le point plus proche sur la meme ligne, si le point est libre
            let te = this.coords[previous].direct[possible];
            if ( te && this.map.includes(te)) { 
                possible = te;
            }
            return(possible);
        }
        // sinon parmi les points encore dispo on prends les points voisins au point précédent
        let possible = this.map.filter(element => this.coords[previous].near.includes(element));
        // on choisit un point au hasard dans ce tableau, et le retourne. Il peut ne pas y en avoir!
        return(possible[Math.floor(Math.random() * possible.length)]);
    }
    addPoint(i) { 
        if (i==0) {
            this.remove(this.first);
            this.pattern.push(this.first);
        } else {
            let point= undefined;
            if (this.random) { // récupère un point au hasard si random = true
                point = this.getRandomPoint();
            } else { // sinon récupère le point d'après en suivant une logique
                point = this.getNextPoint(this.pattern.join(''));
            }
            
            if (point == undefined) { // si undefined -> il n'y a plus de points disponibles
                return;
            }
            // sinon on rend indisponible le point et on le mets dans le pattern
            this.remove(point);
            this.pattern.push(point);
        }
    }
}




class Generator {
    constructor() {
        this.session = new Session();
        this.patterns = this.session.load("patterns");
    }
    generatePatterns(first, size, tries, hard, random) {
        console.log(`Try to generate ${tries} models with ${size} points`);
        console.log(`Random: ${random}   Hard combinaisons: ${hard}`);
        let nPatterns = this.patterns.length;

        for(let i=0; i<tries; i++) {
            let pattern = new Pattern(first,size,hard,random, this.patterns);            
            this.createPattern(pattern.get());
        }
        console.log(`${this.patterns.length - nPatterns} patterns generated`);
        $(`#patternsTotal`).text(`(${this.patterns.length} schémas au total)`);
        $('#patternsGenerated').text(`+${this.patterns.length - nPatterns}`);

    }
    createPattern(pattern) {
        if ( !this.patterns.includes(pattern) )  {
            this.patterns.push(pattern);

            new Canvas('#patterns', pattern);
            this.session.save('patterns', this.patterns);
        }
    }
    destroyPattern(pattern) {
        this.oldPatterns = this.patterns;
        this.oldPattern = pattern;
        this.patterns = this.patterns.filter(item => item !== pattern);
        this.session.save('patterns', this.patterns);
        $(`.pattern#${pattern}`).fadeOut();
        $("#undo").addClass("undo");
    }
    destroyAll() {
        this.oldPatterns = this.patterns;
        this.patterns = [];
        this.session.save('patterns', this.patterns);
        $(`.pattern`).fadeOut();
        $("#undo").addClass("undo");
    }
    undo() {
        this.patterns = this.oldPatterns;
        if (this.oldPattern !== undefined) {
            $(`.pattern#${this.oldPattern}`).fadeIn();
            this.oldPattern = undefined;
        } else {
            $(`.pattern`).fadeIn();
        }
        this.oldPatterns = undefined;
        this.session.save('patterns', this.patterns);
        $("#undo").removeClass("undo");
    }
}