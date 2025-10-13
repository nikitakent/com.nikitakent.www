import * as THREE from 'three';

export class SceneUtils {
    static createConcreteWalls(scene) {
        const planeGeo = new THREE.PlaneGeometry(100.1, 100.1);
        planeGeo.setAttribute('uv2', new THREE.BufferAttribute(planeGeo.attributes.uv.array, 2));

        const loader = new THREE.TextureLoader();
        const rep = 4;
        const wrap = t => (t.wrapS = t.wrapT = THREE.RepeatWrapping, t.repeat.set(rep, rep), t);

        // Wall textures
        const concreteColour = wrap(loader.load('textures/concrete/colour.jpeg'));
        const normalMap = wrap(loader.load('textures/concrete/normal.jpeg'));
        const roughMap = wrap(loader.load('textures/concrete/roughness.jpeg'));
        const aoMap = wrap(loader.load('textures/concrete/ao.jpg'));
        concreteColour.colorSpace = THREE.SRGBColorSpace;

        const concrete = new THREE.MeshStandardMaterial({
            map: concreteColour,
            normalMap,
            roughnessMap: roughMap,
            aoMap,
            roughness: 1,
            metalness: 0
        });

        // Create walls
        const walls = [];
        const planeTop = new THREE.Mesh(planeGeo, concrete);
        planeTop.position.y = 100;
        planeTop.rotateX(Math.PI / 2);
        walls.push(planeTop);

        const planeBottom = new THREE.Mesh(planeGeo, concrete);
        planeBottom.rotateX(-Math.PI / 2);
        walls.push(planeBottom);

        const planeBack = new THREE.Mesh(planeGeo, concrete);
        planeBack.position.set(0, 50, -50);
        walls.push(planeBack);

        const planeRight = new THREE.Mesh(planeGeo, concrete);
        planeRight.position.set(50, 50, 0);
        planeRight.rotateY(-Math.PI / 2);
        walls.push(planeRight);

        const planeLeft = new THREE.Mesh(planeGeo, concrete);
        planeLeft.position.set(-50, 50, 0);
        planeLeft.rotateY(Math.PI / 2);
        walls.push(planeLeft);

        walls.forEach(wall => scene.add(wall));
        return walls;
    }

    static createBouncingSphere(scene, options = {}) {
        const geometry = new THREE.IcosahedronGeometry(options.radius || 5, 0);
        const material = new THREE.MeshPhongMaterial({
            color: options.color || 0xffffff,
            emissive: options.emissive || 0x333333,
            flatShading: true
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        return {
            mesh: sphere,
            animate: (time) => {
                sphere.position.set(
                    Math.cos(time) * 30,
                    Math.abs(Math.cos(time * 2)) * 20 + 5,
                    Math.sin(time) * 30
                );
                sphere.rotation.y = (Math.PI / 2) - time;
                sphere.rotation.z = time * 8;
            }
        };
    }

    static createSpinningSphere(scene, options = {}) {
        const geometry = new THREE.IcosahedronGeometry(options.radius || 0.05, 0);
        const material = new THREE.MeshPhongMaterial({
            color: options.color || 0xffffff,
            emissive: options.emissive || 0x333333,
            flatShading: true
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            options.x || 0.5,
            options.y || -0.3,
            options.z || 0
        );
        scene.add(sphere);
        
        return {
            mesh: sphere,
            animate: (time) => {
                sphere.rotation.x = time * (options.speedX || 0.5);
                sphere.rotation.y = time * (options.speedY || 1);
                sphere.rotation.z = time * (options.speedZ || 0.3);
            }
        };
    }

    static createLighting(scene, options = {}) {
        const mainLight = new THREE.PointLight(
            options.color || 0x7a7a6b,
            options.intensity || 2.5,
            options.distance || 250,
            options.decay || 0
        );
        mainLight.position.set(
            options.x || 0,
            options.y || 60,
            options.z || 0
        );
        scene.add(mainLight);
        return mainLight;
    }
}