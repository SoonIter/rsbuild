import {
  getBrowserslistWithDefault,
  mergeChainedOptions,
} from '@rsbuild/shared';
import type {
  ModifyBundlerChainUtils,
  RsbuildPlugin,
  BundlerChain,
} from '@rsbuild/shared';
import browserslist from '@rsbuild/shared/browserslist';
import { browserslistToTargets } from 'lightningcss';
import path from 'node:path';
import type {
  LightningCssLoaderOptions,
  PluginLightningcssOptions,
} from './types';

const PLUGIN_NAME = 'rsbuild:lightningcss';

const applyLightningcssLoader = async ({
  chain,
  utils: { CHAIN_ID },
  browserslist: browserslistUserConfig,
  options,
}: {
  chain: BundlerChain;
  utils: ModifyBundlerChainUtils;
  browserslist: string[];
  options: PluginLightningcssOptions | undefined;
}) => {
  const defaultOptions = {
    targets: browserslistToTargets(browserslist(browserslistUserConfig)),
  } satisfies LightningCssLoaderOptions;

  const mergedOptions: LightningCssLoaderOptions = mergeChainedOptions({
    defaults: defaultOptions,
    options: options?.loaderOptions,
  });

  [CHAIN_ID.RULE.CSS, CHAIN_ID.RULE.SASS, CHAIN_ID.RULE.LESS].forEach(
    (ruleId) => {
      const rule = chain.module.rule(ruleId);
      let use = rule.use(CHAIN_ID.USE.LIGHTNINGCSS);

      const disableRemovePostCSS = options?.disableRemovePostCSS ?? false;

      use.loader(path.resolve(__dirname, './loader')).options(mergedOptions);

      if (disableRemovePostCSS) {
        switch (disableRemovePostCSS) {
          case 'insert-before':
            use = use.before(CHAIN_ID.USE.POSTCSS);
            break;
          case 'insert-after':
            use = use.after(CHAIN_ID.USE.POSTCSS);
            break;
          default:
            throw new TypeError(
              `[${PLUGIN_NAME}]: Expected type of disableRemovePostCSS should be 'false | "insert-before" | "insert-after"'`,
            );
        }
      } else {
        switch (ruleId) {
          case CHAIN_ID.RULE.SASS:
            use = use.before(CHAIN_ID.USE.RESOLVE_URL);
            break;
          case CHAIN_ID.RULE.LESS:
            use = use.before(CHAIN_ID.USE.LESS);
            break;
          case CHAIN_ID.RULE.CSS:
            use = use.after(CHAIN_ID.USE.CSS);
            break;
        }
        rule.uses.delete(CHAIN_ID.USE.POSTCSS);
      }
    },
  );
};

const applyLightningCssMinifyPlugin = async ({
  chain,
  utils: { CHAIN_ID },
  browserslist: browserslistUserConfig,
  options,
}: {
  chain: BundlerChain;
  browserslist: string[];
  utils: ModifyBundlerChainUtils;
  options: PluginLightningcssOptions | undefined;
}) => {
  const defaultOptions = {
    targets: browserslistToTargets(browserslist(browserslistUserConfig)),
  } satisfies LightningCssLoaderOptions;

  const mergedOptions: LightningCssLoaderOptions = mergeChainedOptions({
    defaults: defaultOptions,
    options: options?.minimizerOptions,
  });

  const { LightningCssMinifyPlugin } = await import('./minimizer');
  chain.optimization
    .minimizer(CHAIN_ID.MINIMIZER.CSS)
    .use(LightningCssMinifyPlugin, [mergedOptions])
    .end();
};

export const pluginLightningcss = (
  options?: PluginLightningcssOptions,
): RsbuildPlugin => ({
  name: PLUGIN_NAME,

  setup(api) {
    api.modifyBundlerChain(async (chain, utils) => {
      const { isServer, isWebWorker, isProd, target } = utils;
      const { context } = api;
      const config = api.getNormalizedConfig();
      const browserslist = await getBrowserslistWithDefault(
        context.rootPath,
        config,
        target,
      );

      if (!isServer && !isWebWorker && Boolean(options?.loaderOptions)) {
        await applyLightningcssLoader({ chain, utils, browserslist, options });
      }

      const isMinimize = isProd && !config.output.disableMinimize;

      if (isMinimize && Boolean(options?.minimizerOptions)) {
        applyLightningCssMinifyPlugin({ chain, utils, browserslist, options });
      }
    });
  },
});
