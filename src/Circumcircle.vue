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

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(x, max));

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

		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

		const geometry = new THREE.CircleGeometry(0.02, 16);
		const circle = new THREE.Mesh(geometry, material);
		scene.add(circle);

		const raycaster = new THREE.Raycaster();

		const onMouseDown = (event: MouseEvent) => {
			if (mouseOverCircle.value) {
				mouseDraggingCircle.value = true;
			}
		}
		const onMouseUp = (event: MouseEvent) => {
			mouseDraggingCircle.value = false;
		}

		const canvas = ref<HTMLCanvasElement>(null);
		const mouseInElement = useMouseInElement(canvas);
		const mouse = computed(() => {
			const {elementX, elementY, elementHeight, elementWidth} = mouseInElement;
			return {
				x: clamp((elementX.value / elementWidth.value) * 2 - 1, -1, 1),
				y: -clamp((elementY.value / elementHeight.value) * 2 - 1, -1, 1),
			}
		})

		const cursor = computed(() => {
			if (mouseDraggingCircle.value) return 'grabbing';
			if (mouseOverCircle.value) return 'grab';
			return 'default';
		});
		const mouseOverCircle = ref(false);
		const mouseDraggingCircle = ref(false);

		
		onMounted(() => {
			const renderer = new THREE.WebGLRenderer({ canvas: unref(canvas), antialias: true, });
			useRafFn(render(renderer));
			onUnmounted(() => renderer.dispose());
		})

		const render = (renderer: THREE.Renderer) => () => {
			raycaster.setFromCamera(unref(mouse), camera);

			const intersection = raycaster.intersectObject(circle);
			mouseOverCircle.value = !!intersection.length;

			if (mouseOverCircle.value || mouseDraggingCircle.value) {
				material.color = new THREE.Color(0xff0000);
			} else {
				material.color = new THREE.Color(0xffffff);
			}

			if (mouseDraggingCircle.value) {
				circle.position.copy(new THREE.Vector3(mouse.value.x, mouse.value.y, 0).applyMatrix4(camera.projectionMatrixInverse))
			}

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