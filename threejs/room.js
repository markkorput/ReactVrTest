import * as THREE from 'three';

export default class Room {
  constructor(el, maskTexture){
    this.el = el;
    this.maskTexture = maskTexture;
    if(this.maskTexture === undefined)
      this.maskTexture = new THREE.TextureLoader().load( '../static_assets/barmask.jpg' );

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
      texMask: {value: this.maskTexture}
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
