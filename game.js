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
    Bounds=Matter.Bounds,
    Body=Matter.Body;
    //(123,151,127)
sprites=['images/eating/eating1.png','images/eating/eating2.png','images/eating/eating3.png','images/eating/eating4.png','images/eating/eating3.png','images/eating/eating2.png']
function create_background(){
    let back=Bodies.rectangle(500,500,600,800,{isStatic:true,collisionFilter:{group:-1},inertia:Infinity,render:{sprite:{texture:'./images/back.png'},strokeStyle:'#2'}}),
        wall1=Bodies.rectangle(150,500,100,800,{isStatic:true,inertia:Infinity,render:{opacity:0}}),
        wall2=Bodies.rectangle(850,500,100,800,{isStatic:true,inertia:Infinity,render:{opacity:0}}),
        wall3=Bodies.rectangle(500,50,800,100,{isStatic:true,inertia:Infinity,render:{opacity:0}}),
        wall4=Bodies.rectangle(500,950,800,100,{isStatic:true,inertia:Infinity,render:{opacity:0}});
        World.add(world,[back,wall1,wall2,wall3,wall4]);
}
function setup(){
    noCanvas();
    // let canvas=document.getElementById('canva');
    engine=Engine.create({positionIterations:100,constraintsIterations:100});
    world=engine.world;
    render=Render.create({
        element:document.body,
        engine:engine,
        // canvas:canvas,
        options:{
            width:1000,
            height:1000,
            wireframes:false,
            showAngleIndicator:false,
        }
    });
    Engine.run(engine);
    Render.run(render);
    //data={x:100,y:22,width:50,height:50};
    create_background();
    pie=Bodies.circle(500,870,24,{collisionFilter:{group:-1},frictionAir:0,friction:0,render:{sprite:{texture:'./images/candy.png'}}});
    Body.setDensity(pie,0.017);
    ropes=[];
    balloons=[];
    balloons.push(new Balloon(250,650,pie,null,13));
    //balloons.push(new Balloon(750,650,pie,null,13));
    ropes.push(new Rope(null,pie,{x:700,y:600},null,20));
    //ropes.push(new Rope(null,pie,{x:400,y:0},null,25))
    stars=[];
    stars.push(new Star(750,200));
    stars.push(new Star(500,650));
    stars.push(new Star(500,700));
    World.add(world,[pie]);
    omnom_eating=false;
    omnom=new Green(700,800);
    pie_eat=false;
    pixelDensity();
    World.add(world,[
        Bodies.rectangle(400,400,200,20,{isStatic:true,inertia:Infinity,angle:PI/6}),
        Bodies.rectangle(600,400,200,20,{isStatic:true,inertia:Infinity,angle:-PI/6}),
    ]);
    Engine.update(engine);
}
function draw(){
    //console.log('here',balloons[0].balloon_rope.pivot2.bodyB.render);
    for (i=0;i<balloons.length;i++){
        //console.log(balloons[0].balloon.force);
        balloons[i].apply_force();
        //console.log(balloons[0].balloon.force);
    }
    for (i=0;i<stars.length;i++){
        stars[i].next_frame();
    }
    if (pie!==null){
        if (Bounds.overlaps(pie.bounds,omnom.body.bounds)){
            omnom_eating=true;
            pie_eat=true;
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
    if (pie_eat && pie!==null){
        if (pie.render.opacity>0){
            pie.render.opacity-=0.2;
        }
        else{
            for (i=0;i<ropes.length;i++){
                if (ropes[i].pivot1.bodyB==pie || ropes[i].pivot2.bodyB==pie){
                    ropes[i].cut_rope();
                    ropes.splice(i,1);
                    i--;
                }
            }
            for (i=0;i<balloons.length;i++){
                if (balloons[i].balloon_rope.pivot1.bodyB==pie || balloons[i].balloon_rope.pivot2.bodyB==pie){
                    balloons[i].balloon_rope.cut_rope();
                    balloons.splice(i,1);
                    i--;
                }
            }
            pie.render.opacity=0;
            World.remove(world,pie);
            console.log('Score:',3-stars.length);
            pie=null;
        }
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
                break;
            }
        }
    }
    for (i=0;i<balloons.length;i++){
        //console.log('this',i,ropes[i])
        for (j=0;j<balloons[i].balloon_rope.rope[0].length;j++){
            if (Bounds.contains(balloons[i].balloon_rope.rope[0][j].bounds,{x:mouseX,y:mouseY})){
                //console.log('cut');
                balloons[i].balloon_rope.cut_rope();
                balloons.splice(i,1);
                break
            }
        }
    }
    return false;
    //console.log('false');
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
