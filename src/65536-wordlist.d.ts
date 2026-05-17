/**
 * @fileoverview 2^16 English wordlist. Derived from
 * http://www-01.sil.org/linguistics/wordlists/english/.
 * Originally compiled for the Yahoo End-to-End project.
 * https://github.com/yahoo/end-to-end
 */
/**
 * A fixed-size array of 65,536 English words used for mnemonic generation.
 *
 * @type {string[]}
 */
export const words: string[];
/**
 * A reverse-lookup Map for high-performance index retrieval.
 * Maps each word string to its corresponding index in the {@link words} array.
 *
 * @type {Map<string, number>}
 */
export const wordMap: Map<string, number>;
