import { defineConfig } from '@windicss/plugin-utils';
import formsPlugin from 'windicss/plugin/forms';

// allow folders with braces in the name
const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
const dir = __dirname.replace(/\\/g, '/');
const safedir = dir.replace(UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');

export default defineConfig({
  /**
   * Write windi classes in html attributes.
   * @see https://windicss.org/features/attributify.html
   */
  extract:
  {
    include: [safedir + '/src/**/*.{vue,html}'],
    exclude: ['node_modules', '.git', 'dist'],
  },
  preflight: true,
  attributify: false,
  plugins: [formsPlugin],
  theme:
  {
    extend:
    {
      textColor:
        {
          inherit: 'inherit',
        },
      fontSize:
        {
          '2.5xl': '1.625rem',
        },
      borderRadius:
        {
          1: '0.25rem',
          2: '0.5rem',
          3: '0.75rem',
          4: '1rem',
        }
    },
  },
});
