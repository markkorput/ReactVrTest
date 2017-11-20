import Submodule from './submodule';
import LayerMesh from './LayerMesh';
import Layer from './Layer';
import * as THREE from 'three';
window.THREE = THREE;
import FirstPersonControls from './fpcontrols';

class App {
  constructor() {
    this.renderWidth = window.innerWidth;
    this.renderHeight = window.innerHeight;

    this.canvas = document.getElementById( 'canvas' );

    this.renderTarget = new THREE.WebGLRenderTarget( 4096, 2048, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat, alpha: true } );

    //this.room = new Room(this.canvas, this.renderTarget.texture); // document.getElementById( 'room' ), this.renderTarget.texture);
    var tex1 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room.jpg' );
    var tex2 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room-mask1.jpg' );
    var tex3 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room-mask2.jpg' );
    this.layerMesh = new LayerMesh(
      tex1,
      [
        {'tex': tex1, 'mask': tex3, 'color': new THREE.Color(1.0,0,1.0)},
        // {'tex': this.renderTarget.texture, 'mask': tex2},
      ]);


    this.layer1 = new Layer();

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
      this.renderWidth = window.innerWidth;
      this.renderHeight = window.innerHeight;

      camera.aspect = this.renderWidth / this.renderHeight;
      camera.updateProjectionMatrix();

      this.renderer.setSize( this.renderWidth, this.renderHeight, false );
    }, false);

    this.controls = new FirstPersonControls(this.camera, this.canvas);
    this.controls.lookSpeed = 0.4;
    this.controls.enabled = false;
    this.controls.activeLook = true;
    this.controls.movementSpeed = 0.0;

    this.canvas.addEventListener( 'mousedown', (event) => { this.controls.enabled = true; }, false );
    this.canvas.addEventListener( 'mouseup', (event) => { this.controls.enabled = false; }, false );

    this.bRenderTexture = false;
    window.addEventListener('keydown', (event) => {
      // console.log(event);
      if(event.key == '/') this.bRenderTexture = !this.bRenderTexture;
    });
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
  }

  _render() {
    // // update render target texture content
    // this.renderer.clear();
    // this.renderer.setViewport( 0, 0, this.renderTarget.width, this.renderTarget.height );
    // this.renderer.render(this.layer1.scene, this.camera, this.renderTarget, true );

    // this.renderer.clear();


    // this.renderer.setViewport( 0, 0, this.renderWidth, this.renderHeight );
    this.renderer.setScissorTest( false );
    this.renderer.setClearColor( new THREE.Color(0,0,0), 1.0);
    this.renderer.clear();

    this.renderer.render(this.scene, this.camera);

    if(this.bRenderTexture){
      // this.renderer.setClearColor( new THREE.Color(0,0,0), 0.0);
      this.renderer.render(this.layer1.scene, this.camera);
    }
  }
}



window.onload = () => {
  window.app = new App();
};

window.three = THREE;
