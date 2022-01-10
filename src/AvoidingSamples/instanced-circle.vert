uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 offset;
attribute float scale;
attribute vec3 color;

varying vec2 vUv;
varying vec3 vColor;

void main()
{
	vUv = uv;
	vColor = color;

	vec3 pos = position * scale + offset;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}