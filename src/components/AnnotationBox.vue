<template>
  <span class="annotation" :style="{ borderColor: color }">
    <span class="annotation_word"> {{ word }} </span>
    <span
      class="annotation_label"
      :style="{ backgroundColor: color, color: contrastColor }"
    >
      {{ label }}
    </span>
    <button class="annotation_delete" @click="deleteAnnotation">x</button>
  </span>
</template>
<script lang="ts">
import { Vue, Prop, Component, Emit } from "vue-property-decorator";
@Component
export default class AnnotationBox extends Vue {
  @Prop({ required: true }) readonly color!: string;
  @Prop({ required: true }) readonly contrastColor!: string;
  @Prop({ required: true }) readonly word!: string;
  @Prop({ required: true }) readonly label!: string;
  @Emit()
  deleteAnnotation(): string {
    return this.word;
  }
}
</script>
<style lang="scss" scoped>
.annotation {
  margin-right: 3px;
  line-height: 1.3;
  border: 2px solid;
  box-shadow: 2px 4px 20px rgb(0 0 0 / 10%);
  display: inline-block;
  position: relative;
  cursor: pointer;
  &:hover &_delete {
    display: block;
  }
  &_word {
    float: left;
    padding: 0px 2px;
  }
  &_label {
    display: inline-block;
    height: 1.3rem;
    padding-left: 2px;
  }
  &_delete {
    font-size: 16px;
    color: #fff;
    top: -9px;
    left: -9px;
    position: absolute;
    text-align: center;
    display: none;
    border-radius: 50%;
    line-height: 1;
    padding: 0px;
    width: 16px;
    height: 16px;
    background-color: rgba(0, 0, 0, 0.54);
    border: none;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
