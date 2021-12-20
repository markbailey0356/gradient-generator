<template lang="pug">
MovingSamples
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GradientGenerator from "./GradientGenerator.vue";
import Circumcircle from "./Circumcircle.vue";
import BlendingCircles from "./BlendingCircles/BlendingCircles.vue";
import CircleGrid from "./CircleGrid/CircleGrid.vue";
import MovingSamples from "./MovingSamples/MovingSamples.vue";

export default defineComponent({
	components: {
    GradientGenerator,
    Circumcircle,
    BlendingCircles,
    CircleGrid,
    MovingSamples
}
});
</script>