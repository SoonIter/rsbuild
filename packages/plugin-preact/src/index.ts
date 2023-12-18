import type { RsbuildPlugin } from '@rsbuild/core';
import type { PreactPluginOptions } from './types';
import { isUsingHMR } from '@rsbuild/shared';

export type PluginPreactOptions = PreactPluginOptions;

export function pluginPreact(
  _options: PluginPreactOptions = {},
): RsbuildPlugin {
  return {
    name: 'rsbuild:preact',

    pre: ['rsbuild:swc'],

    setup(api) {
      api.modifyBundlerChain(async (chain, { CHAIN_ID, isProd, target }) => {
        const rsbuildConfig = api.getNormalizedConfig();
        const usingHMR = isUsingHMR(rsbuildConfig, { isProd, target });
        const rule = chain.module.rule(CHAIN_ID.RULE.JS);

        const preactOptions = {
          development: !isProd,
          refresh: usingHMR,
          runtime: 'automatic',
          importSource: 'preact',
        };

        rule.use(CHAIN_ID.USE.SWC).tap((options) => {
          options.jsc.transform.react = {
            ...preactOptions,
          };
          return options;
        });

        if (chain.module.rules.has(CHAIN_ID.RULE.JS_DATA_URI)) {
          chain.module
            .rule(CHAIN_ID.RULE.JS_DATA_URI)
            .use(CHAIN_ID.USE.SWC)
            .tap((options) => {
              options.jsc.transform.react = {
                ...preactOptions,
              };
              return options;
            });
        }
      });
    },
  };
}
