import * as THREE from 'three';

export default class LayerMesh {
  constructor(baseTexture, layers = []){

    // textures

    this.baseTexture = baseTexture;

    // materials


    // base material; simple static texture
    var mat0 = new THREE.MeshBasicMaterial({
          map: this.baseTexture
    });

    this.materials = [mat0];

    layers.forEach((layer) => {
      var mat = this._getLayerMaterial(layer.tex, layer.mask, layer.color);
      this.materials.push(mat);
    });

    // var mat1 = this._getLayerMaterial(this.baseTexture, this.maskTexture, new THREE.Color(1,0,0), 0.0);
    // mat1.blending = THREE.CustomBlending;
    // mat1.blendEquation = THREE.AddEquation;

    //this.materials = [mat0, mat1, mat2];

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

  _getLayerMaterial(colorTexture, maskTexture, color){
    if(!color){
      console.log('default color')  ;
      color = new THREE.Color(1,1,1);
    }

    var uniforms = {
      color: { value: color },
      maskOffsetX: {value: 0.0},
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
