# baffle

A tiny javascript library **for obfuscating and revealing text** in DOM elements.

```javascript
// Select elements and start.
const b = new Baffle(".someSelector").start();

// Do something else.
someAsyncFunction((result) => {
  // Change the text and reveal over 1500ms.
  b.text((text) => result.text).reveal(1500);
});
```

---

## Getting Started

#### Step 0: Install

```sh
npm install @bitmap/baffle
```

#### Step 1: Import

```javascript
import { Baffle } from "@bitmap/baffle";
```

#### Step 2: Initialize

To initialize baffle, all you need to do is call it with some elements. You can pass a NodeList, Node, or CSS selector.

```javascript
// With a selector.
const b = new Baffle(".baffle");

// With a NodeList
const b = new Baffle(document.querySelectorAll(".baffle"));

// With a Node
const b = new Baffle(document.querySelector(".baffle"));
```

#### Step 3: Use It

Once you have a baffle instance, you have access to all of the baffle methods. Usually, you'll want to `b.start()` and, eventually, `b.reveal()`.

```javascript
// Start obfuscating...
b.start();

// Or stop obfuscating...
b.stop();

// Obfuscate once...
b.once();

// You can set options after initializing...
b.set({ ...options });

// Or change the text at any time...
b.text((text) => "Hello world!");

// Eventually, you'll want to reveal your text...
b.reveal(1000);

// And they're all chainable...
b.start()
  .set({ speed: 100 })
  .text((text) => "¡Hola mundo!")
  .reveal(1000);
```

## Options

You can set options on baffle during initialization or anytime afterward with the `set` method.

```javascript
// During initialize
const b = new Baffle(".baffle", {
  characters: "+#-•=~*",
  speed: 75,
});

// Any time with set()
b.set({
  characters: "¯\_(ツ)_/¯",
  speed: 25,
});
```

### `options.characters`

> The characters baffle uses to obfuscate your text. It can be a string or an array of characters.
>
> **Default:** `'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz~!@#$%^&*()-+=[]{}|;:,./<>?'`

### `options.exclude`

> These are the characters that baffle ignores in your text when obfuscating it. You can pass in an array of characters.
>
> **Default:** `[' ']`

### `options.speed`

> This is the frequency (in milliseconds) at which baffle updates your text when running.
>
> **Default:** `50`

## Methods

An instance of baffle has six methods, all of which are chainable.

### `Baffle.once()`

> Obfuscates each element once, using `options.characters`.

### `Baffle.start()`

> Starts obfuscating your elements, updating every `options.speed` milliseconds.

### `Baffle.stop()`

> Stops obfuscating your elements. This won't reveal your text. It will only stop updating it. To reveal it, use `reveal()`.

### `Baffle.reveal([duration], [delay])`

> Reveals your text over `duration` milliseconds (default: `0`), with the option to delay by `delay` milliseconds.

### `Baffle.set([options])`

> Updates instance options using the passed `options` object. You can set any number of keys, even while running.

### `Baffle.text(fn)`

> Updates the text in each element of your instance using function `fn`, which receives the current text as it's only parameter. The value returned from `fn` will be used as the new text.

---

- **License** MIT
- **TypeScript conversion by** [Cabe Branson](http://cabe.dev)
- **Originally Made by** [Cam Wiegert](http://camwiegert.com)
- **Inspired by** [Oak](http://oak.is/)
