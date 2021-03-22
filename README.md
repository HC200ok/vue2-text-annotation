# vue-sequence-labeling-box

> A vue2 component for sequence labeling

### Concept

```javascript
// initial annotations:
[
  {
    word: "James",
    label: "name",
  },
];
```

<img src="down-arrow.png" width="50px"/><br/>
<img src="demo.gif" width="650px"/><br/>
<img src="down-arrow.png" width="50px"/><br/>

```javascript
// latest annotations:
[
  {
    word: "James",
    label: "name",
  },
  {
    word: "basketball",
    label: "sports",
  },
  {
    word: "🏀 ",
    label: "emoji",
  },
];
```

### Installation

```bash
npm install --save vue-sequence-labeling-box
```

### Demo

[Try!](https://codesandbox.io/s/stoic-tesla-yt6cc)

### ES6 Modules

```js
import sequenceLabelingBox from "vue-sequence-labeling-box";
```

```html
<sequence-labeling-box v-model="annotations" :text="text" />
```

### Props API

| Props     | Description                               | Type           | Must Required | Default   |
| --------- | ----------------------------------------- | -------------- | ------------- | --------- |
| v-model   | [{ "word": "James", "label": "name" },{ "word": "basketball", "label": "sports" },...] | annotation[]   | yes           | []        |
| text      | text                                      | String         | yes           |           |
| color     | theme color                               | String         | no            | '#577eba' |
| maxHeight | max height of sequence labeling box       | String or null | no            | null      |


```bash
# install dependencies
npm install
# compiles and hot-reloads for development
npm run serve
# compiles and minifies for production
npm run build
```
