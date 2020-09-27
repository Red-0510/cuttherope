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
    Body=Matter.Body,
    Events=Matter.Events;
    //(123,151,127)
//sprites=['images/eating/eating1.png','images/eating/eating2.png','images/eating/eating3.png','images/eating/eating4.png','images/eating/eating3.png','images/eating/eating2.png']
function create_background(){
    let back=Bodies.rectangle(500,500,600,800,{isStatic:true,collisionFilter:{group:-1},inertia:Infinity,render:{sprite:{texture:'./images/back.png'},strokeStyle:'#2'}}),
        wall1=Bodies.rectangle(150,500,100,800,{isStatic:true,inertia:Infinity,render:{opacity:0}}),
        wall2=Bodies.rectangle(850,500,100,800,{isStatic:true,inertia:Infinity,render:{opacity:0}}),
        wall3=Bodies.rectangle(500,50,800,100,{isStatic:true,inertia:Infinity,render:{opacity:0}}),
        wall4=Bodies.rectangle(500,950,800,100,{isStatic:true,inertia:Infinity,render:{opacity:0}});
        World.add(world,[back,wall1,wall2,wall4]);
}
function update(){
    for (i=0;i<balloons.length;i++){
        balloons[i].apply_force();
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
function clicked_down(){
    mouseclick=true;
}
function clicked_up(){
    mouseclick=false;
}
function check_cut(){
    if (mouseclick){
        for (i=0;i<ropes.length;i++){
            //console.log('this',i,ropes[i])
            for (j=0;j<ropes[i].rope[0].length;j++){
                if (Bounds.contains(ropes[i].rope[0][j].bounds,mouse.position)){
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
                if (Bounds.contains(balloons[i].balloon_rope.rope[0][j].bounds,mouse.position)){
                    balloons[i].balloon_rope.cut_rope();
                    balloons.splice(i,1);
                    break;
                }
            }
        }
    }
}
let engine=Engine.create({positionIterations:100,constraintsIterations:100,timing:{timescale:0.01}}),
    world=engine.world,
    render=Render.create({
        element:document.body,
        engine:engine,
        options:{
            width:1000,
            height:1000,
            pixelRatio:0.666,
            wireframes:false,
            showAngleIndicator:false,
        },
    }),
    runner=Runner.create();
//Engine.run(engine);
Render.run(render);
Runner.start(runner,engine);
create_background();
let pie=Bodies.circle(500,700,24,{collisionFilter:{group:-1},frictionAir:0,render:{sprite:{texture:'./images/candy.png'}}}),
    ropes=[],
    balloons=[],
    stars=[],
    omnom=new Green(700,800),
    mouse=Mouse.create(render.canvas),
    mouseconstraint=MouseConstraint.create(engine,{
        mouse:mouse,
        }),
    mouseclick=false,
    omnom_eating=false,
    pie_eat=false;
ropes.push(new Rope(null,pie,{x:200,y:500},null,4))
ropes.push(new Rope(null,pie,{x:500,y:500},null,12));
Body.setDensity(pie,0.009);
stars.push(new Star(750,200));
stars.push(new Star(500,650));
stars.push(new Star(500,700));
//balloons.push(new Balloon(400,500,pie,null,5));
//balloons.push(new Balloon(600,500,pie,null,13));
World.add(world,[pie]);
//pixelDensity();
World.add(world,[
    Bodies.rectangle(400,400,300,20,{isStatic:true,inertia:Infinity,angle:Math.PI/6}),
    //Bodies.rectangle(600,400,200,20,{isStatic:true,inertia:Infinity,angle:-Math.PI/6}),
]);
Events.on(render,'beforeRender',update);
Events.on(mouseconstraint,'mousedown',clicked_down);
Events.on(mouseconstraint,'mouseup',clicked_up);
Events.on(mouseconstraint,'mousemove',check_cut);


