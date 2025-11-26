import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const logoUrl = 'https://8737nj28n9.ufs.sh/f/yeca34jg0kve0HqFHM8imeRqUW1g45YDjCbnlMck9IourLh2';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              padding: '12px 24px',
              backgroundColor: '#c8102e',
              transform: 'skewX(-12deg)',
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                fontWeight: 700,
                color: 'white',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                transform: 'skewX(12deg)',
              }}
            >
              // Community Logbook
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 100,
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              Rock Mill
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 100,
                fontWeight: 900,
                color: '#c8102e',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              Magnesium
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#64748b',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.4,
            }}
          >
            Track your sends. Share your progress. Climb smarter.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 60px',
            borderTop: '2px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  backgroundColor: '#22c55e',
                  borderRadius: '50%',
                }}
              />
              <div style={{ display: 'flex', fontSize: 16, color: '#64748b' }}>Live Routes</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                }}
              />
              <div style={{ display: 'flex', fontSize: 16, color: '#64748b' }}>Analytics</div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  backgroundColor: '#f97316',
                  borderRadius: '50%',
                }}
              />
              <div style={{ display: 'flex', fontSize: 16, color: '#64748b' }}>Community</div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={logoUrl}
            alt="Rock Mill Magnesium"
            width="128"
            height="128"
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
