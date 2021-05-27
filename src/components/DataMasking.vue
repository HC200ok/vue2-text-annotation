<template>
  <div
    class="data-masking"
    :class="{ scroll: maxHeight }"
    v-on:mouseup="onMouseUp"
    :style="{ maxHeight: maxHeight }"
  >
    <!-- {{ chunks }} -->
    <template v-for="(item, index) in chunks">
      <span v-if="item.type === 'text'" :key="index" v-html="item.content" />
      <br v-if="item.type === 'wrap'" :key="index" />
      <data-masked
        v-if="item.type === 'masked'"
        :key="index"
        :dataMasked="item"
        :maskingTextColor="maskingTextColor"
        :maskingBgColor="maskingBgColor"
        @delete-data-masked="deleteDataMaked"
      />
    </template>
    <transition name="panelIn">
      <masking-input
        v-if="showMaskingInput"
        :posX="maskingInputPosX"
        :posY="maskingInputPosY"
        @add-masking="addDataMasked"
        :maskingTextColor="maskingTextColor"
        :maskingBgColor="maskingBgColor"
        :align="maskingInputAlign"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import DataMasked from "./DataMasked.vue";
import MaskingInput from "./MaskingInput.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Chunk, Masked } from "@/type";
@Component({
  components: {
    DataMasked,
    MaskingInput,
  },
})
export default class DataMasking extends Vue {
  @Prop({ required: true }) readonly text!: string;
  @Prop({ default: [] }) readonly value!: Array<Masked>;
  @Prop({ default: "#35495e" }) readonly maskingTextColor!: string;
  @Prop({ default: "#41b883" }) readonly maskingBgColor!: string;
  @Prop({ default: null }) readonly maxHeight!: string | null;

  dataMasked: Array<Masked> = [];
  textAfterMasking: string | null = null;

  chunks: Array<Chunk> = [];

  selectingData: string | null = null;
  selectingDataStartIndex: number | null = null;

  showMaskingInput = false;
  maskingInputPosX = "";
  maskingInputPosY = "";
  maskingInputAlign = "left";

  created(): void {
    this.dataMasked = this.value;
  }

  @Watch("dataMasked")
  onDataMaskedChanged(newVal: Array<Masked>): void {
    const entities = newVal.slice().sort((a, b) => a.start - b.start);
    const chunks = this.generateChunks(this.text, entities);
    this.chunks = chunks;
    this.$emit("input", newVal);
    this.$emit("afterMasking", this.getTextAfterMasking(newVal));
  }

  @Watch("selectingData")
  onSelectingWordChanged(newVal: string | null): void {
    this.showMaskingInput = !(newVal === "" || newVal === null);
  }

  getTextAfterMasking(dataMasked: Array<Masked>): string {
    let afterMasking: string = this.text;
    dataMasked.forEach((item) => {
      afterMasking =
        afterMasking.substr(0, item.start) +
        "*".repeat(item.content.length) +
        afterMasking.substr(item.start + item.content.length);
    });
    return afterMasking;
  }

  // generate text chunks
  generateTextChunks(text: string): Array<Chunk> {
    let chunks: Array<Chunk> = [];
    const snippets = text.split("\n");
    for (const snippet of snippets.slice(0, -1)) {
      chunks.push({
        type: "text",
        content: snippet,
      });
      chunks.push({
        type: "wrap",
        content: "↵",
      });
    }
    chunks.push({
      type: "text",
      content: snippets.slice(-1)[0],
    });
    return chunks;
  }

  // generate chunks
  generateChunks(text: string, entities: Array<Masked>): Array<Chunk> {
    let chunks: Array<Chunk> = [];
    let startOffset;
    // to count the number of characters correctly.
    const characters = text.split("");
    for (const entity of entities) {
      // add non-entities to chunks.
      let piece = characters.slice(startOffset, entity.start).join("");
      chunks = chunks.concat(this.generateTextChunks(piece));
      startOffset = entity.end;
      // add entities to chunks.
      piece = characters.slice(entity.start, entity.end).join("");
      chunks.push({
        type: "masked",
        content: piece,
        start: entity.start,
        category: entity.category,
      });
    }
    // add the rest of text.
    chunks = chunks.concat(
      this.generateTextChunks(
        characters.slice(startOffset, characters.length).join("")
      )
    );
    return chunks;
  }

  getPrevNodesLength(content: string): number {
    const nodeIndex = this.chunks.findIndex((item) => item.content === content);
    let prevNodesLength = 0;
    for (let i = 0; i < nodeIndex; i++) {
      prevNodesLength += this.chunks[i].content.length;
    }
    return prevNodesLength;
  }

  onMouseUp(event: {
    clientX: string;
    clientY: string;
    target: HTMLSpanElement | HTMLInputElement;
  }): void {
    const target = event.target;
    if (!target.classList.contains("labeling")) {
      const selection = window.getSelection();
      if (selection !== null && selection.toString().length) {
        const range = selection.getRangeAt(0).cloneRange();
        const rect = range.getBoundingClientRect();
        // update labeling box position
        const viewportWidth = Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        );
        // labeling input width: 200px
        if (viewportWidth - rect.left > 200) {
          this.maskingInputPosX = rect.left + "px";
          this.maskingInputAlign = "left";
        } else {
          this.maskingInputPosX = rect.right - 200 + "px";
          this.maskingInputAlign = "right";
        }

        this.maskingInputPosY = rect.bottom + 5 + "px";
        // update selectingData
        let word: string = selection + "";
        word = word.replace(/^\s+|\s+$/g, "");
        this.selectingData = word.length > 0 ? word : null;

        const anchorOffset: number = selection.anchorOffset;
        const focusOffset: number = selection.focusOffset;
        const anchorNode: any = selection.anchorNode;
        const anchorNodeData: string = anchorNode.data;
        let selectionString: string = selection + "";
        selectionString = selectionString.replace(/^\s+|\s+$/g, "");
        this.selectingData = selectionString.trim().length
          ? selectionString
          : null;
        this.selectingDataStartIndex =
          this.getPrevNodesLength(anchorNodeData) +
          Math.min(anchorOffset, focusOffset);
      } else {
        this.selectingData = null;
        this.selectingDataStartIndex = null;
      }
    }
  }

  deleteDataMaked(start: number): void {
    this.dataMasked = this.dataMasked.filter((item) => item.start != start);
  }

  addDataMasked(category: string): void {
    if (
      category.length &&
      typeof this.selectingData == "string" &&
      this.selectingData.length &&
      this.selectingDataStartIndex !== null
    ) {
      this.dataMasked = this.dataMasked.concat({
        content: this.selectingData,
        category,
        start: this.selectingDataStartIndex,
        end: this.selectingDataStartIndex + this.selectingData.length,
      });
    } 
    this.selectingData = null;
    this.selectingDataStartIndex = null;
  }
}
</script>

<style lang="scss" scoped>
.data-masking {
  box-shadow: 0 2px 3px rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 10%);
  line-height: 2;
  padding: 10px 10px 10px 7px;
  text-align: left;
  font-family: initial;
  &.scroll {
    overflow: scroll;
    /* custom scrollbar */
    &::-webkit-scrollbar {
      width: 20px;
      height: 0px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #d6dee1;
      border-radius: 20px;
      border: 6px solid transparent;
      background-clip: content-box;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #a8bbbf;
    }
  }
}

.panelIn-enter {
  transform: translateY(-10px);
}
.panelIn-enter-active {
  transition: transform 0.3s ease;
}
.panelIn-enter-to {
  transform: translateY(0);
}
</style>
