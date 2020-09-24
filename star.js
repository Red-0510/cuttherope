class Star{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.r=25;
        this.sprites=['./images/star.png','./images/star1.png','./images/star2.png','./images/star3.png','./images/star4.png','./images/star5.png'];
        this.frameindex=0;
        let options={
            isSensor:true,
            isStatic:true,
            render:{
                sprite:{
                    texture:this.sprites[0],
                }
            }
        }
        this.star=Bodies.circle(x,y,this.r,options);
        World.add(world,this.star);
    }
    next_frame(){
        this.frameindex+=0.2;
        if (this.frameindex>this.sprites.length-1){
            this.frameindex=0;
        }
        this.star.render.sprite.texture=this.sprites[Math.floor(this.frameindex)];
    }
    hit(){
        World.remove(world,this.star);
    }
}