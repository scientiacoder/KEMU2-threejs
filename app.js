var scene, camera, renderer;

var car;
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


    var car_length = 447.3, car_width = 170.6;
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
    
    car = create_car(car_length, car_width, 150);
    change_position(car, -700, 500,100);
    scene.add(car);
    console_log_position("car",car);
                                             

    camera.position.z = 1000;

}

function render(){
    renderer.render(scene, camera);
}

function showkey(){
    var key = event.keyCode;
    //  if (key == 37) alert("left");
    //  if (key == 38) alert("up");
    //  if (key == 39) alert("right");
    //  if (key == 40) alert("down");
    if (key == 38){
        car.position.x += 1;
    }


 }

function animate(){
    render();
    requestAnimationFrame(animate);
}

function threeStart() {

    init();

    var controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    document.onkeydown=showkey;
    animate();
}