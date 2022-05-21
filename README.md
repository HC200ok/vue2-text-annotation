<br>

<p align="center">
<img src="logo.jpeg"  width="250"/ />
</p>

<p align="center">
vue-manual-data-masking
</p>

> Vue2 version of [easy-data-masking](https://github.com/HC200ok/easy-data-masking).

## Features

1. Providing input (supporting enter keypress) to enter categories of sensitive data like swear word, person name, home address...
2. Showing sensitive data been masked when mouse hover.
3. Replacing sensitive data by using characters "●" and "\*".

## Demo

<img src="demo.gif"  wight="150" />

[Try!](https://codesandbox.io/s/vue-manual-data-masking-yt6cc?file=/src/App.vue)

## Installation

```bash
npm install --save vue-manual-data-masking
```

## How to use

```js
import dataMasking from "vue-manual-data-masking";
```

```html
<data-masking v-model="dataMasked" :text="text" @afterMasking="afterMasking" />
```

## Options

| Property | Description | Type | Required | Default |
| -------- | ----------- | ---- | -------- | ------- |
| v-model | Data been masked<br>e.g. <br>[{ content: "080080080", category: "phone number", start: 0, end: 5 }] | Array<Masked> | true | [] |
| text | text | String | true | |
| maskingTextColor | color of masking text | String | false |"#35495e" |
| maskingBgColor | color of masking background | String | false | "#41b883"|
| maxHeight | max height of data masking container | Number or Null | false | null | |

## Events

`afterMasking` event will be emitted when new sensitive data been masked. textAfterMasking can be used inside of the callback function registered in advance. 

## Build Setup

```bash
# install dependencies
npm install
# serve with hot reload at localhost:8888
npm run serve
# build for production with minification
npm run build
```
