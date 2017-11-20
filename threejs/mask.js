import * as THREE from 'three';

export default class Mask {
  constructor(el){

    // const { scene, camera, renderer, events, toggleVR, controllers, vrEffect } = VRViewer({THREE});

    this.el = el;

    this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
    this.camera.position.z = 2;

    // this.controls = new OrbitControls(this.camera, this.el);
    // this.controls.minDistance = 2;
    // this.controls.maxDistance = 5;
    // this.controls.enablePan = false;
    // this.controls.enableZoom = false;


    var spriteMap = new THREE.TextureLoader().load( "../static_assets/barmask.jpg" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    this.sprite = new THREE.Sprite( spriteMaterial );



    // this.geometry = new THREE.PlaneGeometry( 2, 1 );
    //
    // this.material = new THREE.MeshLambartMaterial( {
    //   //color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
    //   color: new THREE.Color(1,1,1),
    //   roughness: 0.5,
    //   metalness: 0,
    //   flatShading: true
    // });

    this.scene = new THREE.Scene();
    this.scene.add(this.sprite);
    // this.scene.add( new THREE.Mesh( this.geometry, this.material ) );
    // this.scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
    //
    // var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    // light.position.set( 1, 1, 1 );
    // this.scene.add( light );

    // this.rotSpeed = new THREE.Vector3(Math.random()*0.002, Math.random()*0.003, Math.random()*0.005);

  }
}
