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
    Constraint=Matter.Constraint,
    Bounds=Matter.Bounds;
    //(123,151,127)
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
    //data={x:100,y:22,width:50,height:50};
    pie=Bodies.circle(260,0,25,{collisionFilter:{group:-1},frictionAir:0,friction:0,mass:5,render:{sprite:{texture:'./images/candy.png'}}});
    back=Bodies.rectangle(400,300,800,600,{isStatic:true,collisionFilter:{group:-1},inertia:Infinity,render:{sprite:{texture:'./images/back.jpg'}}});
    World.add(world,[back]);
    ropes=[]
    ropes.push(new Rope(null,pie,{x:700,y:100},null,9));
    ropes.push(new Rope(null,pie,{x:200,y:0},null,9))
    stars=[];
    stars.push(new Star(250,250));
    stars.push(new Star(100,450));
    stars.push(new Star(200,520));
    World.add(world,[pie,Bodies.rectangle(400,700,800,300,{isStatic:true,inertia:Infinity,collisionFilter:{group:-2},friction:0.01})]);
    omnom_eating=false;
    omnom=new Green(400,400);
}
function draw(){
    for (i=0;i<stars.length;i++){
        stars[i].next_frame();
    }
    if (pie!==null){
        if (Bounds.overlaps(pie.bounds,omnom.body.bounds)){
            omnom_eating=true;
            if (pie.render.opacity>0){
                pie.render.opacity-=0.2;
            }
            else{
                pie.render.opacity=0;
                World.remove(world,pie);
                console.log('Score:',3-stars.length);
                pie=null;
            }
        }
    }
    if (pie!==null && stars.length>0){
        for (i=0;i<stars.length;i++){
            if (Bounds.overlaps(pie.bounds,stars[i].star.bounds)){
                stars[i].hit();
                stars.splice(i,1);
                i--;
            }
        }
    }
    if (omnom_eating){
        omnom_eating=omnom.animate_eating();
    }
    else{
        omnom.body.render.sprite.texture=omnom.sprites[0];
    }
}
function mousePressed(){

}
function mouseDragged(){
    for (i=0;i<ropes.length;i++){
        //console.log('this',i,ropes[i])
        for (j=0;j<ropes[i].rope[0].length;j++){
            if (Bounds.contains(ropes[i].rope[0][j].bounds,{x:mouseX,y:mouseY})){
                //console.log('cut');
                ropes[i].cut_rope();
                ropes.splice(i,1);
                i--;
                break;
            }
        }
    }
    //console.log('false');
    return false;
    //console.log(mouseX,mouseY);
    // for (i=0;i<ropes.length;i++){
    //     if (ropes[i]!==null){
    //         for (j=0;j<ropes[i].rope[0].length;j++){
    //             if (Matter.Bounds.contains(ropes[i].rope[0][j].bounds,{x:mouseX,y:mouseY})){
    //                 for (k in ropes[i].rope[0]){
    //                     World.remove(world,[ropes[i].pivot2,ropes[i].rope[0][k]]);
    //                 }
    //                 for (a in ropes[i].rope[1]){
    //                     World.remove(world,[ropes[i].rope[1][a]]);
    //                 }
    //                 ropes[i]=null;
    //                 Engine.update(engine,1/24*1000);
    //                 return false;
    //             }
    //         }
    //     }
    // }
}