import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Aurora Store'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #000000, #111111)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 900, letterSpacing: '-0.05em' }}>
          AURORA.
        </div>
        <div style={{ fontSize: 30, color: '#888', marginTop: 20, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Defining Luxury
        </div>
      </div>
    ),
    { ...size }
  )
}