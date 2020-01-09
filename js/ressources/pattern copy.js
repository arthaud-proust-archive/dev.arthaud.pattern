


class Pattern {
    constructor(first, size, hard, random, taken) {
        this.first = first;
        this.size = size;
        this.hard = hard;
        this.random = random;
        this.pattern = [];
        this.taken = taken;
        this.map = [1,2,3,4,5,6,7,8,9];
        this.coords= {
            1: [2,5,4],
            2: [3,6,5,4,1],
            3: [6,5,2],
            4: [1,2,5,8,7],
            5: [1,2,3,6,9,8,7,4],
            6: [9,8,5,2,3],
            7: [4,5,8],
            8: [7,4,5,6,9],
            9: [8,5,6]
        };

        for (let i=0; i<size; i++){
            this.addPoint(i);
        }
        return({id: this.pattern.join(''), pattern: this.pattern});
        
    }
    remove(item) {
        let index = this.map.indexOf(item);
        if (index !== -1) this.map.splice(index, 1);
    }
    getNextPoint(pattern) {
        // tableau contenant tout les patterns semblables à celui en cours
        let ressemblant = this.taken.filter(element => element.includes(pattern));
        let sameLength = ressemblant.filter(element => element.length == pattern.length+1);
        console.log(sameLength);
        this.test='';

        if (this.hard) {
            

            // on check si les patterns de la même longueur sont tous fait 
            for(let i=1; i<10; i++) {
                console.log("base: "+ pattern+i);
                if ( !sameLength.includes(pattern+i) && this.map.includes(i) ) {
                    return(i); // si un n'est pas fait, on le fait
                }
            }
            let test;
            // s'il sont tous fait, on rajoute rajoute un point:
            for(let i=1; i<10; i++) {
                // on refait la même manip en récurrence
                test = this.getNextPoint(pattern+i);
                console.log("test: "+test);
                if (test!=undefined) {
                    return(test);
                }
            }
            return test

        }
        let previous = this.pattern[this.pattern.length - 1];


    }
    getRandomPoint() { // Récupérer un point au hasard dans ceux possibles

        // si hard -> n'importe quel point libre peut suivre 
        if (this.hard) {
            return(this.map[Math.floor(Math.random() * this.map.length)]);
        }
        let previous = this.pattern[this.pattern.length - 1];
        // sinon parmi les points encore dispo on prends les points voisins au point précédent
        let possible = this.map.filter(element => this.coords[previous].includes(element));
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
            console.log("Next Point " +point);
            
            if (point == undefined) { // si undefined -> il n'y a plus de points disponibles
                return;
            }
            // sinon on rend indisponible le point et on le mets dans le pattern
            this.remove(point);
            this.pattern.push(point);
        }
    }
}