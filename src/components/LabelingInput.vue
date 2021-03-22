<template>
  <div
    class="labeling_input_box"
    :class="{ alignRight: align == 'right', alignLeft: align == 'left' }"
    :style="{ left: posX, top: posY }"
  >
    <div class="labeling_input_box_left">
      <input
        id="labeling_input"
        class="labeling_input labeling"
        autocomplete="off"
        v-model="label"
        autofocus
        ref="input"
        type="text"
        @keyup.enter="addLabel"
      />
      <div class="underline" :style="{ borderColor: color }"></div>
    </div>
    <button
      class="labeling_confirm labeling"
      @click="addLabel"
      :style="{ backgroundColor: color, color: contrastColor }"
    >
      ok
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
@Component
export default class LabelingInput extends Vue {
  @Prop({ required: true }) posX!: string;
  @Prop({ required: true }) posY!: string;
  @Prop({ required: true }) color!: string;
  @Prop({ required: true }) contrastColor!: string;
  @Prop({ required: true }) align!: string;
  label = "";
  savedSelection: Array<Range> = [];
  //   saveSelection(): void {
  //     var sel = window.getSelection(),
  //       ranges = [];
  //     if (sel !== null && sel.rangeCount) {
  //       for (var i = 0, len = sel.rangeCount; i < len; ++i) {
  //         ranges.push(sel.getRangeAt(i));
  //       }
  //     }
  //     this.savedSelection = ranges;
  //   }

  //   restoreSelection(): void {
  //     var sel = window.getSelection();
  //     if (sel !== null) {
  //       sel.removeAllRanges();
  //       for (var i = 0, len = this.savedSelection.length; i < len; ++i) {
  //         sel.addRange(this.savedSelection[i]);
  //       }
  //     }
  //   }

  @Emit()
  addLabel(): string {
    return this.label;
  }
  mounted(): void {
    const $input = document.getElementById("labeling_input");
    if ($input !== null) {
      $input.focus();
    }
  }
}
</script>
<style lang="scss" scoped>
.labeling_input_box {
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
    .labeling_input {
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
  .labeling_confirm {
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
  }
}
</style>
