import type { CustomAtRules, TransformOptions } from 'lightningcss';

type Implementation = typeof import('lightningcss');

export type LightningCssTransformOptions = Omit<
  TransformOptions<CustomAtRules>,
  'filename' | 'code' | 'inputSourceMap'
>;

export interface LightningCssLoaderOptions
  extends LightningCssTransformOptions {
  implementation?: Implementation;
}

export interface LightningCssMinifyPluginOptions
  extends LightningCssTransformOptions {
  implementation?: Implementation;
}

export type PluginLightningcssOptions = {
  /**
   * @see https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts
   * @default
   * {
   *   targets: browserslistToTargets(browserslist)
   * }
   */
  loaderOptions?: false | LightningCssLoaderOptions;
  /**
   * The 'insert-before'/'insert-after' define the insertion order of the lightningcss-loader based on the postcss-loader.
   * @default false
   */
  disableRemovePostCSS?: false | 'insert-before' | 'insert-after';
  /**
   * @see https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts
   * @default
   * {
   *   targets: browserslistToTargets(browserslist)
   * }
   */
  minimizerOptions?: false | LightningCssMinifyPluginOptions;
};
