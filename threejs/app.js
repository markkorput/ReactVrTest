import Submodule from './submodule';
import Room from './room';
import * as THREE from 'three';
import ThreeOrbitControls from 'three-orbit-controls';
let OrbitControls = ThreeOrbitControls(THREE);
//THREE.OrbitControls = OrbitControls;


class App {
  constructor() {
    this.canvas = document.getElementById( 'canvas' );
    this.renderTarget = new THREE.WebGLRenderTarget( 1024, 512, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );

    this.room = new Room(document.getElementById( 'room' ), this.renderTarget.texture);
    this.submodule = new Submodule(document.getElementById( 'texture' ));
    this.submodules = [this.room, this.submodule];

    this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, antialias: true } );
    this.renderer.setClearColor( 0xffffff, 1 );
    this.renderer.setPixelRatio( window.devicePixelRatio );



    this._tick();
  }

  _update() {
    this._updateSize();
    this.submodules.forEach((submodule) => submodule.update());
  }

  _render() {
    this.renderer.setClearColor( 0xaaaaaa );
    this.renderer.setScissorTest( false );
    this.renderer.clear();

    this._renderTexture();

    this.renderer.setClearColor( 0x000000 );
    this.renderer.setScissorTest( true );

    this.submodules.forEach((submodule) => {
      this._renderModule(submodule.el, submodule.scene, submodule.camera);
    });
  }

  _renderTexture() {
    this.renderer.setClearColor( 0x000000 );
    // this.renderer.clear();
    this.renderer.setViewport( 0, 0, this.renderTarget.width, this.renderTarget.height );
    this.renderer.render(this.submodule.scene, this.submodule.camera, this.renderTarget, true );
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
