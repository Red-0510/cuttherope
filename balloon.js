class Balloon{
    constructor(x,y,bodyB,offsetB,length){
        this.x=x;
        this.y=y;
        this.length=length;
        this.bodyB=bodyB;
        this.offsetB=offsetB;
        this.mass=0.01;
        let options={
            isStatic:false,
            friction:0,
            frictionAir:0,
            collisionFilter:{group:-1},
            render:{
                sprite:{
                    texture:'./images/balloon.png'
                }
            }
        }
        this.balloon=Bodies.circle(x,y,32,options);
        //console.log('balloon',this.offsetB);
        //console.log('bodyB',this.bodyB.position,pie.position);
        this.balloon_rope=new Rope(this.balloon,this.bodyB,{x:0,y:25},this.offsetB,this.length);
        World.add(world,[this.balloon]);
        //Engine.update(engine,1/24*1000);
    }
    apply_force(){
        Body.setVelocity(this.balloon,{x:0,y:-6.5});
        //Body.applyForce(this.balloon,{x:0,y:0},{x:-world.gravity.x*world.gravity.scale*this.mass,y:-world.gravity.y*world.gravity.scale*this.mass-0.1})
    }
}