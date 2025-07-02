import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const SelectionHighlighter = Extension.create({
  name: 'selectionHighlighter',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('selectionHighlighter'),

        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const { selection } = tr;
            const { from, to } = selection;

            // No selection or cursor only
            if (from === to) return DecorationSet.empty;

            const decoration = Decoration.inline(from, to, {
              class: 'selected',
            });

            return DecorationSet.create(tr.doc, [decoration]);
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
