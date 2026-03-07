import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'
import React, { useEffect } from 'react'
import { track } from './components/analytics'
import Badge from './components/badge'
import PageHeading from './components/PageHeading'

const brandNewPages = ['/components/games/matchmaking', '/usage/games/cocos', '/templates','/components/for-apps/persistence','/components/games/turnbased', '/components/games/discord']

export default {
  components: {
    h1: PageHeading,
  },
  docsRepositoryBase: "https://github.com/asadm/playroom-docs/tree/main",
  nextThemes: {
    defaultTheme: "dark",
  },
  sidebar:{
    defaultMenuCollapseLevel: 2,
    titleComponent({ title, type, route }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>;
    }

    if (brandNewPages.includes(route)){
      return <>{title} <Badge>new</Badge></>;
    }
    return <>{title}</>;
    },
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter()
    const { frontMatter, title } = useConfig()
    const baseUrl = 'https://docs.joinplayroom.com';
    const url =
      baseUrl +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`)

    const safeTitle = frontMatter?.title ?? title ?? 'Multiplayer in Minutes';
    const safeDescription = frontMatter?.description ?? 'Build multiplayer games in minutes.';
    const ogImageUrl = baseUrl + (frontMatter?.image || ("/api/og?title=" + encodeURIComponent(safeTitle)));
    const pageTitle = frontMatter?.title ?? title;
    const documentTitle = pageTitle ? `${pageTitle} - Playroom Kit` : 'Playroom Kit';

    return (
      <>
      <title>{documentTitle}</title>
      <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/apple-touch-icon.png" />
      <meta
            name="description"
            content={safeDescription || title || 'Build multiplayer games in minutes.'}
            key="desc"
          />
          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={String(safeTitle)}/>
          <meta
            property="og:description"
            content={String(safeDescription)}
          />
          <meta
            property="og:image"
            content={ogImageUrl}
          />

          {/* <!-- Twitter Meta Tags --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="joinplayroom.com" />
          <meta property="twitter:url" content={url} />
          <meta name="twitter:title" content={String(safeTitle)}/>
          <meta
            name="twitter:description"
            content={String(safeDescription)}
          />
          <meta
            name="twitter:image"
            content={ogImageUrl}
          />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet"></link>
          
          {/* llms.txt for LLM discoverability */}
          <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM-optimized documentation of COMPLETE website" />

      </>
    )
  },
    useNextSeoProps(){
      return {
        titleTemplate: '%s - Playroom Kit',
      }
    },
    footer: {
      text: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            {new Date().getFullYear()} © Playroom Inc.
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            <a href="/api/llms.txt" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
              llms.txt
            </a>
            {' · '}
            <a href="/api/llms-full.txt" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
              llms-full.txt
            </a>
            {' · '}
            Documentation for AI and LLMs
          </div>
        </div>
      ),
    },
      primaryHue:274,
      logo: ()=>{
        useEffect(() => {
          track('Docs: Pageview', { path: window.location.pathname });
        }, []);
        return (
        <>
          <svg width="142" height="104" viewBox="0 0 142 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M141.563 15.9624V18.4937H140.045C138.962 18.4937 138.118 18.2318 137.513 17.7081C136.908 17.1728 136.606 16.3057 136.606 15.107V11.2315H135.418V8.75259H136.606V6.37842H139.591V8.75259H141.546V11.2315H139.591V15.1419C139.591 15.4329 139.661 15.6424 139.8 15.7704C139.94 15.8984 140.173 15.9624 140.498 15.9624H141.563Z" fill="currentColor"/>
            <path d="M132.487 7.74007C131.963 7.74007 131.533 7.58878 131.195 7.28619C130.869 6.97196 130.707 6.5879 130.707 6.13402C130.707 5.66849 130.869 5.28443 131.195 4.98184C131.533 4.66761 131.963 4.5105 132.487 4.5105C132.999 4.5105 133.418 4.66761 133.744 4.98184C134.082 5.28443 134.25 5.66849 134.25 6.13402C134.25 6.5879 134.082 6.97196 133.744 7.28619C133.418 7.58878 132.999 7.74007 132.487 7.74007ZM133.971 8.75259V18.4937H130.986V8.75259H133.971Z" fill="currentColor"/>
            <path d="M125.919 18.4937L121.799 13.082V18.4937H118.813V6.23877H121.799V11.6156L125.884 6.23877H129.393L124.644 12.244L129.567 18.4937H125.919Z" fill="currentColor"/>
            <path d="M112.763 8.64783C113.973 8.64783 114.934 9.01443 115.643 9.74763C116.365 10.4808 116.726 11.4992 116.726 12.8026V18.4937H113.758V13.2041C113.758 12.5757 113.589 12.0927 113.252 11.7552C112.926 11.4061 112.472 11.2315 111.89 11.2315C111.308 11.2315 110.849 11.4061 110.511 11.7552C110.185 12.0927 110.022 12.5757 110.022 13.2041V18.4937H107.055V13.2041C107.055 12.5757 106.886 12.0927 106.548 11.7552C106.222 11.4061 105.768 11.2315 105.187 11.2315C104.605 11.2315 104.145 11.4061 103.807 11.7552C103.482 12.0927 103.319 12.5757 103.319 13.2041V18.4937H100.333V8.75257H103.319V9.97457C103.621 9.56724 104.017 9.24719 104.506 9.01443C104.995 8.77003 105.547 8.64783 106.164 8.64783C106.897 8.64783 107.549 8.80494 108.119 9.11917C108.701 9.4334 109.155 9.88147 109.481 10.4634C109.819 9.92802 110.278 9.49159 110.86 9.15408C111.442 8.81658 112.076 8.64783 112.763 8.64783Z" fill="currentColor"/>
            <path d="M93.6522 18.6333C92.6979 18.6333 91.8366 18.4297 91.0685 18.0223C90.312 17.615 89.7127 17.0331 89.2704 16.2766C88.8398 15.5201 88.6245 14.6356 88.6245 13.6231C88.6245 12.6222 88.8456 11.7436 89.2879 10.9871C89.7301 10.219 90.3353 9.63125 91.1034 9.22392C91.8715 8.81658 92.7328 8.61292 93.6871 8.61292C94.6414 8.61292 95.5026 8.81658 96.2708 9.22392C97.0389 9.63125 97.644 10.219 98.0863 10.9871C98.5285 11.7436 98.7497 12.6222 98.7497 13.6231C98.7497 14.624 98.5227 15.5085 98.0688 16.2766C97.6266 17.0331 97.0156 17.615 96.2358 18.0223C95.4677 18.4297 94.6065 18.6333 93.6522 18.6333ZM93.6522 16.0497C94.2224 16.0497 94.7054 15.8402 95.1011 15.4212C95.5085 15.0022 95.7121 14.4029 95.7121 13.6231C95.7121 12.8434 95.5143 12.244 95.1186 11.825C94.7345 11.4061 94.2574 11.1966 93.6871 11.1966C93.1052 11.1966 92.6222 11.4061 92.2381 11.825C91.8541 12.2324 91.6621 12.8317 91.6621 13.6231C91.6621 14.4029 91.8483 15.0022 92.2207 15.4212C92.6047 15.8402 93.0819 16.0497 93.6522 16.0497Z" fill="currentColor"/>
            <path d="M82.5369 18.6333C81.5826 18.6333 80.7214 18.4297 79.9533 18.0223C79.1968 17.615 78.5974 17.0331 78.1552 16.2766C77.7246 15.5201 77.5093 14.6356 77.5093 13.6231C77.5093 12.6222 77.7304 11.7436 78.1726 10.9871C78.6149 10.219 79.2201 9.63125 79.9882 9.22392C80.7563 8.81658 81.6175 8.61292 82.5719 8.61292C83.5262 8.61292 84.3874 8.81658 85.1555 9.22392C85.9236 9.63125 86.5288 10.219 86.9711 10.9871C87.4133 11.7436 87.6344 12.6222 87.6344 13.6231C87.6344 14.624 87.4075 15.5085 86.9536 16.2766C86.5114 17.0331 85.9004 17.615 85.1206 18.0223C84.3525 18.4297 83.4913 18.6333 82.5369 18.6333ZM82.5369 16.0497C83.1072 16.0497 83.5902 15.8402 83.9859 15.4212C84.3932 15.0022 84.5969 14.4029 84.5969 13.6231C84.5969 12.8434 84.399 12.244 84.0033 11.825C83.6193 11.4061 83.1421 11.1966 82.5719 11.1966C81.9899 11.1966 81.507 11.4061 81.1229 11.825C80.7389 12.2324 80.5468 12.8317 80.5468 13.6231C80.5468 14.4029 80.733 15.0022 81.1055 15.4212C81.4895 15.8402 81.9667 16.0497 82.5369 16.0497Z" fill="currentColor"/>
            <path d="M73.6209 10.3761C73.9701 9.84073 74.4065 9.42176 74.9302 9.11917C75.4539 8.80494 76.0358 8.64783 76.6759 8.64783V11.8076H75.8554C75.1106 11.8076 74.552 11.9705 74.1795 12.2964C73.8071 12.6106 73.6209 13.1692 73.6209 13.9723V18.4937H70.6357V8.75257H73.6209V10.3761Z" fill="currentColor"/>
            <path d="M69.5562 8.75256L63.4462 23.1198H60.2341L62.4686 18.162L58.5059 8.75256H61.8402L64.0922 14.8451L66.3267 8.75256H69.5562Z" fill="currentColor"/>
            <path d="M47.1641 13.6057C47.1641 12.6048 47.3503 11.7261 47.7227 10.9696C48.1068 10.2132 48.6246 9.63125 49.2764 9.22392C49.9281 8.81658 50.6555 8.61292 51.4585 8.61292C52.1452 8.61292 52.7445 8.75257 53.2566 9.03189C53.7803 9.3112 54.1818 9.6778 54.4612 10.1317V8.75257H57.4463V18.4937H54.4612V17.1146C54.1702 17.5684 53.7629 17.935 53.2392 18.2144C52.7271 18.4937 52.1277 18.6333 51.4411 18.6333C50.6497 18.6333 49.9281 18.4297 49.2764 18.0223C48.6246 17.6034 48.1068 17.0156 47.7227 16.2592C47.3503 15.491 47.1641 14.6065 47.1641 13.6057ZM54.4612 13.6231C54.4612 12.8783 54.2517 12.2906 53.8327 11.8599C53.4254 11.4293 52.9249 11.214 52.3314 11.214C51.7378 11.214 51.2316 11.4293 50.8126 11.8599C50.4053 12.2789 50.2016 12.8608 50.2016 13.6057C50.2016 14.3505 50.4053 14.944 50.8126 15.3863C51.2316 15.8169 51.7378 16.0322 52.3314 16.0322C52.9249 16.0322 53.4254 15.8169 53.8327 15.3863C54.2517 14.9557 54.4612 14.368 54.4612 13.6231Z" fill="currentColor"/>
            <path d="M45.5941 5.57538V18.4937H42.6089V5.57538H45.5941Z" fill="currentColor"/>
            <path d="M41.0549 10.1841C41.0549 10.894 40.892 11.5457 40.5661 12.1393C40.2402 12.7212 39.7398 13.1925 39.0648 13.5533C38.3898 13.9141 37.5518 14.0945 36.551 14.0945H34.7005V18.4937H31.7153V6.23877H36.551C37.5286 6.23877 38.3549 6.40752 39.0299 6.74503C39.7049 7.08253 40.2112 7.54806 40.5487 8.1416C40.8862 8.73514 41.0549 9.41597 41.0549 10.1841ZM36.324 11.7203C36.8943 11.7203 37.3191 11.5865 37.5984 11.3188C37.8777 11.0511 38.0174 10.6729 38.0174 10.1841C38.0174 9.69529 37.8777 9.31705 37.5984 9.04937C37.3191 8.7817 36.8943 8.64786 36.324 8.64786H34.7005V11.7203H36.324Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M-0.00390625 1.74387C-0.00390625 0.952674 0.637488 0.311279 1.42869 0.311279H21.5713C22.3625 0.311279 23.0039 0.952674 23.0039 1.74387V21.8865C23.0039 22.6777 22.3625 23.3191 21.5713 23.3191H1.42869C0.637488 23.3191 -0.00390625 22.6777 -0.00390625 21.8865V1.74387ZM2.97615 11.8153H11.5006V20.3002H2.97615V11.8153ZM20.0245 3.33044H11.5V11.8153H20.0245V3.33044Z" fill="currentColor"/>
          </svg>
        </>
  )}

}

