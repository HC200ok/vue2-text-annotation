<template>
  <div id="app">
    <text-container
      class="text-container"
      v-model="labeledData"
      :text="text"
      :data-masking="false"
      @afterDataMasking="afterMasking"
    />
    <div class="annotations">
      data set: {{ labeledData }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TextContainer from "./components/TextContainer.vue";

@Component({
  components: {
    TextContainer
  },
})
export default class App extends Vue {
  text =
    "Vue.js is a progressive JavaScript framework, which is used to build UIs (User Interfaces) and SPAs (Single-page Applications). This framework is famous for its fast-paced learning curve. It is such an easy to learn and approachable library that with the knowledge of HTML, CSS, and JavaScript, we can start building web applications in Vue.js. The fast learning curve is kind of a signature of this framework. It is a versatile framework for our need as a library or a full-fledged framework for building huge web apps.\nEvan You have created this framework. The idea of Evan You behind this framework is to build the best framework by combining the best features from already existing Angular and react Frameworks. Before building Vue.js, Evan You was working at Google. Inc and worked on Angular based projects. So, he came up with the idea of building his own framework. He picked the best parts of Angular, like template syntax, easy to use, and picked the best parts of React as well, like two-way data binding, the concept of props, component-based approach, and combined them to make a new framework Vue.js better than both of them.";

  labeledData = [
    {
      content: "Vue.js",
      category: "framework",
      start:0,
      end:6,
    },
  ];

  textAfterMasking = this.text;

  afterMasking(textAfterMasking: string): void {
    this.textAfterMasking = textAfterMasking;
  }
}
</script>

<style>

</style>