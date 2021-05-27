<template>
  <div id="app">
    <data-masking v-model="dataMasked" :text="text" @afterMasking="afterMasking"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DataMasking from "./components/DataMasking.vue";

@Component({
  components: {
    DataMasking,
  },
})
export default class App extends Vue {
  text =
    "James lives at 4 Chome-2-8 Shibakoen, his phone number is 080080080";

  dataMasked = [
    // {
    //   content: "080080080",
    //   category: "phone number",
    //   start: 58,
    //   end: 67,
    // },
  ];
  textAfterMasking = this.text

  afterMasking(textAfterMasking: string) {
    this.textAfterMasking = textAfterMasking
  }
}
</script>
