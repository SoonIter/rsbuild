import { useLang } from 'rspress/runtime';
import { HomeFeature } from 'rspress/theme';

export function WhyRsbuild() {
  const t = useLang();
  const features = {
    features: [
      {
        title: 'Rspack-based',
        details:
          'Using Rspack to bring you the ultimate development experience.',
        icon: '🚀',
      },
      {
        title: 'Batteries Included',
        details:
          'Out-of-the-box integration with the most practical building features in the ecosystem.',
        icon: '🦄',
      },
      {
        title: 'Framework Agnostic',
        details: 'Supports React, Vue, Svelte, and more frameworks.',
        icon: '🎯',
      },
      {
        title: 'Deep Optimization',
        details:
          'Automatically optimize static assets to maximizing production performance.',
        icon: '🛠️',
      },
      {
        title: 'Highly Pluggable',
        details:
          'Comes with a lightweight plugin system and a set of high quality plugins.',
        icon: '🎨',
      },
      {
        title: 'Easy to Configure',
        details:
          'Start with zero configuration and everything is configurable.',
        icon: '🍭',
      },
    ],
  };
  return <HomeFeature frontmatter={features} routePath="/" />;
}
