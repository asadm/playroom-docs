import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'
import React, { useEffect } from 'react'
import { track } from './components/analytics'

const brandNewPages = ['/components/matchmaking', '/usage/godot', '/templates','/components/persistence','/components/turnbased']


export default {

  docsRepositoryBase: "https://github.com/asadm/playroom-docs/tree/main/",
  nextThemes: {
    forcedTheme: "dark",
    backgroundColor: "#000",

  },
  themeSwitch: {
    component: false
  },
  sidebar:{
    defaultMenuCollapseLevel: 2,
    titleComponent({ title, type, route }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>;
    }

    if (brandNewPages.includes(route)){
      return <>{title} <span style={{
        fontSize: "65%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "0.5rem",
        padding: "0.15rem 0.5rem",
        background: "#fff",
        color: "#000",
        borderRadius: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase"
      }}>new</span></>;
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

    const ogImageUrl = baseUrl + (frontMatter.image || ("/api/og?title=" + encodeURIComponent(frontMatter.title || title || 'Multiplayer in Minutes')));
 
    return (
      <>
      <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/apple-touch-icon.png" />
      <meta
            name="description"
            content={frontMatter.description || title || 'Build multiplayer games in minutes.'}
            key="desc"
          />
          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={frontMatter.title || title || 'Playroom Kit'}/>
          <meta
            property="og:description"
            content={frontMatter.description || 'Build multiplayer games in minutes.'}
          />
          <meta
            property="og:image"
            content={ogImageUrl}
          />

          {/* <!-- Twitter Meta Tags --> */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="joinplayroom.com" />
          <meta property="twitter:url" content={url} />
          <meta name="twitter:title" content={frontMatter.title || title || 'Playroom Kit'}/>
          <meta
            name="twitter:description"
            content={frontMatter.description || 'Build multiplayer games in minutes.'}
          />
          <meta
            name="twitter:image"
            content={ogImageUrl}
          />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet"></link>
          
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
        new Date().getFullYear() + ' © Playroom Inc.'
      ),
    },
      primaryHue:274,
      logo: ()=>{
        useEffect(() => {
          track('Docs: Pageview', { path: window.location.pathname });
        }, []);
        return (
        <>
          <svg width="24" height="24" viewBox="0 0 204 263" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29.1431 0H58.2859V29.1429H29.1431V0ZM0 0.00235281L29.1431 0V29.1429L0 29.1452V0.00235281ZM58.2859 29.1429H29.1431V58.2894H58.2859V29.1429ZM29.1431 87.428H58.2859V116.571H29.1431V87.428ZM58.2859 0V29.1429H87.428H116.571V0H58.2859ZM58.2859 58.2894L87.4301 58.2908V87.428H116.571V116.571H87.428V87.4337H58.2873L58.2859 58.2894ZM87.428 116.571H58.2859L58.2873 145.715H87.4301L87.428 116.571ZM116.571 29.1429H87.428L87.4301 58.2908L116.571 58.2894V29.1429ZM116.571 145.716L87.4301 145.715H58.2873V174.859H116.571V145.716ZM116.571 58.2894L174.857 58.2908V116.571H145.714V87.4337H116.572L116.571 58.2894ZM145.714 116.571H116.571V145.716L145.715 145.715L145.714 116.571ZM116.572 174.854H145.714L145.715 145.715L174.857 145.716V174.859H145.715V203.995H174.857V233.138H116.572V174.854ZM174.857 58.2908H204V116.571H174.857V58.2908ZM174.857 203.995V233.138H204V145.716H174.857L174.857 174.854L174.857 174.859V203.995ZM174.857 116.571H204V145.716H174.857V116.571ZM0 29.1452L29.1431 29.1429V58.2894H0V29.1452ZM29.1431 58.2894H0V116.571H29.1431L29.1429 87.4337L29.1431 87.428V58.2894ZM29.1431 116.571H0V145.715H29.1429L29.1431 116.571ZM29.1429 145.715H58.2873V174.859H29.1431L29.1429 145.715ZM0 145.715H29.1429V174.854L29.1431 174.859L29.1429 233.138H0V145.715ZM29.1429 233.149H0V262.292H29.1429V233.149Z" fill="white" />
          </svg>
          <span style={{ marginLeft: '.4em', fontWeight: 800 }}>
            Playroom Kit
          </span>
        </>
  )}

}
