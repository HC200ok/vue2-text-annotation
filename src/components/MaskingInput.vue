<template>
  <div
    class="masking_input_box"
    :class="{ alignRight: align == 'right', alignLeft: align == 'left' }"
    :style="{ left: posX, top: posY }"
  >
    <div class="masking_input_box_left">
      <input
        id="masking_input"
        class="masking_input masking"
        autocomplete="off"
        v-model="category"
        ref="input"
        type="text"
        v-on:mouseup.stop
        @keyup.enter="addMasking"
      />
      <div class="underline" :style="{ borderColor: maskingBgColor }"></div>
    </div>
    <button
      class="masking_confirm masking"
      @click="addMasking"
      :style="{ backgroundColor: maskingBgColor, color: maskingTextColor }"
    >
      ok
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
@Component
export default class MaskingInput extends Vue {
  @Prop({ required: true }) posX!: string;
  @Prop({ required: true }) posY!: string;
  @Prop({ required: true }) maskingTextColor!: string;
  @Prop({ required: true }) maskingBgColor!: string;
  @Prop({ required: true }) align!: string;

  category = "";

  @Emit()
  addMasking(): string {
    return this.category;
  }
}
</script>
<style lang="scss" scoped>
.masking_input_box {
  position: fixed;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  display: flex;
  padding: 10px;
  line-height: 1;
  width: 200px;
  justify-content: center;
  box-sizing: border-box;
  &.alignRight {
    &::before {
      right: 10px;
    }
  }
  &.alignLeft {
    &::before {
      left: 10px;
    }
  }
  &::before {
    display: block;
    content: "";
    width: 10px;
    height: 10px;
    top: -7px;
    position: absolute;
    background-color: #fff;
    transform: rotate(45deg);
    border-left: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
  }
  &_left {
    .masking_input {
      width: 100%;
      border: none;
      outline: none;
      box-sizing: border-box;
      background: none;
      height: 15px;
      margin-bottom: 2px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset !important;
      }
    }
    .underline {
      position: relative;
      border-top: 1px solid;
    }
  }
  .masking_confirm {
    border: none;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    padding: 0px;
    font-size: 13px;
    border-radius: 50%;
    height: 22px;
    width: 22px;
    margin-left: 5px;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
