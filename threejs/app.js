import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
let OrbitControls = ThreeOrbitControls(THREE);
//THREE.OrbitControls = OrbitControls;

class Submodule {
  constructor(el){
    this.el = el;

    this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
    this.camera.position.z = 2;

    this.controls = new OrbitControls(this.camera, this.el);
    this.controls.minDistance = 2;
    this.controls.maxDistance = 5;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;

    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );

    this.material = new THREE.MeshStandardMaterial( {
      color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
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

class App {
  constructor() {
    this.submodule = new Submodule(document.getElementById( 'room' ));
    this.submodule2 = new Submodule(document.getElementById( 'texture' ));
    this.submodules = [this.submodule, this.submodule2];

    this.canvas = document.getElementById( 'canvas' );

    this._setup();
    this._tick();
  }

  _setup() {
    this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, antialias: true } );
    this.renderer.setClearColor( 0xffffff, 1 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
  }

  _update() {
    this._updateSize();
    this.submodules.forEach((submodule) => submodule.update());
  }

  _render() {
    this.renderer.setClearColor( 0xffffff );
    this.renderer.setScissorTest( false );
    this.renderer.clear();

    this.renderer.setClearColor( 0xe0e0e0 );
    this.renderer.setScissorTest( true );

    this.submodules.forEach((submodule) => {
      this._renderModule(submodule.el, submodule.scene, submodule.camera);
    });
  }

  _renderModule(el, scene, camera){
    // get its position relative to the page's viewport
    let rect = el.getBoundingClientRect();

    // set the viewport
    var width  = rect.right - rect.left;
    var height = rect.bottom - rect.top;
    var left   = rect.left;
    var top    = rect.top;

    this.renderer.setViewport( left, top, width, height );
    this.renderer.setScissor( left, top, width, height );

    //camera.aspect = width / height; // not changing in this example
    //camera.updateProjectionMatrix();

    //scene.userData.controls.update();

    this.renderer.render(scene, camera);
  }

  _tick() {
    this._update();
    this._render();
    requestAnimationFrame(() => this._tick());
  }

  _updateSize() {
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;

    if ( this.canvas.width !== width || this.canvas.height != height ) {
      this.renderer.setSize( width, height, false );
    }
  }
}



window.onload = () => {
  window.app = new App();
};

window.three = THREE;
