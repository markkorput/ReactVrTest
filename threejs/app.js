import Submodule from './submodule';
import LayerMesh from './LayerMesh';
import * as THREE from 'three';
window.THREE = THREE;
import FirstPersonControls from './fpcontrols'


class App {
  constructor() {
    this.canvas = document.getElementById( 'canvas' );

    //this.room = new Room(this.canvas, this.renderTarget.texture); // document.getElementById( 'room' ), this.renderTarget.texture);
    var tex1 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room.jpg' );
    var tex2 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room-mask1.jpg' );
    var tex3 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room-mask2.jpg' );
    this.layerMesh = new LayerMesh(
      tex1,
      [
        {'tex': tex1, 'mask': tex2, 'color': new THREE.Color(1.0,0,1.0)},
        {'tex': tex1, 'mask': tex3, 'color': new THREE.Color(1.0,1.0,0.0)}
      ]);


    var renderWidth = window.innerWidth;
    var renderHeight = window.innerHeight;

    this.renderTarget = new THREE.WebGLRenderTarget( 1024, 512, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );


    this.scene = new THREE.Scene();
    this.scene.add(this.layerMesh.mesh);


    // this.submodule = new Submodule(document.getElementById( 'texture' ));
    // this.mask = new Mask(document.getElementById( 'mask' ));

    // this.submodules = [this.room, this.submodule, this.mask];

    this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, antialias: true } );
    this.renderer.context.disable(this.renderer.context.DEPTH_TEST); // <-- solved flickering because of material conflicts

    let rect = this.canvas.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera( 75, (rect.right-rect.left) / (rect.bottom-rect.top), 1, 1100 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );

    window.addEventListener( 'resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight, false );
    }, false);

    this.controls = new FirstPersonControls(this.camera, this.canvas);
    this.controls.lookSpeed = 0.2;
    this.controls.movementSpeed = 20;
    this.controls.noFly = true;
    this.controls.lookVertical = true;
    this.controls.constrainVertical = true;
    this.controls.verticalMin = 0.0;
    this.controls.verticalMax = 3.0;
    this.controls.lon = -150;
    this.controls.lat = 120;

    this.clock = new THREE.Clock();
    this._tick();
  }

  _tick() {
    this._update();
    this._render();
    requestAnimationFrame(() => this._tick());
  }

  _update() {
    var delta = this.clock.getDelta();
    this.controls.update(delta);

    // this.submodules.forEach((submodule) => submodule.update());
  }

  _render() {
    this.renderer.setClearColor( 0x777777 );
    this.renderer.setScissorTest( false );
    this.renderer.clear();

    this.renderer.render(this.scene, this.camera);
  }

  _renderTexture() {
    this.renderer.setClearColor( 0x000000 );
    // this.renderer.clear();
    this.renderer.setViewport( 0, 0, this.renderTarget.width, this.renderTarget.height );
    this.renderer.render(this.submodule.scene, this.submodule.camera, this.renderTarget, true );
  }
}



window.onload = () => {
  window.app = new App();
};

window.three = THREE;
