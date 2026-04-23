import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1A1A1A',
          borderRadius: '50%',
          border: '2px solid #FF4D4D',
          position: 'relative',
          fontWeight: 900,
        }}
      >
        {/* Tomato "Leaf" */}
        <div 
          style={{
            position: 'absolute',
            top: -4,
            width: 8,
            height: 4,
            background: '#29664c',
            borderRadius: '4px',
          }}
        />
        <span style={{ marginTop: 2 }}>DB</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
