<template lang="pug">
canvas(ref="canvas" width="1280" height="720")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue';
import { useRafFn } from '@vueuse/core';

import * as THREE from 'three';

export default defineComponent({
	setup() {

		const canvas = ref(null);
		onMounted(() => {
			const renderer = new THREE.WebGLRenderer({ canvas: unref(canvas) });

			const scene = new THREE.Scene();

			const aspectRatio = 16 / 9;
			const padding = 0.1;
			const camera = new THREE.OrthographicCamera();
			camera.left = 0.0 - padding;
			camera.right = 1.0 + padding;
			camera.top = 1.0 + padding;
			camera.bottom = 0.0 - padding;
			// camera.top = 0.5 + 0.5 / aspectRatio;
			// camera.bottom = 0.5 - 0.5 / aspectRatio;
			camera.near = -1;
			camera.position.z = 0;
			camera.updateProjectionMatrix();

			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
				0.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				0.0, 1.0, 0.0,
				1.0, 1.0, 0.0,
			]), 3))
			geometry.index = new THREE.BufferAttribute(new Int32Array([
				0, 1, 2,
				1, 2, 3,
			]), 3);
			const plane = new THREE.Mesh(
				geometry,
				new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true })
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