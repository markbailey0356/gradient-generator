<template lang="pug">
canvas(ref="canvas" width="1280" height="720")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue';
import { useRafFn } from '@vueuse/core';
import vertexShader from './gradient.vert';
import fragmentShader from './gradient.frag';

import * as THREE from 'three';
import { clamp } from 'three/src/math/MathUtils';

export default defineComponent({
	setup() {

		const canvas = ref(null);
		onMounted(() => {
			const renderer = new THREE.WebGLRenderer({ canvas: unref(canvas) });

			const scene = new THREE.Scene();

			const aspectRatio = 16 / 9;
			const padding = 0.1;
			const camera = new THREE.OrthographicCamera();
			camera.left = -1.0 - padding;
			camera.right = 1.0 + padding;
			camera.top = 1.0 + padding;
			camera.bottom = -1.0 - padding;
			// camera.top = 1.0 / aspectRatio + padding;
			// camera.bottom = -1.0 / aspectRatio - padding;
			camera.near = -1;
			camera.position.z = 0;
			camera.updateProjectionMatrix();

			// const geometry = new THREE.BufferGeometry();
			// geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
			// 	0.0, 0.0, 0.0,
			// 	1.0, 1.0, 0.0,
			// 	-1.0, 1.0, 0.0,
			// 	-1.0, -1.0, 0.0,
			// 	1.0, -1.0, 0.0,
			// ]), 3))
			// geometry.index = new THREE.BufferAttribute(new Uint32Array([
			// 	0, 1, 2,
			// 	0, 2, 3,
			// 	0, 3, 4,
			// 	0, 4, 1,
			// ]), 1);

			const geometry = new THREE.CircleGeometry(2, 32);
			const position = geometry.getAttribute('position');
			const clampedPosition = new Float32Array(position.array.length);
			for (let i = 0; i < position.array.length; i++) {
				clampedPosition[i] = clamp(position.array[i], -1, 1);
			}
			geometry.setAttribute('position', new THREE.BufferAttribute(clampedPosition, 3));
			const color = new Float32Array(position.count * 4);
			color[0] = 1;
			geometry.setAttribute('color', new THREE.BufferAttribute(color, 4));

			const plane = new THREE.Mesh(
				geometry,
				new THREE.ShaderMaterial({ vertexShader, fragmentShader }),
			)
			scene.add(plane);

			useRafFn(() => {
				renderer.render(scene, camera);
			})
		})

		return {
			canvas,
		}
	}
});
</script>

<style lang="scss" scoped>
</style>