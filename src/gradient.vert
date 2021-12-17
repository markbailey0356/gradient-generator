attribute vec4 color;
varying vec4 vColor;

void main()
{
	vColor = color;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}