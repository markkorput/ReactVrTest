import * as THREE from 'three';

export default class Layer {
  constructor(){
    this.tex1 = new THREE.TextureLoader().load( '../static_assets/equirectangulars/material.jpg' );
    this.material = new THREE.MeshBasicMaterial( {map: this.tex1} );
    this.material.side = THREE.DoubleSide;
    this.geometry = new THREE.PlaneGeometry( 2, 1, 1 );
    this.mesh = new THREE.Mesh( this.geometry, this.material );

    this.mesh.position.x = -1;
    this.mesh.position.y = -5;
    this.mesh.position.z = 4;

    this.mesh.rotation.x = 1.4;
    this.mesh.rotation.y = 0;
    this.mesh.rotation.z = Math.PI*0.5;

    this.mesh.scale.x = 2;
    this.mesh.scale.y = 5;
    this.mesh.scale.z = 1;

    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
  }
}
