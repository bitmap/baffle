import { getElements } from "./utils";
import { ObfuscatorElement } from "./obfuscator";

interface BaffleOptions {
  characters: string;
  exclude: string[];
  speed: number;
}

const defaults: BaffleOptions = {
  characters: "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz~!@#$%^&*()-+=[]{}|;:,./<>?",
  exclude: [" "],
  speed: 50,
};

/**
 * Baffle - A tiny javascript library for obfuscating and revealing text in DOM elements.
 *
 * ```ts
 * new Baffle(<elements>, [options]);
 * ```
 */
export class Baffle {
  public options: BaffleOptions;
  public elements: ObfuscatorElement[];
  public running: boolean;

  private interval!: number;

  // Provides an interface to one or many instances of the Obfuscator class.
  // This is the public-facing class.
  constructor(elements: string | Node | NodeList | HTMLCollection, options?: BaffleOptions) {
    this.options = Object.assign(defaults, options);
    this.elements = getElements(elements).map((node) => new ObfuscatorElement(node));
    this.running = false;
  }

  /**
   * Obfuscates each element once, using `options.characters`.
   */
  once() {
    // Call the write method on each Obfuscator once, using the provided characters.
    for (const element of this.elements) {
      element.write(this.options.characters, this.options.exclude);
    }
    this.running = true;
    return this;
  }

  /**
   * Starts obfuscating your elements, updating every `options.speed` milliseconds.
   */
  start() {
    clearInterval(this.interval);
    for (const element of this.elements) {
      element.init();
    }
    // Run once() every options.speed milliseconds.
    this.interval = setInterval(() => this.once(), this.options.speed);
    this.running = true;
    return this;
  }

  /**
   * Stops obfuscating your elements. This won't reveal your text. It will only
   * stop updating it. To reveal it, use `reveal()`.
   */
  stop() {
    // Stop any running interval.
    clearInterval(this.interval);
    this.running = false;
    return this;
  }

  /**
   * Updates instance options using the passed `options` object. You can set any
   * number of keys, even while running.
   */
  set(options: BaffleOptions) {
    // Set any options provided in the options object.
    this.options = Object.assign(this.options, options);
    // If currently running, restart.
    if (this.running) this.start();
    return this;
  }

  /**
   * Updates the text in each element of your instance using function `fn`,
   * which receives the current text as it's only parameter. The value returned
   * from `fn` will be used as the new text.
   */
  text(fn: (str: string) => string) {
    // Set the text in each element with the return value of function fn, which
    // receives the current text as its only argument.
    for (const element of this.elements) {
      element.text(fn(element.value));
      if (!this.running) element.write();
    }
    return this;
  }

  /**
   * Reveals your text over `duration` milliseconds (default: `0`), with the
   * option to delay by `delay` milliseconds.
   */
  reveal(duration = 0, delay = 0) {
    // Number of cycles in duration
    const cycles = duration / this.options.speed || 1;

    const run = () => {
      clearInterval(this.interval);
      this.running = true;

      // Start a new interval, obfuscating fewer characters on each cycle at
      // pace to finish within duration milliseconds.
      this.interval = setInterval(() => {
        // Get elements that haven't been fully revealed
        const unrevealedElements = this.elements.filter((el) => !el.bitmap.every((bit) => !bit));

        // Decay each by pace and write
        for (const element of unrevealedElements) {
          const pace = Math.ceil(element.value.length / cycles);
          element.decay(pace).write(this.options.characters, this.options.exclude);
        }

        // Once all elements are revealed, call stop() and initialize each
        // element.
        if (!unrevealedElements.length) {
          this.stop();
          for (const element of this.elements) {
            element.init();
          }
        }
      }, this.options.speed);
    };

    setTimeout(run, delay);
    return this;
  }
}
