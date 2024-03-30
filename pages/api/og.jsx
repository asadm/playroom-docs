import { ImageResponse } from '@vercel/og';
// import img from "../components/ogimageblank.png";
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Multiplayer in Minutes';
    const imageData = await fetch(new URL('./og2.png', import.meta.url)).then(
      (res) => res.arrayBuffer(),
    );
    const fontData = await fetch(
      new URL('./NotoSans-Bold.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

    let fontSize = "80px";

    if (title.length <= 16) {
      fontSize = "80px";
    }

    if (title.length >= 30) {
      fontSize = "60px";
    }

    return new ImageResponse(
      (
        <div
          style={{
            // backgroundImage: `url(${imageData})`,
            fontSize: 40,
            display: "flex",
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            // padding: '50px 200px',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <img width="1200" height="630" src={imageData} />
          <span style={{
            fontFamily: 'NotoSans',
            fontSize: fontSize,
            position: 'absolute',
            left: '50px',
            top: '300px',
            maxWidth: '480px',
            textAlign: 'left',
            zIndex: 1,
            color: "#fff",
          }}>{title}</span>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'RussoOne',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}