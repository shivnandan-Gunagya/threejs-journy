import * as Three from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Engine from "../Engine/engine";
import GUI from "lil-gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export default class modelLoader extends Engine {
  constructor({ canvas }) {
    super({ canvas });
    this.setup();
    this.update();
    this.setupLight();
    this.setupGui();
  }

  setup() {
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.clock = new Three.Clock();

    this.gltfLoader.load("static/models/myAssembly5.glb", (model) => {
      model.scene.scale.set(5, 5, 5);
      this.bottle = model;
      model.scene.position.set(0, -2, 1);

      this.scene.add(model.scene);
      console.log(model.scene);

      this.bottle.scene.traverse((child) => {
        if (child.isObject3D) {
          this.ChildMaterial = child.material;
          if (this.ChildMaterial) {
            if (child.name === "Infuser_(1)" || child.name === "Hidr8") {
              this.infuserMaterial = new Three.MeshStandardMaterial({
                color: this.ChildMaterial.color,
                metalness: this.ChildMaterial.metalness,
                roughness: this.ChildMaterial.roughness,
              });
              child.material = this.infuserMaterial;
            } else {
              this.ChildMaterial.metalness = 1;
              this.ChildMaterial.roughness = 0.4;
              this.ChildMaterial.flatShading = true;
            }
          }
        }
      });
      this.playAnimation();
    });

    //Loading rgbe texture
    this.rgbeLoader = new RGBELoader();
    this.rgbeLoader.load("static/textures/environmentMap/2k.hdr", (env) => {
      env.mapping = Three.EquirectangularReflectionMapping;

      this.scene.background = env;
      this.scene.environment = env;
    });

    this.camera.position.set(0, 2, 5);

    this.plane = new Three.Mesh(
      new Three.PlaneGeometry(2, 2),
      new Three.MeshBasicMaterial({ color: 0xffffff })
    );
    this.plane.rotation.x = -Math.PI * 0.5;
    this.scene.background = new Three.Color(0xffffff);

    this.scene.add(this.plane);
  }

  setupLight() {
    //Ambiant Light
    this.ambiantLight = new Three.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambiantLight);

    //Rect area Light
    this.rectAreaLight = new Three.RectAreaLight("blue", 0.5, 5, 5);
    this.scene.add(this.rectAreaLight);
    this.rectAreaLight.rotation.x = -Math.PI * 0.5;
    this.rectAreaLight.position.set(1.5, 2, 0);

    //Rect area Light helper

    this.rectAreaLightHelper = new Three.RectAreaLight(
      this.rectAreaLight,
      1,
      2,
      2
    );
    this.scene.add(this.rectAreaLightHelper);

    //Directional light
    this.directionalLight = new Three.DirectionalLight("blue", 0.5);
    this.directionalLight.position.set(0, 2, 2);

    //DirectionalLight helper
    this.directionalLightHelper = new Three.DirectionalLightHelper(
      this.directionalLight
    );
    this.scene.add(this.directionalLightHelper);

    this.hemisphereLight = new Three.HemisphereLight(0xffffff, 0xffffff, 0.5);
    this.scene.add(this.hemisphereLight);
  }

  setupGui() {
    this.gui = new GUI({ title: "Setup by Shiv", close: true });

    //Ambinat light Controls
    this.ambiantLightControl = this.gui.addFolder("Ambiant Light");
    this.ambiantLightControl
      .add(this.ambiantLight, "intensity")
      .min(0.5)
      .max(10)
      .name("Intensity")
      .step(0.5);

    //Directional Light Controls
    this.directionalLigthcontrols = this.gui.addFolder("Directional Light");
    this.directionalLigthcontrols
      .add(this.directionalLight, "intensity")
      .min(0.5)
      .max(10)
      .name("intensity")
      .step(0.5);
  }

  playAnimation() {
    this.animation = this.bottle.animations;
    this.mixer = new Three.AnimationMixer(this.bottle.scene);

    if (this.animation && this.animation.length) {
      this.animation.forEach((clip) => {
        this.mixer.clipAction(clip).play();
      });
    }
  }

  update() {
    this.delta = this.clock.getDelta();

    if (this.mixer) {
      this.mixer.update(this.delta);
    }
  }
}
