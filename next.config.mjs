import { transformerNotationDiff, transformerNotationHighlight } from '@shikijs/transformers'
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  readingTime: true,
  mdxOptions: {
    rehypePrettyCodeOptions: {
      lang: 'tsx',
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
      ]
    },
  },
})

const godotHeaders = [
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin', // Matched parameters can be used in the value
  },
  {
    key: 'Cross-Origin-Embedder-Policy', // Matched parameters can be used in the key
    value: 'require-corp',
  },
]

export default withNextra({
    experimental: {
      // Include .md/.mdx files in the get-markdown API serverless bundle (required on Vercel)
      outputFileTracingIncludes: {
        '/api/get-markdown': ['./pages/**/*.md', './pages/**/*.mdx'],
      },
    },
    async rewrites() {
      return [
        { source: '/llms.txt', destination: '/api/llms.txt' },
        { source: '/:section*/llms.txt', destination: '/api/llms.txt?section=:section*' },
        { source: '/llms-full.txt', destination: '/api/llms-full.txt' },
        { source: '/:section*/llms-full.txt', destination: '/api/llms-full.txt?section=:section*' },
      ]
    },
    // We need to set redirects for **each old page which now has a new link**. This needs to be done before going live.
    // we can also use regexes for certain patterns, but in general, we will need to rewrite a lot :D
    async redirects() {
      return [

        // I've made this example to get us started.
        {
          source: '/components/state', // originally, the page was at https://docs.joinplayroom.com/components/state
          destination: '/features/apps/state', // now, in the new docs, it is at https://docs.joinplayroom.com/features/apps/state (you can check this on localhost)
          permanent: true, // we set permanent = true, because that way the Google crawler will "Remember" it next time
        },
        {
          source: '/components/bots',
          destination: '/features/games/bots',
          permanent: true,
        },
        {
          source: '/components/discord',
          destination: '/features/integrations/discord',
          permanent: true,
        },
        {
          source: '/components/gamepads',
          destination: '/features/games/gamepads',
          permanent: true,
        },
        {
          source: '/components/joystick',
          destination: '/features/games/joystick',
          permanent: true,
        },
        {
          source: '/components/lobby',
          destination: '/features/games/lobby',
          permanent: true,
        },
        {
          source: '/components/matchmaking',
          destination: '/features/games/matchmaking',
          permanent: true,
        },
        {
          source: '/components/persistence',
          destination: '/features/apps/persistence',
          permanent: true,
        },
        {
          source: '/components/rpc',
          destination: '/features/games/rpc',
          permanent: true,
        },
        {
          source: '/components/stream',
          destination: '/features/games/stream',
          permanent: true,
        },
        {
          source: '/components/tiktok',
          destination: '/features/integrations/tiktok',
          permanent: true,
        },
        {
          source: '/components/turnbased',
          destination: '/features/games/turnbased',
          permanent: true,
        },
        {
          source: '/multiplayer/mobile',
          destination: '/features/games/mobile',
          permanent: true,
        },
        {
          source: '/multiplayer/stream',
          destination: '/features/games/stream',
          permanent: true,
        },
        {
          source: '/multiplayer/toexe',
          destination: '/examples/turn-web-game-into-executable',
          permanent: true,
        },
        {
          source: '/multiplayer/typesofgames',
          destination: '/concepts/types-of-experiences',
          permanent: true,
        },
        {
          source: '/usage/cocos',
          destination: '/frameworks/games/cocos',
          permanent: true,
        },
        {
          source: '/usage/godot',
          destination: '/frameworks/games/godot',
          permanent: true,
        },
        {
          source: '/usage/kaplay',
          destination: '/frameworks/games/kaplay',
          permanent: true,
        },
        {
          source: '/usage/phaser',
          destination: '/frameworks/games/phaser',
          permanent: true,
        },
        {
          source: '/usage/pixijs',
          destination: '/frameworks/games/pixijs',
          permanent: true,
        },
        {
          source: '/usage/playcanvas',
          destination: '/frameworks/games/playcanvas',
          permanent: true,
        },
        {
          source: '/usage/r3f',
          destination: '/frameworks/web/r3f',
          permanent: true,
        },
        {
          source: '/usage/react',
          destination: '/frameworks/web/react',
          permanent: true,
        },
        {
          source: '/usage/spline',
          destination: '/frameworks/games/spline',
          permanent: true,
        },
        {
          source: '/usage/threejs',
          destination: '/frameworks/games/threejs',
          permanent: true,
        },
        {
          source: '/usage/unity',
          destination: '/frameworks/games/unity',
          permanent: true,
        },
        {
          source: '/apidocs',
          destination: '/api-reference',
          permanent: true,
        },
        {
          source: '/apidocs/react',
          destination: '/api-reference/react',
          permanent: true,
        },
        {
          source: '/apidocs/unity',
          destination: '/api-reference/unity',
          permanent: true,
        }
      ]
    },
    async headers() {
      return [
        {
          source: '/demos/godot4/:path',
          headers: godotHeaders,
        },
      ]
    },
})
