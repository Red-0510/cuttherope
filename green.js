class Green{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.sprites=['./images/eating/eating1.png','./images/eating/eating2.png','./images/eating/eating3.png','./images/eating/eating4.png','./images/eating/eating3.png','./images/eating/eating2.png']
        let options={
            chamfer:{radius:40},
            collisionFilter:{group:-1},
            friction:0,
            frictionAir:0,
            mass:10,
            render:{
                sprite:{
                    texture:this.sprites[0]
                }
            }
        }
        this.body=Bodies.rectangle(x,y,100,100,options);
        World.add(world,this.body);
        this.frameindex=0;
    }
    animate_eating(){
        this.frameindex+=0.2;
        this.body.render.sprite.texture=this.sprites[Math.floor(this.frameindex)];
        if (this.frameindex>this.sprites.length-1){
            this.frameindex=0;
            return false;
        }
        return true;
    }
}