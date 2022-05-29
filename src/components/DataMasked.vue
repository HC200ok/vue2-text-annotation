<template>
  <span
    class="dataMasked"
    :style="{ borderColor: maskingBgColor, color: maskingTextColor }"
  >
    <span class="dataMasked_word">
      <span class="dataMasked_word_top">{{
        "●".repeat(dataMasked.content.length)
      }}</span>
      <span class="dataMasked_word_bottom">{{ dataMasked.content }}</span>
    </span>
    <span
      class="dataMasked_category"
      :style="{ backgroundColor: maskingBgColor }"
    >
      {{ dataMasked.category }}
    </span>
    <button class="dataMasked_delete" @click="deleteDataMasked">x</button>
  </span>
</template>
<script lang="ts">
import { Masked } from "@/type";
import { Vue, Prop, Component, Emit } from "vue-property-decorator";
@Component
export default class DataMasked extends Vue {
  @Prop({ required: true }) readonly dataMasked!: Masked;
  @Prop({ required: true }) readonly maskingBgColor!: string;
  @Prop({ required: true }) readonly maskingTextColor!: string;
  @Emit()
  deleteDataMasked(): number {
    return this.dataMasked.start;
  }
}
</script>
<style lang="scss" scoped>
.dataMasked {
  margin-right: 3px;
  line-height: 1.3;
  border: 2px solid;
  display: inline-block;
  position: relative;
  cursor: pointer;
  &:hover &_delete {
    display: block;
  }
  &_word {
    float: left;
    height: 1.3em;
    line-height: 1.3;
    overflow: hidden;
    &_top,
    &_bottom {
      height: 1.3em;
      text-align: center;
      display: block;
      transition: margin-top 0.3s;
    }
    &:hover &_top {
      margin-top: -1.3em;
    }
  }
  &_category {
    display: inline-block;
    font-weight: 700;
    height: 1.3em;
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
