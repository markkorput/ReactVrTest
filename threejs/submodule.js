import * as THREE from 'three';

export default class Submodule {
  constructor(el){
    this.el = el;

    this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
    this.camera.position.z = 2;

    // this.controls = new OrbitControls(this.camera, this.el);
    // this.controls.minDistance = 2;
    // this.controls.maxDistance = 5;
    // this.controls.enablePan = false;
    // this.controls.enableZoom = false;

    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );

    this.material = new THREE.MeshStandardMaterial( {
      //color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
      color: new THREE.Color(1,1,1),
      roughness: 0.5,
      metalness: 0,
      flatShading: true
    });

    this.scene = new THREE.Scene();
    this.scene.add( new THREE.Mesh( this.geometry, this.material ) );
    this.scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );

    var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 1, 1, 1 );
    this.scene.add( light );

    this.rotSpeed = new THREE.Vector3(Math.random()*0.002, Math.random()*0.003, Math.random()*0.005);
  }

  update(){
    // this.controls.update();
    this.scene.children[0].rotation.y += this.rotSpeed.y;
    this.scene.children[0].rotation.x += this.rotSpeed.x;
    this.scene.children[0].rotation.z += this.rotSpeed.z;
  }
}
