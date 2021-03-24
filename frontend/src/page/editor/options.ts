/**
 * Various options for editor
 */

export interface FontOptionEntry {
  key: number,
  value: number,
  text: string
};

export interface FontOptionType extends Array<FontOptionEntry> {};

/**
 * Font options
 */
export const fontOptions: FontOptionType
  = [...Array(13).keys()].map(e => e + 12)
                         .map(e => {
                           return { key: e, value: e, text: e.toString() + 'px' };
                         });

export interface TabSizeOptionEntry {
  key: number,
  value: number,
  text: string
};

export interface TabSizeOptionType extends Array<TabSizeOptionEntry> {};

/**
 * Tab size options
 */
export const tabSizeOptions: TabSizeOptionType
  = [2, 4, 6, 8].map(e => {
                  return { key: e, value: e, text: e.toString() + ' spaces' };
                });

export interface CursorWidthOptionEntry {
  key: number,
  value: number,
  text: string
};

export interface CursorWidthOptionType extends Array<CursorWidthOptionEntry> {};
/**
 * Cursor width options
 */
export const cursorWidthOptions: CursorWidthOptionType
  = [...Array(12).keys()].map(e => e + 1)
                         .map(e => {
                           return { key: e, value: e, text: e.toString() + 'px' };
                         });
