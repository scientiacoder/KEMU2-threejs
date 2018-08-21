var scene, camera, renderer;

var car, steering_wheel, steering_wheel_rotation = 0, tyre_rotation = 0;

var car_length = 450.1, car_width = 170.6, car_height = 146.9 - 30.03 * 2;

var tyre_center, rotation_center, tyre_center_rotation = 0;

var rotationx, rotationy , rotationz, rotation_circum, rotation_angle;

var center_tyre_distance;

var tyre_front_left, tyre_front_right, tyre_back_left, tyre_back_right;

var speed = 0;

var speedX, speedY;

var tyre_vertical_distance = 0;

var rotation_radius = 0;

var loader = new THREE.TextureLoader();

var count = 0;

function create_line(line_length, line_width=50, line_height=2){
    let geometry = new THREE.BoxGeometry(line_length, line_width, line_height)
    let material = new THREE.MeshBasicMaterial( { color: 0xffd700} );
    let line = new THREE.Mesh(geometry, material);
    return line;
}

function create_car(car_length, car_width, car_height){
    let geometry = new THREE.BoxGeometry(car_length, car_width, car_height)
    let material = new THREE.MeshBasicMaterial( { color: 0xff4500} );
    let car = new THREE.Mesh(geometry, material);
    return car;
}

function change_position(cube, x, y ,z){
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
}

function create_line_with_position(line_length, line_width, line_height, x, y ,z){
    var line = create_line(line_length, line_width, line_height);
    change_position(line, x, y, z);
    return line;
}

function string_to_name(string){
    let _name = 'var new_name=' + string;
    eval(_name);
    return _name;
}

function get_rotation_center(positionx, positiony, positionz, rotation_radius, present_rotation_angle){
    let z = positionz;
    let x = positionx - rotation_radius * Math.sin(present_rotation_angle);
    let y = positiony - rotation_radius * Math.cos(present_rotation_angle);
    let res = {
        "x":x,
        "y":y,
        "z":z
    }
    console.log("res:", res);
    return res;
}

function console_log_position(obj_string, obj){
    
    console.log( obj_string + ":" + "{ x:" + obj.position.x.toFixed(2)
                    + ", y:" + obj.position.y.toFixed(2)
                    + ", z:" + obj.position.z.toFixed(2)
                    + " }");
}

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xffffff, 1.0);

    document.getElementById("canvas-frame").appendChild( renderer.domElement );

    var garage_width = car_width + 60, garage_length = car_length + 70;
    var control_distance = car_length * 1.5, lane_width = car_length * 1.5;

    var road_length = garage_length + 2 * control_distance + 2 * 200;
    var road_width = lane_width + garage_length + 2 * 100;

    console.log("rl:" + road_length, "rw:" + road_width);

    var geometry = new THREE.BoxGeometry(100,100,100);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    var cube = new THREE.Mesh(geometry, material);
    cube.position.z = 500;
    scene.add(cube);

    var geometry = new THREE.BoxGeometry( road_length + 400, road_width + 200, 200 );
    var material = new THREE.MeshBasicMaterial( { color: 0x4f4f4f } );
    var cube = new THREE.Mesh( geometry, material );

    scene.add( cube );

    var line_width = 50, line_height = 2;
    var topline_length = road_length;
    var top_line = create_line_with_position(topline_length, line_width, line_height, 0, 2 * 0.5 * line_width + lane_width, 100);

    console_log_position("top_line", top_line);
    scene.add(top_line);

    var middle_line_left_length = (topline_length - garage_width) / 2
    var middle_line_left = create_line_with_position(middle_line_left_length, line_width, line_height,
                                                    -(garage_width + middle_line_left_length) * 0.5, 0, 100);
    scene.add(middle_line_left);
    console.log("middleline left position:" + middle_line_left.position)
    console_log_position("middle_line_left" ,middle_line_left);  

    var left_vertical_middle_line = create_line(garage_length, line_width, line_height);
    left_vertical_middle_line.rotation.z = 90 * Math.PI / 180;
    change_position(left_vertical_middle_line, - (garage_width * 0.5 + 25), - (garage_length * 0.5), 100);


    console_log_position("left_vertical_middle_line", left_vertical_middle_line);
    scene.add(left_vertical_middle_line);

    var right_vertical_middle_line = create_line(garage_length, line_width, line_height);
    right_vertical_middle_line.rotation.z = 90 * Math.PI / 180;
    change_position(right_vertical_middle_line, garage_width * 0.5 + 25, - (garage_length * 0.5), 100);
    console_log_position("right_vertical_middle_line", right_vertical_middle_line);
    scene.add(right_vertical_middle_line);

    var bottom_line = create_line(garage_width, line_width, line_height);
    change_position(bottom_line, 0, -(garage_length + 25), 100);
    console_log_position("bottom_line",bottom_line);
    scene.add(bottom_line);

    var middle_line_right_length = middle_line_left_length;
    var middle_line_right = create_line_with_position(middle_line_right_length, line_width, line_height,
                                                        (garage_width + middle_line_right_length) * 0.5, 
                                                        0, 100);
    scene.add(middle_line_right);
    console_log_position("middle_line_right", middle_line_right); 
    
    car = create_car(car_length, car_width, car_height);

    var car_start_postionx = -700, car_start_postiony = 500, car_start_postionz = 100 + 30.03 + car_height * 0.5;
    change_position(car, car_start_postionx, car_start_postiony, car_start_postionz);


    var steering_wheel_geometry = new THREE.CylinderGeometry( 145, 145, 30, 20);
    // var steering_wheel_material = new THREE.MeshBasicMaterial( { color: 0x87ceff } );
    var steering_wheel_material = new THREE.MeshBasicMaterial(     
                    { map: loader.load('images/steering_wheel.png') 
                        } );

    steering_wheel = new THREE.Mesh( steering_wheel_geometry, steering_wheel_material );
    change_position(steering_wheel, 500, -220, 180);
    steering_wheel.rotation.x = 90 * Math.PI / 180;
    console_log_position("steering_wheel", steering_wheel);
    scene.add( steering_wheel );

    var wheelbase = 260.4; // back wheel 0.214 front wheel 0.186
    var tyre_radius = 30.03, tyre_width = 17.5, tyre_diameter = 2 * tyre_radius;
    var tyre_geometry = new THREE.CylinderGeometry(tyre_radius, tyre_radius, tyre_width, 20);
    var tyre_material = new THREE.MeshBasicMaterial(     
        { map: loader.load('images/tyre.png') 
            } );
    tyre_front_left = new THREE.Mesh(tyre_geometry, tyre_material);
    tyre_front_right = new THREE.Mesh(tyre_geometry, tyre_material);
    tyre_back_left = new THREE.Mesh(tyre_geometry, tyre_material);
    tyre_back_right = new THREE.Mesh(tyre_geometry, tyre_material);
    car.add(tyre_front_left);
    car.add(tyre_front_right);
    car.add(tyre_back_left);
    car.add(tyre_back_right);
    // The reference frame of tyres is not the original point but the car.
    // change_position(tyre_front_left, car_start_postionx + car_length * (0.5 - 0.186), car_start_postiony + car_width * 0.5 - tyre_width * 0.5, 100);
    change_position(tyre_front_left, car_length * (0.5 - 0.186), car_width * 0.5 - tyre_width * 0.5, -car_height * 0.5);
    change_position(tyre_front_right, car_length * (0.5 - 0.186), -(car_width * 0.5 - tyre_width * 0.5), -car_height * 0.5);
    change_position(tyre_back_left, - car_length * (0.5 - 0.214), car_width * 0.5 - tyre_width * 0.5, -car_height * 0.5);
    change_position(tyre_back_right, - car_length * (0.5 - 0.214), -(car_width * 0.5 - tyre_width * 0.5), -car_height * 0.5);

    tyre_center = new THREE.Object3D();
    tyre_center.position.set(car_start_postionx, car_start_postiony, car_start_postionz);
    tyre_center.add(car);

    change_position(car, car_length * (0.5 - 0.214), 0 , 0)
    // car.position.set(car_length * (0.5 - 0.214), 0 , 0);
    scene.add(tyre_center);
    // scene.add(car);
    console_log_position("car",car);

    tyre_vertical_distance = Math.abs(tyre_front_left.position.x - tyre_back_left.position.x).toFixed(2);
    console.log("tyre vertical distance: " + tyre_vertical_distance);

    center_tyre_distance = car_width * 0.5 - tyre_width * 0.5;

    console.log("tyre vertices: ", tyre_back_left.geometry.vertices);
    console.log("car vertices: " , car.geometry.vertices);
    console.log("car matrix: ", car.matrix);
 

    
    camera.position.z = 1000;

}


var collision_mesh_list = [top_line, middle_line_left, left_vertical_middle_line, right_vertical_middle_line,
                            bottom_line, middle_line_right];

var detect_mesh_list = [car];

function get_car_position(){
    var car_position = {};
    // change_position(car, car_length * (0.5 - 0.214), 0 , 0)
    car_position.x = tyre_center.position.x + car_length * (0.5 - 0.214);
    car_position.y = tyre_center.position.y;
    car_position.z = tyre_center.position.z;
    return car_position;
}

function get_car_matrix(){
    var car_matrix;
    car_matrix = tyre_center.matrix.clone();
    car_matrix["elements"][14] = tyre_center.position.z;
    car_matrix["elements"][13] = tyre_center.position.y;
    car_matrix["elements"][12] = tyre_center.position.x + car_length * (0.5 - 0.214);
    
    return car_matrix;
}


function collision_detection(){

    var  origin_car_position = get_car_position;
    for (var vertex_index = 0; vertex_index < car.geometry.vertices.length; vertex_index ++){
        var local_vertex = car.geometry.vertices[vertex_index].clone();

        console.log("tyre center matrix: ",tyre_center.matrix);
        console.log("car matrix: ",get_car_matrix());
        
        var global_vertex = local_vertex.applyMatrix4(car.matrix);
        
        console.log("global vertex: ", global_vertex);
        var direction_vector = global_vertex.sub(car.position);
        console.log("car position: ", car.position);
        console.log("direction vector: ", direction_vector);
        var ray = new THREE.Raycaster(origin_car_position, direction_vector.clone().normalize());
    }
}






function render(){
    renderer.render(scene, camera);
}

function dealkey(){
    var key = event.keyCode;
    //  if (key == 37) alert("left");
    //  if (key == 38) alert("up");
    //  if (key == 39) alert("right");
    //  if (key == 40) alert("down");

    if (key == 37){
        if (steering_wheel_rotation > -540){
            steering_wheel.rotation.y += 12 * Math.PI / 180;
            steering_wheel_rotation -= 12;
            tyre_front_left.rotation.z += 1 * Math.PI / 180;
            tyre_front_right.rotation.z += 1 * Math.PI / 180;
            if (steering_wheel_rotation != 0){
                rotation_radius = tyre_vertical_distance / Math.sin(tyre_front_left.rotation.z);
                rotation_radius -= center_tyre_distance;
                res = get_rotation_center(tyre_center.position.x, tyre_center.position.y,
                                                                        tyre_center.position.z, rotation_radius, 
                                                                        tyre_center_rotation);
                rotationx = res["x"];
                rotationy = res["y"];
                rotationz = res["z"];
                rotation_circum = Math.PI * rotation_radius * rotation_radius;
                rotation_angle = (10000000 * speed / rotation_circum) * Math.PI / 180;
                console.log("rotation angle:", rotation_angle);

            }else{
                rotation_radius = 0;
            }
        }

        console.log("rotation:", steering_wheel_rotation);
        console.log("car rotation", car.rotation.z);
        console.log("tyre rotation", tyre_front_left.rotation.z);
        console.log("rotation radius: " + rotation_radius);
        console.log("car position: ", car.position);
        console.log("tyre center position: ", tyre_center.position);
        console.log("tyre back left:", tyre_back_left);
        console.log("tyre back right:", tyre_back_right.position);
    }

    if (key == 38){
        speed += 5;
        console.log("tyre center rotation:", tyre_center_rotation);
    }
    if (key == 39){
        if (steering_wheel_rotation < 540){
            steering_wheel.rotation.y -= 12 * Math.PI / 180;
            steering_wheel_rotation += 12;
            tyre_front_left.rotation.z -= 1 * Math.PI / 180;
            tyre_front_right.rotation.z -= 1 * Math.PI / 180;
            if (steering_wheel_rotation != 0){
                rotation_radius = tyre_vertical_distance / Math.sin(tyre_front_left.rotation.z);
                rotation_radius -= center_tyre_distance;
                res = get_rotation_center(tyre_center.position.x, tyre_center.position.y,
                                                                        tyre_center.position.z, rotation_radius, 
                                                                        tyre_center_rotation);
                rotationx = res["x"];
                rotationy = res["y"];
                rotationz = res["z"];
                rotation_circum = Math.PI * rotation_radius * rotation_radius;
                rotation_angle = (10000000 * speed / rotation_circum) * Math.PI / 180;
                console.log("rotation angle:", rotation_angle);
            }else{
                rotation_radius = 0;
            }
        }
        console.log("rotation radius: " + rotation_radius);
        console.log("rotation:", steering_wheel_rotation);
    }
    if (key == 40){
        speed -= 5;
    }



 }

function animate(){
    if (speed != 0 && rotation_radius == 0){
        if (speed > 0){
            speedX = speed * Math.cos(tyre_center_rotation);
            speedY = speed * Math.sin(tyre_center_rotation);
            tyre_center.position.x += speedX;
            tyre_center.position.y += speedY;
            
        }else if(speed < 0){
            speedX = speed * Math.cos(tyre_center_rotation);
            speedY = speed * Math.sin(tyre_center_rotation);
            tyre_center.position.x += speedX;
            tyre_center.position.y += speedY;
        }
    }else if(speed != 0 && rotation_radius != 0){
        if (steering_wheel_rotation < 0){
            tyre_center.rotation.z += rotation_angle;
            tyre_center_rotation += rotation_angle;
        }else if(steering_wheel_rotation > 0){
            tyre_center.rotation.z -= rotation_angle;
            tyre_center_rotation -= rotation_angle;
        }
        
        // if (tyre_center_rotation >= Math.PI || tyre_center_rotation <= -Math.PI ){
        //     tyre_center_rotation = 0;
        // }
    }
    // collision_detection();
    render();
    requestAnimationFrame(animate);
}

function threeStart() {

    init();

    var controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    document.onkeydown=dealkey;
    collision_detection();
    animate();
}