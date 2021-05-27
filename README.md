<br>

<p align="center">
<img src="logo.jpeg"  wight="120" />
</p>

<p align="center">
vue-manual-data-masking
</p>

> Vue2 version of [easy-data-masking](https://github.com/HC200ok/easy-data-masking).

## Features

~~1. Configurable categories of sensitive data like swear word, person name, home address...~~
1. Providing input for entering categories of sensitive data like swear word, person name, home address...
2. Showing sensitive data been masked when mouse hover.
3. Replacing sensitive data by using characters "●" and "\*".

## Demo

<img src="demo.gif"  wight="150" />

[Try!](https://codesandbox.io/s/easy-data-masking-igykl?file=/index.html)

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
| v-model(1) | sensitive data been masked<br>e.g. <br>[{ content: "080080080", category: "phone number", start: 0, end: 5 }] | Array<Masked> | no | [] |
| text | text | String | yes | |
| maskingTextColor | color of masking text | String | no |"#35495e" |
| maskingBgColor | color of masking background | String | no | "#41b883"|
| maxHeight | max height of data masking container | Number or Null | no | null | |

## Events

`afterMasking` event will be emitted when new sensitive data been masked. textAfterMasking can be used inside of the callback function registered in advance. 

## Build Setup

```bash
# install dependencies
npm install
# serve with hot reload at localhost:8080
npm run dev
# build for production with minification
npm run build
```
