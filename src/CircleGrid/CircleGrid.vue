<template lang="pug">
canvas(ref="canvas" width="1280" height="720")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue';
import { useRafFn } from '@vueuse/core';

import instancedCircleVert from './instanced-circle.vert';
import circleFrag from './circle.frag';
import blendVert from './blend.vert';
import blendFrag from './blend.frag';

import * as THREE from 'three';
import { clamp } from 'three/src/math/MathUtils';

export default defineComponent({
	setup() {

		const canvas = ref(null);
		onMounted(() => {
			const renderer = new THREE.WebGLRenderer({ canvas: unref(canvas) });

			const scene = new THREE.Scene();

			const aspectRatio = 16 / 9;
			const padding = 0;
			const camera = new THREE.OrthographicCamera();
			camera.left = -1.0 - padding;
			camera.right = 1.0 + padding;
			camera.top = 1.0 / aspectRatio + padding;
			camera.bottom = -1.0 / aspectRatio - padding;
			camera.near = -1;
			camera.position.z = 0;
			camera.updateProjectionMatrix();

			const referenceGeometry = new THREE.PlaneGeometry(1, 1);
			const geometry = new THREE.InstancedBufferGeometry();
			geometry.index = referenceGeometry.index;
			geometry.attributes = referenceGeometry.attributes;

			const material = new THREE.RawShaderMaterial({
				vertexShader: instancedCircleVert,
				fragmentShader: circleFrag,
				uniforms: {
					color: new THREE.Uniform(new THREE.Color(0xff0000)),
				},
				blending: THREE.CustomBlending,
				blendEquation: THREE.AddEquation,
				blendSrc: THREE.OneFactor,
				blendDst: THREE.OneFactor,
				depthTest: false,
				// depthWrite: false,
			})

			const size = 64;

			const rowCount = size;
			const columnCount = size;

			const count = rowCount * columnCount;

			const offsetArray = new Float32Array(count * 3);
			const scaleArray = new Float32Array(count);
			const colorArray = new Float32Array(count * 3);

			for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
				for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
					const index = (rowIndex * columnCount + columnIndex)
					const offsetIndex = 3 * index;
					const colorIndex = 3 * index;

					offsetArray[offsetIndex + 0] = (rowIndex + 0.5) / rowCount * 2 - 1; // x
					offsetArray[offsetIndex + 1] = (columnIndex + 0.5) / columnCount * 2 - 1; // y
					offsetArray[offsetIndex + 2] = -index * 0.01; // z

					scaleArray[index] = 8 / size;

					colorArray[colorIndex + 0] = Math.random();
					colorArray[colorIndex + 1] = Math.random();
					colorArray[colorIndex + 2] = Math.random();
				}
			}

			geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsetArray, 3));
			geometry.setAttribute('scale', new THREE.InstancedBufferAttribute(scaleArray, 1));
			geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));

			const circles = new THREE.Mesh(geometry, material);
			scene.add(circles);


			const renderTarget = new THREE.WebGLRenderTarget(canvas.value.width, canvas.value.height);

			renderTarget.texture.type = THREE.FloatType;

			const quad = new THREE.PlaneGeometry(1, 1);
			const postMaterial = new THREE.RawShaderMaterial({
				vertexShader: blendVert,
				fragmentShader: blendFrag,
				uniforms: {
					pre: new THREE.Uniform(renderTarget.texture),
				}
			})
			const postMesh = new THREE.Mesh(quad, postMaterial);

			const postScene = new THREE.Scene();
			postScene.add(postMesh);

			useRafFn(() => {
				renderer.setRenderTarget(renderTarget);
				renderer.render(scene, camera);

				renderer.setRenderTarget(null);
				renderer.render(postScene, camera);
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