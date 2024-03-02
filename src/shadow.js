import * as Three from "three";
import Engine from "../Engine/engine";
import GUI from "lil-gui";

export default class shadow extends Engine {
  constructor({ canvas }) {
    super({canvas});
    this.setupLight();
    this.setupGui();
  }

  setup() {
    this.material = new Three.MeshStandardMaterial();
    this.clock = new Three.Clock();

    this.group = new Three.Group();

    //Cube geometry
    this.cube = new Three.Mesh(new Three.BoxGeometry(1, 1), this.material);
    this.group.add(this.cube);
    this.cube.position.set(-2, 1.5, 0);
    this.cube.castShadow = true;

    //Sphere Geometry
    this.sphereGeometry = new Three.SphereGeometry(1, 8,16);
    this.sphereMaterial = new Three.MeshStandardMaterial();
    this.sphere = new Three.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.sphere.position.y = 1.5;
    this.group.add(this.sphere);
    this.sphere.castShadow = true;
    
    //Torus geometery
    this.torusGeometry = new Three.TorusGeometry(0.5, 0.2, 16, 32);
    this.torusmaterial = new Three.MeshStandardMaterial();
    this.torus = new Three.Mesh(this.torusGeometry, this.torusmaterial);
    this.torus.position.set(2, 1.5, 0);
    this.group.add(this.torus);
    this.torus.castShadow = true;
    

    //Plane Geometry
    this.planeGeometry = new Three.PlaneGeometry(7,7);
    this.planeMaterial = new Three.MeshStandardMaterial();
    this.planeMaterial.side = Three.DoubleSide;
    this.plane = new Three.Mesh(this.planeGeometry, this.planeMaterial);
    this.plane.rotation.x = Math.PI * 0.5; 
    this.group.add(this.plane);
    this.plane.receiveShadow = true;


    //Camera position
    this.camera.position.set(0,2,5);

    //Scene add
    this.scene.add(this.group);
  }

  setupLight(){

    //Ambiant Light
    this.ambiantLight = new Three.AmbientLight(0xffffff, 0);
    this.scene.add(this.ambiantLight);


    //Directional Light
    this.directionalLight = new Three.DirectionalLight(0xffffff, 5);
    this.scene.add(this.directionalLight);
    this.directionalLight.position.set(0,4,0);

    //Directional Light Helper
    this.directionalLightHelper = new Three.DirectionalLightHelper(this.directionalLight);
    this.scene.add(this.directionalLightHelper)
    this.directionalLight.castShadow = true;

    //Point light
    this.pointLight = new Three.PointLight(0xffdd00, 5);
    this.pointLight.position.set(2, 3,0);
    this.scene.add(this.pointLight);
    this.pointLight.castShadow = true;

    //Point light helper 
    this.pointLightHelper = new Three.PointLightHelper(this.pointLight, 0.5, 'red');
    this.scene.add(this.pointLightHelper);

  }

  setupGui(){
    this.gui = new GUI({title: 'Setup by Shiv', close: true});

    //Ambinat light Controls
    this.ambiantLightControl = this.gui.addFolder('Ambiant Light');
    this.ambiantLightControl.add(this.ambiantLight, 'intensity').min(0.5).max(10).name('Intensity').step(0.5);
    
    //Directional Light Controls
    this.directionalLigthcontrols = this.gui.addFolder('Directional Light');
    this.directionalLigthcontrols.add(this.directionalLight, 'intensity').min(0.5).max(10).name('intensity').step(0.5);

    //Point light Controls
    this.pointLightControls = this.gui.addFolder('Point Light');
    this.pointLightControls.add(this.pointLight, 'intensity').min(0.5).max(10).name('Intensity').step(0.5);

}

  update() {
    this.delta = this.clock.getDelta();

    this.sphere.position.x = Math.cos(this.delta);
    this.sphere.position.z = Math.sin(this.delta);
  }
}
