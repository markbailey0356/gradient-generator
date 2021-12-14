<template lang="pug">
canvas(
	ref="canvas" 
	width="1280" 
	height="720" 
	:style="{ cursor }"
	@mousedown="onMouseDown" 
	@mouseup="onMouseUp"
)
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, unref } from 'vue';
import { useMouseInElement, useRafFn } from '@vueuse/core';

import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { BufferGeometry } from 'three';

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(x, max));

const calculateCircumcenter = (v1: THREE.Vector3, v2: THREE.Vector3, v3: THREE.Vector3): THREE.Vector3 | null => {
	const line1 = new THREE.Line3(v1, v2);
	const center1 = line1.getCenter(new THREE.Vector3());
	const perp1 = line1.delta(new THREE.Vector3()).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2).normalize();
	const ray = new THREE.Ray(center1, perp1);

	const line2 = new THREE.Line3(v2, v3);
	const normal = line2.delta(new THREE.Vector3()).normalize();
	const center2 = line2.getCenter(new THREE.Vector3());
	const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, center2);

	const intersection = new THREE.Vector3()
	if (ray.intersectPlane(plane, intersection)) return intersection;
	ray.direction.multiplyScalar(-1);
	if (ray.intersectPlane(plane, intersection)) return intersection;
	return null;
}

export default defineComponent({
	setup() {
		const scene = new THREE.Scene();

		const aspectRatio = 16 / 9;
		const padding = 0.1;
		const camera = new THREE.OrthographicCamera();
		camera.left = -1.0 - padding;
		camera.right = 1.0 + padding;
		// camera.top = 1.0 + padding;
		// camera.bottom = -1.0 - padding;
		camera.top = 1.0 / aspectRatio + padding;
		camera.bottom = -1.0 / aspectRatio - padding;
		camera.near = -1;
		camera.position.z = 0;
		camera.updateProjectionMatrix();

		const createCircle = ({ x = 0, y = 0 } = {}) => {
			const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
			const geometry = new THREE.CircleGeometry(0.02, 16);
			const circle = new THREE.Mesh(geometry, material);
			scene.add(circle);
			circle.position.set(x, y, 0);
			return circle
		}

		const circles = [
			{ x: -0.5, y: -0.5 },
			{ x: 0.5, y: -0.5 },
			{ x: 0, y: 0.5 },
		].map(createCircle);

		const circumcenter = createCircle();

		const raycaster = new THREE.Raycaster();

		const onMouseDown = (event: MouseEvent) => {
			if (selectedCircle.value) {
				mouseDraggingCircle.value = true;
			}
		}
		const onMouseUp = (event: MouseEvent) => {
			mouseDraggingCircle.value = false;
		}

		const canvas = ref<HTMLCanvasElement>(null);
		const mouseInElement = useMouseInElement(canvas);
		const mouse = computed(() => {
			const { elementX, elementY, elementHeight, elementWidth } = mouseInElement;
			return {
				x: clamp((elementX.value / elementWidth.value) * 2 - 1, -1, 1),
				y: -clamp((elementY.value / elementHeight.value) * 2 - 1, -1, 1),
			}
		})

		const cursor = computed(() => {
			if (mouseDraggingCircle.value) return 'grabbing';
			if (selectedCircle.value) return 'grab';
			return 'default';
		});
		const selectedCircle = ref<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> | null>(null);
		const mouseDraggingCircle = ref(false);


		onMounted(() => {
			const renderer = new THREE.WebGLRenderer({ canvas: unref(canvas), antialias: true, });

			const composer = new EffectComposer(renderer);

			const renderPass = new RenderPass(scene, camera)
			composer.addPass(renderPass);

			const antialiasingPass = new SMAAPass(canvas.value.width * renderer.getPixelRatio(), canvas.value.height * renderer.getPixelRatio());
			composer.addPass(antialiasingPass);

			useRafFn(render(composer));

			onUnmounted(() => renderer.dispose());
		})

		const triangle = new THREE.LineLoop(
			new THREE.BufferGeometry(),
			new THREE.LineBasicMaterial({ color: 0xffffff })
		)
		scene.add(triangle);

		const circumcircle = new THREE.LineLoop(
			new THREE.BufferGeometry(),
			new THREE.LineBasicMaterial({ color: 0xffffff })
		)
		circumcircle.geometry.setFromPoints(new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0).getPoints(64))
		scene.add(circumcircle);

		const render = (renderer) => () => {
			raycaster.setFromCamera(unref(mouse), camera);

			if (mouseDraggingCircle.value) {
				selectedCircle.value.position.copy(new THREE.Vector3(mouse.value.x, mouse.value.y, 0).applyMatrix4(camera.projectionMatrixInverse))
				selectedCircle.value.position.z = 0;
			} else {
				const intersections = raycaster.intersectObjects(circles);
				if (intersections.length) {
					selectedCircle.value = <THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>intersections[0].object;
				} else {
					selectedCircle.value = null;
				}
			}

			if (selectedCircle.value) {
				selectedCircle.value.material.color = new THREE.Color(0xff0000);
			} else {
				circles.forEach(x => x.material.color = new THREE.Color(0xffffff));
			}

			circumcenter.position.copy(calculateCircumcenter(circles[0].position, circles[1].position, circles[2].position));
			circumcenter.position.z = 0;

			triangle.geometry.setFromPoints(circles.map(x => x.position));

			const circumcircleRadius = circumcenter.position.distanceTo(circles[0].position);
			circumcircle.position.copy(circumcenter.position);
			circumcircle.scale.set(circumcircleRadius, circumcircleRadius, 0);

			renderer.render(scene, camera);
		}

		return {
			canvas,
			cursor,
			onMouseDown,
			onMouseUp,
		}
	}
});
</script>

<style lang="scss" scoped>
</style>