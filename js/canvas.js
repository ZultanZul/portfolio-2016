window.addEventListener('load', init, false);

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;

function createScene() {

	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	scene = new THREE.Scene();

	//scene.fog = new THREE.Fog (0xffffff, 75, 500); 

	aspectRatio = WIDTH / HEIGHT;
	fieldOfView =50;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);
	camera.position.x = 0;
	camera.rotation.x = -Math.PI/4;
	camera.position.z = 100;
	camera.position.y = 100;
	renderer = new THREE.WebGLRenderer({ 
		alpha: true, 
		antialias: true 
	});
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	container = document.getElementById('canvas');
	container.appendChild(renderer.domElement);
	// window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	scene.add(hemisphereLight);  

	shadowLight = new THREE.DirectionalLight(0xffffff, 1);

	shadowLight.position.set(0,100,350);
	shadowLight.castShadow = true;
	shadowLight.shadow.camera.left = -650;
	shadowLight.shadow.camera.right = 650;
	shadowLight.shadow.camera.top = 650;
	shadowLight.shadow.camera.bottom = -650;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(shadowLight);
}

var Sea = function() {
	
	this.mesh = new THREE.Object3D();
	
	var geomWaves = new THREE.PlaneGeometry( 1000, 1000, 200,200 );

	geomWaves.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	geomWaves.mergeVertices();
	var l = geomWaves.vertices.length;

	this.waves = [];
		for (var i=0; i<l; i++){
		var v = geomWaves.vertices[i];
		this.waves.push({y:v.y,
		 x:v.x,
		 z:v.z,
		ang:Math.random()*Math.PI*2,
		amp:1.2,
		speed:0.016 + Math.random()*0.024
		});
	};

	var matWaves = new THREE.MeshPhongMaterial( {
		//color:0xffffff,
		//shading:THREE.FlatShading,
		wireframe:true,
	}
);

this.mesh = new THREE.Mesh(geomWaves, matWaves);
this.mesh.castShadow = false;
this.mesh.receiveShadow = true;


Sea.prototype.moveWaves = function (){

	var verts = this.mesh.geometry.vertices;
	var l = verts.length;
	
	for (var i=0; i<l; i++){
		var v = verts[i];
		var vprops = this.waves[i];

		v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
		v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
		vprops.ang += vprops.speed;
	}
	this.mesh.geometry.verticesNeedUpdate=true;
	}
};

var isoGroup = function() {
	this.mesh = new THREE.Object3D();

	geometry = new THREE.IcosahedronBufferGeometry(30,0);
	material = new THREE.MeshPhongMaterial({ color: 0x000000,shading:THREE.FlatShading,});
  
	materialWire = new THREE.MeshPhongMaterial({ color: 0x000000,
		shading:THREE.FlatShading,
		polygonOffset: true,
	    polygonOffsetFactor: 1, // positive value pushes polygon further away
	    polygonOffsetUnits: 1});
	iso1 = new THREE.Mesh( geometry, materialWire );
	iso2 = new THREE.Mesh( geometry, material );
	iso3 = new THREE.Mesh( geometry, material );

	var geoWire = new THREE.EdgesGeometry( iso1.geometry ); // or WireframeGeometry
	var matWire = new THREE.LineBasicMaterial( { color: 0xf1f1f1, linewidth: 2 } );
	wireframe = new THREE.LineSegments( geoWire, matWire );

	this.mesh.add( wireframe );
  wireframe.scale.set(1.2,1.2,1.2);
  
	iso1.position.set(0,30,-10);
	wireframe.position.set(0,30,-10);
	iso2.position.set(0,30,-10);
	iso3.position.set(0,30,-10);
	this.mesh.add(iso1,iso2,iso3);
this.mesh.castShadow = true;
this.mesh.receiveShadow = true;
}

var sea;
var iso;

function createIso () {
	iso = new isoGroup();
	scene.add(iso.mesh);	
}

function createSea(){ 
	sea = new Sea();
	scene.add(sea.mesh);
}

function init() {
	createScene();
	createLights();
	createSea();
	//createIso();
	loop();
}

function loop(){

	// wireframe.scale.x = Math.sin(Date.now() * 0.0005) * 1.2;
	// wireframe.scale.y = Math.sin(Date.now() * 0.0005) * 1
	wireframe.rotation.y -= 0.005;
 	wireframe.rotation.x -= 0.005;
	iso1.rotation.x += 0.035;
	iso1.rotation.y -= 0.005;
  
	iso2.rotation.y += 0.015;
	iso2.rotation.z -= 0.005;
	iso3.rotation.z -= 0.025;
	iso3.rotation.x += 0.005;
	sea.moveWaves();

	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}
