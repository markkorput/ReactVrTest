import Submodule from './submodule';
import LayerMesh from './LayerMesh';
import Layer from './Layer';
import * as THREE from 'three';
window.THREE = THREE;
import FirstPersonControls from './fpcontrols';
// this.THREE = THREE
import CubemapToEquirectangular from 'three.cubemap-to-equirectangular';

class App {
  constructor() {
    this.renderWidth = window.innerWidth;
    this.renderHeight = window.innerHeight;

    this.canvas = document.getElementById( 'canvas' );

    this.layer1 = new Layer();

    // renderer

    this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, antialias: true } );
    this.renderer.context.disable(this.renderer.context.DEPTH_TEST); // <-- solved flickering because of material conflicts

    // camera

    let rect = this.canvas.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera( 75, (rect.right-rect.left) / (rect.bottom-rect.top), 1, 1100 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );

    window.addEventListener( 'resize', () => {
      this.renderWidth = window.innerWidth;
      this.renderHeight = window.innerHeight;

      this.camera.aspect = this.renderWidth / this.renderHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( this.renderWidth, this.renderHeight, false );
    }, false);

    // equirectangular renderer

    this.equi = new CubemapToEquirectangular(this.renderer, true /* unmanaged */);
    // this.equi.setSize( 4096, 2048 );
    // this.equi.cubeCamera = new THREE.CubeCamera( .1, 1000, 4096 );

    this.equiUpdate = (download) => {
      var autoClear = this.equi.renderer.autoClear;
      this.equi.renderer.autoClear = true;
      this.equi.cubeCamera.position.copy( this.camera.position );
      this.equi.cubeCamera.update( this.renderer, this.layer1.scene );
      this.equi.renderer.autoClear = autoClear;
      return this.equi.convert(this.equi.cubeCamera, download);
    };

    window.addEventListener('keydown', (event) => {
      // console.log(event);
      if(event.key == 'u'){
        this.equiUpdate(false);
      }

      if(event.key == 'd'){
        this.equiUpdate(true);
      }

      if(event.key == 'c'){
        this._setupLayerMesh();
      }
    });

    // framebuffer renderer

    this.renderTarget = new THREE.WebGLRenderTarget( 4096, 2048, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat,
      alpha: true } );

    // objects, materials, textures

    //this.room = new Room(this.canvas, this.renderTarget.texture); // document.getElementById( 'room' ), this.renderTarget.texture);
    this.tex1 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room.jpg' );
    this.tex2 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room-mask1.jpg' );
    this.tex3 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room-mask2.jpg' );
    this.tex4 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/room-mask3.jpg' );
    this.tex5 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/output1.png' );


    // scene
    this.scene = new THREE.Scene();
    this._setupLayerMesh();

    // camera controls

    this.controls = new FirstPersonControls(this.camera, this.canvas);
    this.controls.lookSpeed = 0.4;
    this.controls.enabled = false;
    this.controls.activeLook = true;
    this.controls.movementSpeed = 0.0;

    this.canvas.addEventListener( 'mousedown', (event) => { this.controls.enabled = true; }, false );
    this.canvas.addEventListener( 'mouseup', (event) => { this.controls.enabled = false; }, false );

    // app config

    this.bRenderTexture = false;
    window.addEventListener('keydown', (event) => {
      // console.log(event);
      if(event.key == '/') this.bRenderTexture = !this.bRenderTexture;
    });

    this.clock = new THREE.Clock();
    this._tick();
  }

  _setupLayerMesh() {
    if(this.layerMesh)
      this.scene.remove(this.layerMesh.mesh);

    this.equiUpdate(false);
    this.layerMesh = new LayerMesh(
      this.tex1,
      [
        // {'tex': this.equi.output.texture, }
        {'tex': this.equi.output.texture, 'mask': this.tex4}
        // {'tex': this.tex5, 'mask': this.tex4}
        // {'tex': this.renderTarget.texture, 'mask': this.tex4}
        // {'tex': tex1, 'mask': tex3, 'color': new THREE.Color(1.0,0,1.0)}
      ]);

    this.scene.add(this.layerMesh.mesh);
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
    this.renderer.clear();
    this.renderer.setClearColor( new THREE.Color(0,0,0)); // RED as warning because we shouldn't have any clear pixels

    // render layer1 scene to renderTarget (will be used as texture in main 'scene')
    this.renderer.render(this.layer1.scene, this.camera, this.renderTarget, true );
    // this.equiUpdate(false);

    // render main scene
    this.renderer.render(this.scene, this.camera);

    // render layer1 scene if enabled (for reference)
    if(this.bRenderTexture){
      this.renderer.render(this.layer1.scene, this.camera);
    }
  }
}


window.onload = () => {
  window.app = new App();
};

window.three = THREE;
