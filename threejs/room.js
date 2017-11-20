import * as THREE from 'three';

export default class Room {
  constructor(baseTexture, maskTexture, materialTexture){

    // textures

    this.baseTexture = baseTexture;
    this.maskTexture = maskTexture;
    this.materialTexture = materialTexture;

    this.baseMaterial = new THREE.MeshBasicMaterial({
          map: this.baseTexture
    });

    // materials

    this.mat1 = this._getLayerMaterial(this.baseTexture, this.maskTexture, new THREE.Color(1,0,0), 0.0);

    this.materials = [this.baseMaterial, this.mat1];

    // geometry

    this.geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    this.geometry.scale( - 1, 1, 1 );

    // geometry groups (basically assigning vertices to materials)

    this.geometry.clearGroups();
    for(var i=0; i<this.materials.length; i++)
      this.geometry.addGroup( 0, Infinity, i );


    // mesh

    this.mesh = new THREE.Mesh( this.geometry, this.materials );
  }

  _getBaseMesh(tex){
    var material = new THREE.MeshBasicMaterial({
      map: tex,
      color: new THREE.Color(1,0,0)
    });

    var mesh = new THREE.Mesh( this.geometry, material );
    return mesh;
  }

  _getLayerMaterial(colorTexture, maskTexture, color, maskOffsetX){
    var uniforms = {
      color: { value: color },
      maskOffsetX: {value: maskOffsetX},
      texColor: {value: colorTexture},
      texMask: {value: maskTexture}
    };

    uniforms.texColor.value.wrapS = uniforms.texColor.value.wrapT = THREE.RepeatWrapping;
    uniforms.texMask.value.wrapS = uniforms.texMask.value.wrapT = THREE.RepeatWrapping;

    var material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader:document.getElementById( 'vertexShaderSource' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShaderSource' ).textContent,
      transparent: true
    });

    return material;
  }
}
