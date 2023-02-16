import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import envCompatible from 'vite-plugin-env-compatible';
import { injectHtml } from 'vite-plugin-html';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import viteStylelint from 'vite-plugin-stylelint';
import eslintPlugin from 'vite-plugin-eslint';
import WindiCSS from 'vite-plugin-windicss';
import svgLoader from 'vite-svg-loader';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default (conf) =>
{
  process.env = {
    ...process.env,
    ...loadEnv(conf.mode, process.cwd())
  };
  return defineConfig({
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
      extensions: ['.mjs', '.js', '.json', '.vue'],
    },
    plugins: [
      vue(),
      viteCommonjs(),
      envCompatible(),
      injectHtml({
        injectData: {
          APP_TITLE: 'Cradle',
        },
      }),
      viteStylelint({
        cache: false,
        lintOnStart: true,
        chokidar: true,
      }),
      eslintPlugin({
        cache: false,
        lintOnStart: true,
        failOnError: false,
      }),
      WindiCSS(),
      svgLoader({
        defaultImport: 'url', // or 'raw'
        svgoConfig:
        {
          plugins: [
            {
              name: 'inlineStyles',
              active: true,
              params:
                {
                  onlyMatchedOnce: false,
                },
            },
            {
              name: 'removeXMLNS',
              active: true
            },
            {
              name: 'removeViewBox',
              active: false
            },
            {
              name: 'removeDimensions',
              active: true
            },
          ]
        }
      }),
    ],
    css: {
      postcss:
        {
          plugins: [
            autoprefixer,
          ],
        }
    },
  });
};
