import Tree from '../components/Tree';

// Dev-only species review gallery (/dev/gallery): every species at key growth
// stages, wilted, and at tile size — the design-panel review surface.

const KINDS = ['oak', 'birch', 'pine', 'maple', 'willow', 'cherry', 'bamboo', 'sunflower'];
const STAGES = [1.2, 2.4, 3.4, 4.3, 5];

const cell = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 4,
};

const note = { fontSize: 11, fontFamily: 'monospace', opacity: 0.7 };

export default function DevGallery() {
  return (
    <main style={{ padding: 24, background: '#e8e4d8', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', margin: '0 0 16px' }}>
        Species Gallery (dev)
      </h1>
      {KINDS.map((kind) => (
        <section
          key={kind}
          data-kind={kind}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 18,
            padding: '18px 10px 8px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
          }}
        >
          <strong
            style={{
              width: 92,
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              fontSize: 15,
            }}
          >
            {kind}
          </strong>
          {STAGES.map((s) => (
            <div key={s} style={cell}>
              <Tree kind={kind} stage={s} size={120} seed={7} />
              <span style={note}>s{s}</span>
            </div>
          ))}
          <div style={cell}>
            <Tree kind={kind} stage={5} wilted size={120} seed={7} />
            <span style={note}>wilted</span>
          </div>
          <div style={cell}>
            <Tree kind={kind} stage={5} size={80} seed={7} />
            <span style={note}>tile 80px</span>
          </div>
          <div style={cell}>
            <Tree kind={kind} stage={5} size={80} seed={31} />
            <span style={note}>seed b</span>
          </div>
        </section>
      ))}
    </main>
  );
}
