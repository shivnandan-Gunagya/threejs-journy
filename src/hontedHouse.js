import * as Three from "three";
import Engine from "../Engine/engine";
import GUI from "lil-gui";

export default class hontedHouse extends Engine {
  constructor({ canvas }) {
    super({ canvas });
    this.setup();
    this.update();
    this.setupLights();
    this.setupGUI();
  }

  setup() {
    this.objectGroup = new Three.Group();
    this.scene.add(this.objectGroup);
    this.clock = new Three.Clock();
    this.setupTexture();

    this.sphere = new Three.Mesh(
      new Three.SphereGeometry(1, 50, 50),
      new Three.MeshStandardMaterial()
    );

    // this.objectGroup.add(this.sphere);
    this.sphere.position.set(0, 2, 0);

    this.plane = new Three.Mesh(
      new Three.PlaneGeometry(15, 15),
      new Three.MeshStandardMaterial({ 
        map: this.grassColorTexture,
        transparent: true,
        aoMap: this.grassambientTexture,
        normalMap: this.grassNormalTexture,
        roughnessMap: this.grassRoughnessTexture,
       })
    );
    this.objectGroup.add(this.plane);
    this.plane.receiveShadow = true;
    this.plane.position.y = 0;
    this.plane.rotation.x = -Math.PI * 0.5;

    // Walls

    this.walls = new Three.Mesh(
      new Three.BoxGeometry(4, 3, 4),
      new Three.MeshStandardMaterial({ 
        map: this.wallColorTexture,
        aoMap: this.wallambiantTexture,
        normalMap: this.wallNormalTexture,
        roughness: this.wallRoughnessTexture,
        metalness: 0.3,
       })
    );


    this.objectGroup.add(this.walls);
    this.walls.position.y = 3 / 2;

    //Roof

    this.roof = new Three.Mesh(
      new Three.ConeGeometry(3.5, 1, 4),
      new Three.MeshStandardMaterial({ color: "#b35f45", metalness: 0.8 })
    );

    this.objectGroup.add(this.roof);
    this.roof.position.y = 3.5;
    this.roof.rotation.y = Math.PI * 0.25;

    //door
    this.door = new Three.Mesh(
      new Three.PlaneGeometry(2, 2.2, 100, 100),
      new Three.MeshStandardMaterial({ 
        map: this.colorTexture,
        transparent: true,
        alphaMap: this.alphaTexture,
        aoMap: this.ambientOcclusionTexture,
        displacementMap: this.heightTexture,
        displacementScale: 0.2,
        normalMap: this.normalTexture,
        roughnessMap: this.roughnessTexture,

       })
    );

    this.objectGroup.add(this.door);
    this.door.position.set(0, 1, 2.01);

    //bush

    this.bushGeometry = new Three.SphereGeometry(1, 16, 16);
    this.bushMaterial = new Three.MeshStandardMaterial({ color: "#89c854" });

    this.bush1 = new Three.Mesh(this.bushGeometry, this.bushMaterial);
    this.bush1.scale.set(0.5, 0.5, 0.5);
    this.bush1.position.set(0.8, 0.2, 2.2);

    this.bush2 = new Three.Mesh(this.bushGeometry, this.bushMaterial);
    this.bush2.scale.set(0.2, 0.2, 0.2);
    this.bush2.position.set(1.4, 0.2, 2.2);

    this.bush3 = new Three.Mesh(this.bushGeometry, this.bushMaterial);
    this.bush3.scale.set(0.4, 0.4, 0.4);
    this.bush3.position.set(-0.8, 0.2, 2.2);

    this.bush4 = new Three.Mesh(this.bushGeometry, this.bushMaterial);
    this.bush4.scale.set(0.2, 0.2, 0.2);
    this.bush4.position.set(-1, 0.2, 2.7);

    this.objectGroup.add(this.bush1, this.bush2, this.bush3, this.bush4);

    //Grave
    this.graveGorup = new Three.Group();
    this.scene.add(this.graveGorup);

    this.graveGeometry = new Three.BoxGeometry(0.6, 0.8, 0.2);
    this.graveMaterial = new Three.MeshStandardMaterial({ color: "#41493f" });

    for (let i = 0; i < 30; i++) {
      this.graveAngle = Math.random() * Math.PI * 2;
      let radius = 2.5 + Math.random() * 4.6;
      let x = Math.sin(this.graveAngle) * radius;
      let z = Math.cos(this.graveAngle) * radius;

      this.grave = new Three.Mesh(this.graveGeometry, this.graveMaterial);
      this.grave.position.set(x, 0.3, z);
      this.grave.rotation.y = (Math.random() -0.5) * 0.4;
      this.grave.rotation.z = (Math.random() -0.5) * 0.4;
      this.grave.castShadow = true;
      this.graveGorup.add(this.grave);
    }

    // Fog 
    this.fog = new Three.Fog('#262837',1, 25);
    this.scene.fog = this.fog;
    this.renderer.setClearColor('#262837');

    //Gost

    this.gost1 = new Three.PointLight('#ff00ff', 6,8);
    this.scene.add(this.gost1);
     
    this.gost2 = new Three.PointLight('#00f8ff', 9,8);
    this.scene.add(this.gost2);
     
    this.gost3 = new Three.PointLight('#fffa00', 12,8);
    this.scene.add(this.gost3);
     

    this.camera.position.set(0, 2, 10);
  }

  setupTexture() {
    this.textureLoader = new Three.TextureLoader();

    // door texture 
    this.colorTexture = this.textureLoader.load('static/textures/door/color.jpg');
    this.alphaTexture = this.textureLoader.load('static/textures/door/alpha.jpg');
    this.ambientOcclusionTexture = this.textureLoader.load('static/textures/door/ambientOcclusion.jpg');
    this.heightTexture = this.textureLoader.load('static/textures/door/height.jpg');
    this.roughnessTexture = this.textureLoader.load('static/textures/door/roughness.jpg');
    this.metalnessTexture = this.textureLoader.load('static/textures/door/metalness.jpg');
    this.normalTexture = this.textureLoader.load('static/textures/door/normal.jpg');

    this.colorTexture.colorSpace = Three.SRGBColorSpace;
    this.alphaTexture.colorSpace = Three.SRGBColorSpace;
    this.ambientOcclusionTexture.colorSpace = Three.SRGBColorSpace;
    this.heightTexture.colorSpace = Three.SRGBColorSpace;
    this.roughnessTexture.colorSpace = Three.SRGBColorSpace;
    this.metalnessTexture.colorSpace = Three.SRGBColorSpace;
    this.normalTexture.colorSpace = Three.SRGBColorSpace;

    // wall texture 
    this.wallambiantTexture = this.textureLoader.load('static/textures/bricks/ambientOcclusion.jpg');
    this.wallColorTexture = this.textureLoader.load('static/textures/bricks/color.jpg');
    this.wallNormalTexture = this.textureLoader.load('static/textures/bricks/normal.jpg');
    this.wallRoughnessTexture = this.textureLoader.load('static/textures/bricks/roughness.jpg');

    this.wallambiantTexture.colorSpace =Three.SRGBColorSpace;
    this.wallColorTexture.colorSpace =Three.SRGBColorSpace;
    this.wallNormalTexture.colorSpace =Three.SRGBColorSpace;
    this.wallRoughnessTexture.colorSpace =Three.SRGBColorSpace;

    this.grassColorTexture = this.textureLoader.load('static/textures/grass/color.jpg');
    this.grassNormalTexture = this.textureLoader.load('static/textures/grass/normal.jpg');
    this.grassambientTexture = this.textureLoader.load('static/textures/grass/ambientOcclusion.jpg');
    this.grassRoughnessTexture = this.textureLoader.load('static/textures/grass/roughness.jpg');

    this.grassColorTexture.colorSpace = Three.SRGBColorSpace;
    this.grassNormalTexture.colorSpace = Three.SRGBColorSpace;
    this.grassRoughnessTexture.colorSpace = Three.SRGBColorSpace;
    this.grassambientTexture.colorSpace = Three.SRGBColorSpace;

    this.grassColorTexture.repeat.set(8, 8);
    this.grassNormalTexture.repeat.set(8, 8);
    this.grassRoughnessTexture.repeat.set(8, 8);
    this.grassambientTexture.repeat.set(8, 8);

    this.grassColorTexture.wrapS = Three.RepeatWrapping;
    this.grassNormalTexture.wrapS = Three.RepeatWrapping;
    this.grassRoughnessTexture.wrapS = Three.RepeatWrapping;
    this.grassambientTexture.wrapS = Three.RepeatWrapping;

    this.grassColorTexture.wrapT = Three.RepeatWrapping;
    this.grassNormalTexture.wrapT = Three.RepeatWrapping;
    this.grassRoughnessTexture.wrapT = Three.RepeatWrapping;
    this.grassambientTexture.wrapT = Three.RepeatWrapping;

  }

  setupLights() {
    //Ambiant Light
    this.ambiantLight = new Three.AmbientLight(0xffffff, 0.1);
    this.scene.add(this.ambiantLight);

    //Directional Light

    this.moonLight = new Three.DirectionalLight('#0b9d5ff', 0.3);
    this.moonLight.position.set(4,5,-2);

    this.scene.add(this.moonLight);

    //Door light

    this.doorLight = new Three.PointLight('#ff7d46', 4, 10);
    this.doorLight.position.set(0 , 2.5, 2.7);
    this.objectGroup.add(this.doorLight);
  }

  setupGUI() {
    this.gui = new GUI({
      title: "Honted House Controls",
    });

    this.AmbiantLightControls = this.gui.addFolder("Ambiant light");
    this.AmbiantLightControls.add(this.ambiantLight, "intensity").min(0).max(20).step(0.5).name("Intensity");

    this.MoonLightControls = this.gui.addFolder('Moon Light');
    this.MoonLightControls.add(this.moonLight, 'intensity').min(0).max(20).name('Intensity').step(1);
    this.MoonLightControls.add(this.moonLight.position, 'x').min(0).max(20).name('X').step(1);
    this.MoonLightControls.add(this.moonLight.position, 'y').min(0).max(20).name('Y').step(1);
    this.MoonLightControls.add(this.moonLight.position, 'z').min(0).max(20).name('Z').step(1);

  }

  update() {

    this.elapseTime = this.clock.getElapsedTime();

    this.gost1Angle = this.elapseTime * 0.5;
    this.gost1.position.x = Math.cos(this.gost1Angle)*4;
    this.gost1.position.z = Math.sin(this.gost1Angle)*4;
    this.gost1.position.y = Math.sin(this.elapseTime *3);

    this.gost2Angle = - this.elapseTime * 0.2;
    this.gost2.position.x = Math.cos(this.gost2Angle)*5;
    this.gost2.position.z = Math.sin(this.gost2Angle)*5;
    this.gost2.position.y = Math.sin(this.elapseTime *4) + Math.sin(this.elapseTime * 2.5);

    this.gost3Angle =  this.elapseTime * 0.8;
    this.gost3.position.x = Math.cos(this.gost2Angle)*6.7;
    this.gost3.position.z = Math.sin(this.gost2Angle)*6.7;
    this.gost3.position.y = Math.sin(this.elapseTime *2);
  }
}
