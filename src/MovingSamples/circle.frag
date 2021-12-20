precision mediump float;

varying vec3 vColor;
varying vec2 vUv;

void main()
{
	vec2 r = vUv - vec2(0.5);
	float distSq = dot(r, r) * 4.0;

	float s = 1.0 - step(1.0, distSq);

	gl_FragColor = vec4(vColor * s, s);
	// gl_FragColor = vec4(color, 1.0);
}