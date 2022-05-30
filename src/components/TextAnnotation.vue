<template>
  <span
    class="text-annotation"
    :style="{ borderColor: annotationBgColor, color: annotationTextColor }"
  >
    <span
      class="text-annotation__word"
      :class="{ 'data-masking': dataMasking }"
    >
      <template v-if="dataMasking">
        <span class="text-annotation__word-top">{{
          dataMaskingCharactor.repeat(textAnnotation.content.length)
        }}</span>
        <span class="text-annotation__word-bottom">{{
          textAnnotation.content
        }}</span>
      </template>
      <span v-else>
        {{ textAnnotation.content }}
      </span>
    </span>
    <span
      class="text-annotation__annotation"
      :style="{ backgroundColor: annotationBgColor }"
    >
      {{ textAnnotation.annotation }}
    </span>
    <button class="text-annotation__delete" @click="deleteAnnotation">x</button>
  </span>
</template>
<script lang="ts">
import { Annotation } from "@/type";
import { Vue, Prop, Component, Emit } from "vue-property-decorator";
@Component
export default class TextAnnotation extends Vue {
  @Prop({ required: true }) readonly textAnnotation!: Annotation;
  @Prop({ required: true }) readonly annotationBgColor!: string;
  @Prop({ required: true }) readonly annotationTextColor!: string;
  @Prop({ default: "●" }) readonly dataMaskingCharactor!: string;
  @Prop({ required: true }) readonly dataMasking!: boolean;
  @Emit()
  deleteAnnotation(): number {
    return this.textAnnotation.start;
  }
}
</script>
<style lang="scss" scoped>
.text-annotation {
  margin-right: 3px;
  line-height: 1.3;
  border: 2px solid;
  display: inline-block;
  position: relative;
  cursor: pointer;
  &:hover &__delete {
    display: block;
  }
  &__word {
    float: left;
    height: 1.3em;
    line-height: 1.3;
    overflow: hidden;
    padding-left: 2px;
    padding-right: 2px;
    &-top,
    &-bottom {
      height: 1.3em;
      text-align: center;
      display: block;
      transition: margin-top 0.3s;
    }
    &.data-masking {
      &:hover .text-annotation__word-top {
        margin-top: -1.3em;
      }
    }
  }
  &__annotation {
    display: inline-block;
    font-weight: 700;
    height: 1.3em;
    padding-left: 2px;
  }
  &__delete {
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
