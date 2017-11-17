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

class Room {
  constructor(el){
    this.el = el;
    this.layerMeshes = [];
    this.isUserInteracting = false;

    this.onMouseDownMouseX = 0;
    this.onMouseDownMouseY = 0;
    this.lon = 0;
    this.onMouseDownLon = 0;
    this.lat = 0;
    this.onMouseDownLat = 0;
    this.phi = 0;
    this.theta = 0;

    let rect = el.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera( 75, (rect.right-rect.left) / (rect.bottom-rect.top), 1, 1100 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );

    this.scene = new THREE.Scene();

    this.geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    this.geometry.scale( - 1, 1, 1 );

    var layers = 8;
    var maskOffset = 1.0/(layers);
    for(var i = 0; i<layers; i++)
      this.scene.add( this._getLayerMesh(new THREE.Color(Math.random(),Math.random(),Math.random()), i*maskOffset) );

    document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
    document.addEventListener( 'wheel', this.onDocumentMouseWheel, false );

    //

    document.addEventListener( 'dragover', ( event ) => {

      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';

    } );

    document.addEventListener( 'dragenter', ( event ) => {

      document.body.style.opacity = 0.5;

    } );

    document.addEventListener( 'dragleave', ( event ) => {

      document.body.style.opacity = 1;

    } );

    document.addEventListener( 'drop', ( event ) => {

      event.preventDefault();

      var reader = new FileReader();
      reader.addEventListener( 'load', ( event ) => {

        for(var i=0; i<layerMeshes.length; i++){
          this.layerMeshes[i].material.uniforms.texColor.value.image.src = event.target.result;
          this.layerMeshes[i].material.uniforms.texColor.value.needsUpdate = true;
        }
        //material.map.image.src = event.target.result;
        //material.map.needsUpdate = true;


      });
      reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

      document.body.style.opacity = 1;

    },);

    //

    window.addEventListener( 'resize', this.onWindowResize, false );
  }

  _getLayerMesh(color, maskOffsetX){

    var uniforms = {
      color: { value: color },
      maskOffsetX: {value: maskOffsetX},
      texColor: {value: new THREE.TextureLoader().load( '../static_assets/chess-world.jpg' )},
      texMask: {value: new THREE.TextureLoader().load( '../static_assets/barmask.jpg' )}
    };

    uniforms.texColor.value.wrapS = uniforms.texColor.value.wrapT = THREE.RepeatWrapping;
    uniforms.texMask.value.wrapS = uniforms.texMask.value.wrapT = THREE.RepeatWrapping;

    var shaderMaterial = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader:document.getElementById( 'vertexShaderSource' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShaderSource' ).textContent,
      transparent: true
    });

    var mesh = new THREE.Mesh( this.geometry, shaderMaterial );
    this.layerMeshes.push(mesh);
    return mesh;
  }

  onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  onDocumentMouseDown( event ) {

    event.preventDefault();

    this.isUserInteracting = true;

    this.onMouseDownMouseX = event.clientX;
    this.onMouseDownMouseY = event.clientY;

    this.onMouseDownLon = this.lon;
    this.onMouseDownLat = this.lat;

  }

  onDocumentMouseMove( event ) {

    if ( this.isUserInteracting === true ) {

      this.lon = ( this.onMouseDownMouseX - event.clientX ) * 0.1 + this.onMouseDownLon;
      this.lat = ( event.clientY - this.onMouseDownMouseY ) * 0.1 + this.onMouseDownLat;

    }

  }

  onDocumentMouseUp( event ) {

    this.isUserInteracting = false;

  }

  onDocumentMouseWheel( event ) {

    var fov = camera.fov + event.deltaY * 0.05;

    camera.fov = THREE.Math.clamp( fov, 10, 75 );

    camera.updateProjectionMatrix();

  }


  update() {

    if ( this.isUserInteracting === false ) {
      this.lon += 0.1;
    }

    this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
    this.phi = THREE.Math.degToRad( 90 - this.lat );
    this.theta = THREE.Math.degToRad( this.lon );

    this.camera.target.x = 500 * Math.sin( this.phi ) * Math.cos( this.theta );
    this.camera.target.y = 500 * Math.cos( this.phi );
    this.camera.target.z = 500 * Math.sin( this.phi ) * Math.sin( this.theta );

    this.camera.lookAt( this.camera.target );

    /*
    // distortion
    camera.position.copy( camera.target ).negate();
    */
  }
}

class App {
  constructor() {
    this.room = new Room(document.getElementById( 'room' ));
    this.submodule = new Submodule(document.getElementById( 'texture' ));
    this.submodules = [this.room, this.submodule];

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
