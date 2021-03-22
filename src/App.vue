<template>
  <div id="app">
    <sequence-labeling-box v-model="annotations" :text="text" />
    <div class="annotations">
      {{ annotations }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SequenceLabelingBox from "./components/SequenceLabelingBox.vue";

@Component({
  components: {
    SequenceLabelingBox,
  },
})
export default class App extends Vue {
  text =
    "James is a basketball player, he likes eating hamburger since he was a child, now he is a basketball 🏀  star.";
  annotations = [
    {
      word: "James",
      label: "name",
    },
    // {
    //     "word": "basketball",
    //     "label": "sports"
    // },
    // {
    //     "word": "hamburger",
    //     "label": "food"
    // }
  ];
}
</script>

<style lang="scss"></style>
