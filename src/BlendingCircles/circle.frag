precision mediump float;

uniform vec3 color;

varying vec2 vUv;

void main()
{
	vec2 r = vUv - vec2(0.5);
	float distSq = dot(r, r) * 4.0;

	float s = 1.0 - smoothstep(0.98, 1.0, distSq);

	gl_FragColor = vec4(color * s, s);
}