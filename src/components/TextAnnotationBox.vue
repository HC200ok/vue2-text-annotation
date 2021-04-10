<template>
  <div
    class="text-annotation-box"
    :class="{ scroll: maxHeight }"
    v-on:mouseup="onMouseUp"
    :style="{ maxHeight: maxHeight }"
  >
    <!-- {{ chunks }} -->
    <template v-for="(item, index) in chunks">
      <span v-if="item.type === 'text'" :key="index">
        {{ item.content }}
      </span>
      <annotation-box
        v-if="item.type === 'annotation'"
        :key="index"
        :word="item.content"
        :label="item.label"
        :color="color"
        :contrastColor="contrastColor"
        @delete-annotation="deleteAnnotation"
      />
    </template>
    <transition name="panelIn">
      <labeling-input
        v-if="showLabelingInput"
        :posX="labelingInputPosX"
        :posY="labelingInputPosY"
        @add-label="addAnnotation"
        :color="color"
        :contrastColor="contrastColor"
        :align="labelingInputAlign"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import AnnotationBox from "./AnnotationBox.vue";
import LabelingInput from "./LabelingInput.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Annotation, Chunk, Entity } from "@/type";
import { getContrastColor } from "@/utils";
@Component({
  components: {
    AnnotationBox,
    LabelingInput,
  },
})
export default class textAnnotationBox extends Vue {
  @Prop({ required: true }) readonly text!: string;
  @Prop({ default: [] }) readonly value!: Array<Annotation>;
  @Prop({ default: "#577eba" }) readonly color!: string;
  @Prop({ default: null }) readonly maxHeight!: string | null;
  annotations: Array<Annotation> = [];
  chunks: Array<Chunk> = [];
  selectingWord: string | null = null;
  showLabelingInput = false;
  labelingInputPosX = "";
  labelingInputPosY = "";
  labelingInputAlign = "left";

  created(): void {
    this.annotations = this.value;
  }

  get contrastColor(): string {
    return getContrastColor(this.color);
  }

  @Watch("annotations")
  onannotationsChanged(newVal: Array<Annotation>): void {
    const entities = this.generateEntities(this.text, newVal);
    const chunks = this.generateChunks(this.text, entities);
    this.chunks = chunks;
    this.$emit("input", newVal);
  }

  @Watch("selectingWord")
  onSelectingWordChanged(newVal: string | null): void {
    this.showLabelingInput = !(newVal === "" || newVal === null);
  }

  // generate entity infos
  generateEntityInfos(text: string, annotation: Annotation): Array<Entity> {
    const regex = new RegExp(annotation.word, "g");
    const matchedIndexes = [...text.matchAll(regex)];
    const entityInfos: Array<Entity> = [];
    for (const item of matchedIndexes) {
      if (typeof item.index === "number") {
        entityInfos.push({
          end_offset: item.index + annotation.word.length,
          label: annotation.label,
          start_offset: item.index,
          word: annotation.word,
        });
      }
    }
    return entityInfos;
  }

  // generate enities
  generateEntities(
    text: string,
    annotations: Array<Annotation>
  ): Array<Entity> {
    let entitiesInfos: Array<Entity> = [];
    for (const annotation of annotations) {
      const entityInfos = this.generateEntityInfos(text, annotation);
      entitiesInfos = entitiesInfos.concat(entityInfos);
    }
    // sort by start_offset
    entitiesInfos = entitiesInfos
      .slice()
      .sort((a, b) => a.start_offset - b.start_offset);
    // filter duplicate start_offset
    entitiesInfos = entitiesInfos.reduce(
      (acc: Array<Entity>, current: Entity) => {
        const i = acc.findIndex(
          (item) => item.start_offset === current.start_offset
        );
        if (i == -1) {
          return acc.concat([current]);
        } else {
          if (acc[i].word.length < current.word.length) acc[i] = current;
          return acc;
        }
      },
      []
    );

    return entitiesInfos;
  }

  // generate text chunks
  generateTextChunks(text: string): Array<Chunk> {
    let chunks: Array<Chunk> = [];
    const snippets = text.split("\n");
    for (const snippet of snippets.slice(0, -1)) {
      chunks.push({
        type: "text",
        content: snippet + "\n",
        newline: false,
      });
      chunks.push({
        type: "text",
        content: "",
        newline: true,
      });
    }
    chunks.push({
      type: "text",
      content: snippets.slice(-1)[0],
      newline: false,
    });
    return chunks;
  }

  // generate chunks
  generateChunks(text: string, entities: Array<Entity>): Array<Chunk> {
    let chunks: Array<Chunk> = [];
    let startOffset = 0;
    // to count the number of characters correctly.
    const characters = text.split("");
    for (const entity of entities) {
      // add non-entities to chunks.
      let piece = characters.slice(startOffset, entity.start_offset).join("");
      chunks = chunks.concat(this.generateTextChunks(piece));
      startOffset = entity.end_offset;

      // add entities to chunks.
      piece = characters.slice(entity.start_offset, entity.end_offset).join("");
      chunks.push({
        type: "annotation",
        content: piece,
        label: entity.label,
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
          this.labelingInputPosX = rect.left + "px";
          this.labelingInputAlign = "left";
        } else {
          this.labelingInputPosX = rect.right - 200 + "px";
          this.labelingInputAlign = "right";
        }

        this.labelingInputPosY = rect.bottom + 5 + "px";
        // update selectingWord
        let word: string = selection + "";
        word = word.replace(/^\s+|\s+$/g, "");
        this.selectingWord = word.length > 0 ? word : null;
      } else {
        this.selectingWord = null;
      }
    }
  }

  deleteAnnotation(word: string): void {
    this.annotations = this.annotations.filter((item) => item.word != word);
  }

  addAnnotation(label: string): void {
    if (label.length) {
      if (typeof this.selectingWord == "string" && this.selectingWord.length) {
        this.annotations = this.annotations.concat({
          word: this.selectingWord,
          label,
        });
      }
      this.selectingWord = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.text-annotation-box {
  box-shadow: 0 2px 3px rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 10%);
  line-height: 2;
  padding: 10px 10px 10px 7px;
  text-align: left;
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
