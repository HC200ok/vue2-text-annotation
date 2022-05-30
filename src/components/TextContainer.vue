<template>
  <div
    class="text-annotation-container"
    :class="{ scroll: maxHeight }"
    v-on:mouseup="onMouseUp"
    :style="{ maxHeight: maxHeight }"
  >
    <!-- {{ chunks }} -->
    <template v-for="(item, index) in chunks">
      <span class="text-for-annotation" v-if="item.type === 'text'" :key="index"
      :class="{ 'text-indent': isTextIndent(index)}">{{item.content}}</span>
      <br v-if="item.type === 'wrap'" :key="index" />
      <text-annotation
        v-if="item.type === 'annotation'"
        :key="index"
        :text-annotation="item"
        :annotation-text-color="annotationTextColor"
        :annotation-bg-color="annotationBgColor"
        :data-masking="dataMasking"
        :data-masking-charactor="dataMaskingCharactor"
        @delete-annotation="deleteAnnotation"
      />
    </template>
    <transition name="panelIn">
      <input-dialog
        v-if="showInputDialog"
        :posX="inputDialogPosX"
        :posY="inputDialogPosY"
        :input-dialog-width="inputDialogWidth"
        @add-annotation="addAnnotation"
        :annotation-text-color="annotationTextColor"
        :annotation-bg-color="annotationBgColor"
        :align="inputDialogAlign"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import TextAnnotation from "./TextAnnotation.vue";
import InputDialog from "./InputDialog.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Chunk, Annotation } from "@/type";
@Component({
  components: {
    TextAnnotation,
    InputDialog,
  },
})
export default class TextContainer extends Vue {
  @Prop({ required: true }) readonly text!: string;
  @Prop({ default: [] }) readonly value!: Array<Annotation>;
  @Prop({ default: "#35495e" }) readonly annotationTextColor!: string;
  @Prop({ default: "#41b883" }) readonly annotationBgColor!: string;
  @Prop({ default: false }) readonly dataMasking!: boolean;
  @Prop({ default: "●" }) readonly dataMaskingCharactor!: string;
  @Prop({ default: "*" }) readonly replaceCharactor!: string;
  @Prop({ default: null }) readonly maxHeight!: string | null;

  textAnnotations: Array<Annotation> = [];
  textAfterMasking: string | null = null;

  chunks: Array<Chunk> = [];

  selectingContent: string | null = null;
  selectingContentStartIndex: number | null = null;

  showInputDialog = false;
  inputDialogPosX = "";
  inputDialogPosY = "";
  inputDialogAlign = "left";
  inputDialogWidth = 200;

  created(): void {
    this.textAnnotations = this.value;
  }

  @Watch("textAnnotations")
  onTextAnnotationsChanged(newVal: Array<Annotation>): void {
    const entities = newVal.slice().sort((a, b) => a.start - b.start);
    const chunks = this.generateChunks(this.text, entities);
    this.chunks = chunks;
    this.$emit("input", newVal);
    if (this.dataMasking) {
      this.$emit("afterDataMasking", this.getTextAfterMasking(newVal));
    }
  }

  @Watch("selectingContent")
  onSelectingWordChanged(newVal: string | null): void {
    this.showInputDialog = !(newVal === "" || newVal === null);
  }

  isTextIndent(index: number): boolean {
    if (index === 0) return true;
    const previousChunk = this.chunks[index - 1];
    if (previousChunk.type === "wrap") {
      return true;
    }
    return false;
  }

  getTextAfterMasking(textAnnotations: Array<Annotation>): string {
    let afterMasking: string = this.text;
    textAnnotations.forEach((item) => {
      afterMasking =
        afterMasking.substr(0, item.start) +
        this.replaceCharactor.repeat(item.content.length) +
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
  generateChunks(text: string, entities: Array<Annotation>): Array<Chunk> {
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
        type: "annotation",
        content: piece,
        start: entity.start,
        annotation: entity.annotation,
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
    // if click on `ok` button, pass
    if (target.classList.contains("add-annotation-button")) return;
    // effective when mouseover on class `text-for-annotation`, expecially unavailable on `annotation` 
    if (
      target.classList.contains("text-for-annotation") ||
      target.classList.contains("text-annotation-container")
    ) {
      const selection = window.getSelection();
      if (selection !== null && selection.toString().length) {
        const range = selection.getRangeAt(0).cloneRange();
        const rect = range.getBoundingClientRect();
        // update input dialog position
        const viewportWidth = Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        );

        // this.inputDialogWidth = Math.max(rect.width, 200);
        this.inputDialogWidth = 200;
        if (viewportWidth - rect.left > this.inputDialogWidth) {
          this.inputDialogPosX = rect.left + "px";
          this.inputDialogAlign = "left";
        } else {
          this.inputDialogPosX = rect.right - 200 + "px";
          this.inputDialogAlign = "right";
        }

        this.inputDialogPosY = rect.bottom + 5 + "px";
        // update selectingContent
        let word: string = selection + "";
        word = word.replace(/^\s+|\s+$/g, "");
        this.selectingContent = word.length > 0 ? word : null;

        const anchorOffset: number = selection.anchorOffset;
        const focusOffset: number = selection.focusOffset;
        const anchorNode: any = selection.anchorNode;
        const anchorNodeData: string = anchorNode.data;
        let selectionString: string = selection + "";
        selectionString = selectionString.replace(/^\s+|\s+$/g, "");
        this.selectingContent = selectionString.trim().length
          ? selectionString
          : null;
        this.selectingContentStartIndex =
          this.getPrevNodesLength(anchorNodeData) +
          Math.min(anchorOffset, focusOffset);
      } else {
        this.selectingContent = null;
        this.selectingContentStartIndex = null;
      }
    }
  }

  deleteAnnotation(start: number): void {
    this.textAnnotations = this.textAnnotations.filter(
      (item) => item.start != start
    );
  }

  addAnnotation(annotation: string): void {
    if (
      annotation.length &&
      typeof this.selectingContent == "string" &&
      this.selectingContent.length &&
      this.selectingContentStartIndex !== null
    ) {
      this.textAnnotations = this.textAnnotations.concat({
        content: this.selectingContent,
        annotation,
        start: this.selectingContentStartIndex,
        end: this.selectingContentStartIndex + this.selectingContent.length,
      });
    }
    this.selectingContent = null;
    this.selectingContentStartIndex = null;
  }
}
</script>

<style lang="scss" scoped>
.text-annotation-container {
  box-shadow: 0 2px 3px rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 10%);
  line-height: 2;
  padding: 10px 10px 10px 7px;
  text-align: left;
  font-family: initial;
  .text-for-annotation {
    &.text-indent {
      padding-left: 2em;
    }
    margin: 0px;
    padding: 0px;
    text-indent: 2em;
  }
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
