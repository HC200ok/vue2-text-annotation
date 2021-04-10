# vue-text-annotation-box

> A vue2 component for manual text annotation

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
npm install --save vue-text-annotation-box
```

### Demo

[Try!](https://codesandbox.io/s/stoic-tesla-yt6cc)

### ES6 Modules

```js
import textAnnotationBox from "vue-text-annotation-box";
```

```html
<text-annotation-box v-model="annotations" :text="text" />
```

### Props API

| Props     | Description                               | Type           | Must Required | Default   |
| --------- | ----------------------------------------- | -------------- | ------------- | --------- |
| v-model   | [{ "word": "James", "label": "name" },{ "word": "basketball", "label": "sports" },...] | annotation[]   | yes           | []        |
| text      | text                                      | String         | yes           |           |
| color     | theme color                               | String         | no            | '#577eba' |
| maxHeight | max height of text annotation box       | String or null | no            | null      |


```bash
# install dependencies
npm install
# compiles and hot-reloads for development
npm run serve
# compiles and minifies for production
npm run build
```
