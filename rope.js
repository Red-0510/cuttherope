class Rope{
    constructor(body1,body2,offset1,offset2,length){
        this.body1=body1 || null;
        this.body2=body2 || null;
        this.offset1=offset1 || {x:0,y:0};
        this.offset2=offset2 || {x:0,y:0};
        this.length=length;
        this.angularStiffness=0;
        this.stiffness=1;
        this.rope=[[],[]];
        let x,y;
        if (this.body1!==null){
            x=this.body1.position.x;
            y=this.body1.position.y;
        }
        else {
            x=this.offset1.x;
            y=this.offset1.y;
        }
        for (let i=0;i<=this.length;i++){
            let cir=Bodies.circle(x,y+27*i,10,{friction:0,mass:0,isSensor:true,frictionAir:0,render:{sprite:{texture:'./images/chain.png'}}});
            this.rope[0].push(cir);
            World.add(world,cir);
        }
        for (let i=0;i<this.length;i++){
            let cons=Constraint.create({
                bodyA:this.rope[0][i],
                pointA:{x:0,y:10},
                bodyB:this.rope[0][i+1],
                pointB:{x:0,y:-10},
                stiffness:1,
                damping:0,
                frictionAir:0,
                friction:0,
                length:5,
                angularStiffness:0,
                render:{
                    anchors:false,
                    strokeStyle:'#7b979d',
                    lineWidth:5

                }
            });
            this.rope[1].push(cons);
            World.add(world,cons);
        }
        // for (let i=0;i<this.length-1;i++){
        //     let cons1=Constraint.create({
        //         bodyA:this.rope[0][i],
        //         bodyB:this.rope[0][i+1],
        //         pointA:{x:-10,y:0},
        //         pointB:{x:10,y:0},
        //         stiffness:0.7,
        //         angularStiffness:0,
        //         damping:0,
        //         frictionAir:0,
        //         friction:0,
        //         render:{
        //             visible:false
        //         }
        //     });
        //     this.rope[1].push(cons1);
        //     World.add(world,cons1);
        // }
        //console.log(this.rope[1].length);
        this.pivot1=Constraint.create({
            bodyA:this.rope[0][0],
            bodyB:this.body1,
            pointB:this.offset1,
            stiffness:1,
            angularStiffness:0,
            friction:0,
            length:0
        });
        Engine.update(engine,1/24*1000);
        //console.log(this.offset2,this.body2);
        //console.log('pie',pie.position);
        this.pivot2=Constraint.create({
            bodyA:this.rope[0][this.rope[0].length-1],
            bodyB:this.body2,
            pointB:this.offset2,
            stiffness:1,
            angularStiffness:0,
            friction:0,
            length:0,
            render:{
                strokeStyle:'#000000'
            }
        });
        //this.rope[1].push(this.pivot1,this.pivot2);
        World.add(world,[this.pivot1,this.pivot2]);
    }
    cut_rope(){
        for (let i=0;i<this.rope[0].length;i++){
            World.remove(world,[this.rope[0][i]]);
        }
        for (let j=0;j<this.rope[1].length;j++){
            World.remove(world,[this.rope[1][j]]);
        }
        World.remove(world,[this.pivot1,this.pivot2]);
    }
}

