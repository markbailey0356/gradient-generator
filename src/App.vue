<template lang="pug">
BlendingCircles
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GradientGenerator from "./GradientGenerator.vue";
import Circumcircle from "./Circumcircle.vue";
import BlendingCircles from "./BlendingCircles/BlendingCircles.vue";

export default defineComponent({
	components: {
    GradientGenerator,
    Circumcircle,
    BlendingCircles
}
});
</script>