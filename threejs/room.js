import * as THREE from 'three';

export default class Room {
  constructor(el, roomTexture, maskTexture, materialTexture){
    this.el = el;
    this.roomTexture = roomTexture;
    this.maskTexture = maskTexture;
    this.materialTexture = materialTexture;

    this.layerMeshes = [];
    this.isUserInteracting = false;

    let rect = el.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera( 75, (rect.right-rect.left) / (rect.bottom-rect.top), 1, 1100 );
    this.camera.target = new THREE.Vector3( 0, 0, 0 );

    window.addEventListener( 'resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false );

    this.geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    this.geometry.scale( - 1, 1, 1 );

    this.mesh = this._getBaseMesh(this.roomTexture);

    var layers = 8;
    var maskOffset = 1.0/(layers);
    for(var i = 0; i<layers; i++){
      this.layerMeshes.push(this._getLayerMesh(new THREE.Color(Math.random(),Math.random(),Math.random()), i*maskOffset));
    }
  }

  _getBaseMesh(tex){

    var material = new THREE.MeshBasicMaterial({
      map: tex
    });

    var mesh = new THREE.Mesh( this.geometry, material );

    this.layerMeshes.push(mesh);
    return mesh;
  }

  _getLayerMesh(color, maskOffsetX){

    var uniforms = {
      color: { value: color },
      maskOffsetX: {value: maskOffsetX},
      texColor: {value: this.roomTexture},
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
}
