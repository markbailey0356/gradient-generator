declare module '*.vue' {
	import { defineComponent } from 'vue';
	export default defineComponent;
}

declare module '*.frag' {
	const value: string;
	export default value;
}

declare module '*.vert' {
	const value: string;
	export default value;
}

declare module '*.glsl' {
	const value: string;
	export default value;
}