<template lang="pug">
GradientGenerator
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GradientGenerator from "./GradientGenerator.vue";
import Circumcircle from "./Circumcircle.vue";

export default defineComponent({
	components: {
		GradientGenerator,
		Circumcircle
	}
});
</script>