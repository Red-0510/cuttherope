let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Query=Matter.Query,
    Constraint=Matter.Constraint;
sprites=['images/eating/eating1.png','images/eating/eating2.png','images/eating/eating3.png','images/eating/eating4.png','images/eating/eating3.png','images/eating/eating2.png']
function setup(){
    noCanvas();
    engine=Engine.create({positionIterations:50,constraintsIterations:50});
    world=engine.world;
    render=Render.create({
        element:document.body,
        engine:engine,
        options:{
            width:800,
            height:600,
            wireframes:false,
            showAngleIndicator:false,
        }
    });
    Engine.run(engine);
    Render.run(render);
    click=false;
    data={x:100,y:22,width:50,height:50};
    sqr=Bodies.circle(400,500,39,{
        collisionFilter:{
            group:-1
        },
        render:{
            sprite:{
                texture:sprites[0]
            }
        }
    });
    blit=false
    index=0
    pie=Bodies.circle(400,100,25,{collisionFilter:{group:-1},frictionAir:0,friction:0,mass:5,render:{sprite:{texture:'./images/candy.png'}}});
    back=Bodies.rectangle(400,300,800,600,{isStatic:true,collisionFilter:{group:-1},inertia:Infinity,render:{sprite:{texture:'./images/back.jpg'}}});
    World.add(world,[back]);
    ropes=[]
    ropes.push(new Rope(null,pie,{x:700,y:100},null,9));
    ropes.push(new Rope(null,pie,{x:200,y:0},null,9))
    eating=false;
    World.add(world,[sqr,pie,Bodies.rectangle(400,700,800,300,{isStatic:true,inertia:Infinity,collisionFilter:{group:-2},friction:0.01})]);
}
function draw(){
    if (blit){
        if (Math.floor(index)==sprites.length){
            index=0;
            blit=false;
        }
        sqr.render.sprite.texture=sprites[Math.floor(index)];
        index+=0.17;
    }
    if (eating){
        if (pie.render.opacity>0){
            pie.render.opacity-=0.1;
        }
        else{
            pie.render.opacity=0;
            for (i=0;i<ropes.length;i++){
                if (ropes[i]!==null){
                    for (j=0;j<ropes[i].rope[1].length;j++){
                        if (ropes[i].rope[1][j].bodyB==pie){
                            for (k in ropes[i].rope[0]){
                                World.remove(world,[ropes[i].pivot2,ropes[i].rope[0][k]]);
                            }
                            for (a in ropes[i].rope[1]){
                                World.remove(world,[ropes[i].rope[1][a]]);
                            }
                        }
                    }
                }
            }
            Engine.update(engine,1/24*1000);
            World.remove(world,[pie]);
            pie=null;
            //console.log(blit)
            eating=false;
        }
    }
    if (pie){
        if (Matter.Bounds.overlaps(pie.bounds,sqr.bounds)){
            blit=true;
            eating=true;
        }
    }
}
function mousePressed(){
    if (Matter.Bounds.contains(sqr.bounds,{x:mouseX,y:mouseY})){
        blit=true;
        return;
    }
}
function mouseDragged(){
    //console.log(mouseX,mouseY);
    for (i=0;i<ropes.length;i++){
        if (ropes[i]!==null){
            for (j=0;j<ropes[i].rope[0].length;j++){
                if (Matter.Bounds.contains(ropes[i].rope[0][j].bounds,{x:mouseX,y:mouseY})){
                    for (k in ropes[i].rope[0]){
                        World.remove(world,[ropes[i].pivot2,ropes[i].rope[0][k]]);
                    }
                    for (a in ropes[i].rope[1]){
                        World.remove(world,[ropes[i].rope[1][a]]);
                    }
                    ropes[i]=null;
                    Engine.update(engine,1/24*1000);
                    return false;
                }
            }
        }
    }
}