import * as THREE from 'three';
import { Refractor } from 'three/addons/objects/Refractor.js';
import { WaterRefractionShader } from 'three/addons/shaders/WaterRefractionShader.js';

export class RefractorText {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = {
            text: 'REFRACTION',
            position: { x: 0, y: 50, z: 0 },
            textPosition: { x: 30, y: 30, z: 0.01 },
            refractorSize: { width: 90, height: 90 },
            textSize: { width: 15, height: 6 },
            color: 0xcbcbcb,
            textureWidth: 1024,
            textureHeight: 1024,
            ...options
        };
        
        this.refractor = null;
        this.label = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(1, 1);
        this.isHovering = false;
        
        this.init();
    }
    
    makeRefractorText(text = 'REFRACTION') {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 100;
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'rgba(255,255,255,0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'normal 80px "Gill Sans", "Gill Sans MT", sans-serif';
        context.letterSpacing = '16px';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 8;
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }
    
    async init() {
        const refractorGeometry = new THREE.PlaneGeometry(
            this.options.refractorSize.width, 
            this.options.refractorSize.height
        );
        
        // Create text texture
        const labelTex = this.makeRefractorText(this.options.text);
        
        // Create text geometry and mesh
        const textGeometry = new THREE.PlaneGeometry(
            this.options.textSize.width, 
            this.options.textSize.height
        );
        
        this.label = new THREE.Mesh(
            textGeometry,
            new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
        );
        
        this.label.position.set(
            this.options.textPosition.x,
            this.options.textPosition.y,
            this.options.textPosition.z
        );
        
        // Create refractor
        this.refractor = new Refractor(refractorGeometry, {
            color: this.options.color,
            textureWidth: this.options.textureWidth,
            textureHeight: this.options.textureHeight,
            shader: WaterRefractionShader
        });
        
        this.refractor.position.set(
            this.options.position.x,
            this.options.position.y,
            this.options.position.z
        );
        
        // Add to scene
        this.scene.add(this.refractor);
        this.refractor.add(this.label);
        
        // Load distortion texture
        try {
            const loader = new THREE.TextureLoader();
            const dudvMap = await loader.loadAsync('textures/waterdudv.jpg');
            dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
            this.refractor.material.uniforms.tDudv.value = dudvMap;
        } catch (error) {
            console.warn('Could not load texture: textures/waterdudv.jpg', error);
        }
    }
    
    setupInteraction(camera, renderer, onClickCallback = null) {
        const onMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects = this.raycaster.intersectObject(this.label, true);
            
            if (intersects.length > 0) {
                if (!this.isHovering) {
                    this.isHovering = true;
                    this.label.material.color.set(0xb02f72);
                    this.label.material.opacity = 1.0;
                    renderer.domElement.style.cursor = 'pointer';
                }
            } else {
                if (this.isHovering) {
                    this.isHovering = false;
                    this.label.material.color.set(0xffffff);
                    renderer.domElement.style.cursor = 'default';
                }
            }
        };
        
        const onMouseClick = () => {
            this.raycaster.setFromCamera(this.mouse, camera);
            const intersects = this.raycaster.intersectObject(this.label, true);
            if (intersects.length > 0 && onClickCallback) {
                onClickCallback();
            }
        };
        
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('click', onMouseClick);
        
        return { onMouseMove, onMouseClick }; // Return for cleanup if needed
    }
    
    updateText(newText) {
        const newTexture = this.makeRefractorText(newText);
        this.label.material.map = newTexture;
        this.label.material.needsUpdate = true;
    }
    
    setPosition(x, y, z) {
        this.refractor.position.set(x, y, z);
    }
    
    setTextPosition(x, y, z) {
        this.label.position.set(x, y, z);
    }
    
    animate(time) {
        if (this.refractor) {
            this.refractor.material.uniforms.time.value = time;
        }
    }
    
    dispose() {
        if (this.refractor) {
            this.scene.remove(this.refractor);
            this.refractor.geometry.dispose();
            this.refractor.material.dispose();
        }
        if (this.label) {
            this.label.geometry.dispose();
            this.label.material.dispose();
        }
    }
}