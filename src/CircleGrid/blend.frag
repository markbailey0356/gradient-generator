precision mediump float;

uniform sampler2D pre;

varying vec2 vUv;

void main()
{
	vec4 preSample = texture2D(pre, vUv);

	vec3 color = preSample.rgb / max(1.0, preSample.a);

	gl_FragColor = vec4(color, 1.0);
}