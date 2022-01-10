<template lang="pug">
AvoidingSamples
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GradientGenerator from "./GradientGenerator.vue";
import Circumcircle from "./Circumcircle.vue";
import BlendingCircles from "./BlendingCircles/BlendingCircles.vue";
import CircleGrid from "./CircleGrid/CircleGrid.vue";
import MovingSamples from "./MovingSamples/MovingSamples.vue";
import AvoidingSamples from "./AvoidingSamples/AvoidingSamples.vue";

export default defineComponent({
	components: {
    GradientGenerator,
    Circumcircle,
    BlendingCircles,
    CircleGrid,
    MovingSamples,
    AvoidingSamples
}
});
</script>