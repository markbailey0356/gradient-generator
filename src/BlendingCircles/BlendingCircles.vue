<template lang="pug">
canvas(ref="canvas" width="1280" height="720")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, unref } from 'vue';
import { useRafFn } from '@vueuse/core';

import circleVert from './circle.vert';
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
			const padding = 0.1;
			const camera = new THREE.OrthographicCamera();
			camera.left = -1.0 * aspectRatio - padding;
			camera.right = 1.0 * aspectRatio + padding;
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

			// const geometry = new THREE.CircleGeometry(2, 32);
			// const position = geometry.getAttribute('position');
			// const clampedPosition = new Float32Array(position.array.length);
			// for (let i = 0; i < position.array.length; i++) {
			// 	clampedPosition[i] = clamp(position.array[i], -1, 1);
			// }
			// geometry.setAttribute('position', new THREE.BufferAttribute(clampedPosition, 3));
			// const color = new Float32Array(position.count * 4);
			// color[0] = 1;
			// geometry.setAttribute('color', new THREE.BufferAttribute(color, 4));

			const geometry = new THREE.PlaneGeometry(1, 1);
			const material = new THREE.RawShaderMaterial({
				vertexShader: circleVert, 
				fragmentShader: circleFrag, 
				uniforms: {
					color: new THREE.Uniform(new THREE.Color(0xffffff)),
				},
				blending: THREE.CustomBlending,
				blendEquation: THREE.AddEquation,
				blendSrc: THREE.OneFactor,
				blendDst: THREE.OneFactor,
			})

			const circle1 = new THREE.Mesh(geometry, material.clone())
			const circle2 = new THREE.Mesh(geometry, material.clone())
			const circle3 = new THREE.Mesh(geometry, material.clone())

			circle1.material.uniforms.color.value = new THREE.Color(0xffff00);
			circle2.material.uniforms.color.value = new THREE.Color(0x00ffff);
			circle3.material.uniforms.color.value = new THREE.Color(0xff00ff);

			circle1.position.set(-0.33, -0.33, 0);
			circle2.position.set(0.33, -0.33, 0);
			circle3.position.set(0, 0.33, 0);

			scene.add(circle1);
			scene.add(circle2);
			scene.add(circle3);

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