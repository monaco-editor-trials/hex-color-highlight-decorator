import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

import './style.css';

/**
 * @source https://stackoverflow.com/a/69806945/6940144
 */
(async function () {
  const editorElement = document.getElementById('editor');

  const editorInstance = monaco.editor.create(editorElement!, {
    value: `:root {
  --ngn-flame-50: #fdfdf6;
  --ngn-flame-100: #fbfbea;
  --ngn-flame-200: #f7f6d4;
  --ngn-flame-300: #f0efb2;
  --ngn-flame-400: #e2e065;
  --ngn-flame-500: #b3b022;
  --ngn-flame-600: #8d8b1b;
  --ngn-flame-700: #676514;
  --ngn-flame-800: #3c3b0b;
  --ngn-flame-900: #1e1e06;
  --ngn-flame-950: #111103;
}`,
    language: 'css',
    theme: 'vs-dark',
    minimap: {
      enabled: false,
    },
  });

  /**
   * Color inverter for text color
   * We need invert color for more readable texts
   */
  const invertColor = (hex: string): string => {
    const c = hex.replace('#', ''),
      r = parseInt(c.substring(0, 2), 16),
      g = parseInt(c.substring(2, 4), 16),
      b = parseInt(c.substring(4, 6), 16);

    const invertedR = (255 - r).toString(16).padStart(2, '0'),
      invertedG = (255 - g).toString(16).padStart(2, '0'),
      invertedB = (255 - b).toString(16).padStart(2, '0');

    return `#${invertedR}${invertedG}${invertedB}`;
  };

  /**
   * Hex color decorator for monaco editor
   */
  const decorateHexColors = (editor: editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (!model) return;

    const text = model.getValue(),
      hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})(?![0-9A-Fa-f])/g,
      matches = text.matchAll(hexRegex);

    const decorations = [],
      usedColors = new Set();

    for (const match of matches) {
      const hex = match[0];

      let color =
        hex.length === 4
          ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
          : hex;

      if (!usedColors.has(color)) {
        usedColors.add(color);

        const styleEl = document.createElement('style'),
          inverted = invertColor(color),
          className = `color-deco-${color.slice(1)}`;

        styleEl.innerHTML = `.${className} { 
          background: ${color}; 
          color: ${inverted}; 
        }`;
        document.head.appendChild(styleEl);
      }

      const start = match.index,
        end = start + hex.length;

      decorations.push({
        range: new monaco.Range(
          model.getPositionAt(start).lineNumber,
          model.getPositionAt(start).column,
          model.getPositionAt(end).lineNumber,
          model.getPositionAt(end).column
        ),
        options: {
          inlineClassName: `color-deco-${color.slice(1)}`,
        },
      });
    }

    const decorationCollection = editor.createDecorationsCollection();
    decorationCollection.set(decorations);
  };

  decorateHexColors(editorInstance);
})();
