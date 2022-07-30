import { getTruthyIndices, mapString, sample } from "./utils";

/**
 * Obfuscator
 *
 * Provides a low-level interface to obfuscate and reveal a string based on its
 * corresponding bitmap.
 *
 * ('hello', [0,1,0,1,0], '*') => '*e*l*o'
 */
abstract class Obfuscator {
  public value: string;
  public bitmap!: number[];

  constructor(str: string) {
    this.value = str;
    this.init();
  }

  /**
   * Set the bitmap to an array of 1s, with length equal to this.value.
   */
  init() {
    this.bitmap = this.value.split("").map(() => 1);
    return this;
  }

  /**
   * Create and return a string by mapping each character in this.value to
   * either one of the provided characters randomly or to itself, depending on
   * whether the corresponding bitmap index is truthy.
   */
  render(characters = "", exclude: string[] = []) {
    // If no characters are provided, return the raw value.
    if (!characters.length) return this.value;

    return mapString(this.value, (char: string, index: number) => {
      // Skip any characters that are passed as exclude.
      if (exclude.includes(char)) return char;

      /**
       * If corresponding bitmap index is truthy, return a randomly chosen
       * character from characters, else return this character.
       */
      return this.bitmap[index] ? sample(characters) : char;
    });
  }

  /**
   * Set count of the truthy indices in this.bitmap to 0, chosen randomly.
   */
  decay(count = 1) {
    while (count--) {
      const on = sample(getTruthyIndices(this.bitmap));
      this.bitmap[on] = 0;
    }
    return this;
  }

  /**
   * Change this.value to a new string and reset this.bitmap to match.
   */
  text(str = this.value) {
    this.value = str;
    this.init();
    return this;
  }
}

/**
 * - ObfuscatorElement -
 *
 * Extends Obfuscator to be able to wrap a DOM element and update its
 * textContent.
 *
 * (<p>Hi Mom!</p>).write('*~•+') => <p>•~ *+~•</p>
 */
export class ObfuscatorElement extends Obfuscator {
  private element: Node;

  constructor(element: Node) {
    super(element.textContent || "");
    this.element = element;
  }

  write(chars = "", exclude: string[] = []) {
    this.element.textContent = this.render(chars, exclude);
    return this;
  }
}
