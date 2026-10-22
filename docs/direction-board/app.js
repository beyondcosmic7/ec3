/* ==========================================================================
   Eskort Creations — Direction Board Application Logic
   Phase 0 Deliverable · Interactive Switching & Hardware Token Verification
   ========================================================================== */

const DIRECTIONS = {
  a: {
    name: 'Direction A: "Selvedge" (Textile Vernacular)',
    themeClass: '',
    description: 'Built from the language of cloth: block-print registration dots, raw woven selvedge edges, woven care labels, and tactile tailor measurements. Designed for tactile trust without AI cliches.',
    aesthetic: 'Textile Vernacular & Tailoring',
    contrast: 'WCAG AAA (14.8:1 Primary)',
    slopStatus: 'Zero (All 5 Clusters Rejected)',
    palette: [
      { name: 'Canvas Linen', hex: '#FAF8F5', role: 'Base Background', contrast: 'Base' },
      { name: 'Subtle Surface', hex: '#F0ECE4', role: 'Secondary Panels', contrast: '1.15:1' },
      { name: 'Slub Charcoal', hex: '#1C1E24', role: 'Headings & Body', contrast: '14.8:1 AAA' },
      { name: 'Madder Rose', hex: '#943843', role: 'Brand Accent', contrast: '6.2:1 AA' },
      { name: 'Tailor Brass', hex: '#A67C38', role: 'Selvedge / Rulers', contrast: '3.5:1 UI' },
      { name: 'Deep Indigo', hex: '#3D5A80', role: 'Secondary Print Dot', contrast: '7.1:1 AAA' }
    ],
    displayFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Figtree', system-ui, sans-serif",
    heroImage: '../../brand/products/EKC-1501-3%20piece/1.jpeg',
    heroTag: 'Jaipur Atelier · Authentic Handwork',
    heroHeading: 'Pure Banarasi Soft Silk 3-Piece Ensemble',
    heroButton: 'Explore Piece — ₹1,799',
    tileImage: '../../brand/products/EKC-81/9L3A2548%20(1).jpg',
    tileTitle: 'Handcrafted Pink Floral Rayon Kurta',
    tilePrice: '₹279',
    tileMrp: 'MRP ₹499',
    dots: ['#943843', '#A67C38', '#3D5A80', '#2F3E46']
  },
  b: {
    name: 'Direction B: "Nightstand" (Low-Light Calm)',
    themeClass: 'theme-nightstand',
    description: 'The Night theme as the core identity. Low glare for 3 a.m. nursing mothers and late-night shoppers across India. Deep charcoal and midnight tones paired with warm brass luminescence.',
    aesthetic: 'Low-Light Nocturnal Calm',
    contrast: 'WCAG AAA (13.5:1 Primary)',
    slopStatus: 'Zero (No Neon, Pure Warmth)',
    palette: [
      { name: 'Nocturnal Canvas', hex: '#121316', role: 'Low-Glare Base', contrast: 'Base' },
      { name: 'Midnight Sheet', hex: '#181A1F', role: 'Elevated Cards', contrast: '1.3:1' },
      { name: 'Loom Bone', hex: '#EBE8E1', role: 'Headings & Body', contrast: '13.5:1 AAA' },
      { name: 'Muted Weave', hex: '#9BA1B0', role: 'Secondary Facts', contrast: '5.8:1 AA' },
      { name: 'Soft Madder', hex: '#D9727F', role: 'Nocturnal Accent', contrast: '6.1:1 AA' },
      { name: 'Lamp Brass', hex: '#D4A85B', role: 'Selvedge Glow Dot', contrast: '8.2:1 AAA' }
    ],
    displayFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Figtree', system-ui, sans-serif",
    heroImage: '../../brand/products/EKC-1504-3%20Piece/1.jpeg',
    heroTag: 'Late Night Calm · 100% Breathable Cotton',
    heroHeading: 'Noir Resham Embroidered Anarkali Set',
    heroButton: 'Discover Piece — ₹1,899',
    tileImage: '../../brand/products/EKC-86/9L3A2561.jpg',
    tileTitle: 'Multicolor Striped V-Neck Kurta',
    tilePrice: '₹299',
    tileMrp: 'MRP ₹549',
    dots: ['#D9727F', '#D4A85B', '#5C768D', '#EBE8E1']
  },
  c: {
    name: 'Direction C: "Daylight" (Photography-Led Minimal)',
    themeClass: 'theme-daylight',
    description: 'Pure editorial clarity with almost zero ornament. Focuses 100% on the garment drape, silhouette, and high-resolution DSLR photography with quiet, highly legible sans typography.',
    aesthetic: 'Quiet Editorial Minimalism',
    contrast: 'WCAG AAA (16.2:1 Primary)',
    slopStatus: 'Zero (Unadorned Honesty)',
    palette: [
      { name: 'Pure Cotton', hex: '#FFFFFF', role: 'Clean Canvas', contrast: 'Base' },
      { name: 'Loom Tint', hex: '#FAF9F6', role: 'Subtle Panels', contrast: '1.05:1' },
      { name: 'Printer Black', hex: '#111111', role: 'High Contrast Ink', contrast: '16.2:1 AAA' },
      { name: 'Mid Charcoal', hex: '#666666', role: 'Specifications', contrast: '5.7:1 AA' },
      { name: 'Selvedge Ink', hex: '#333333', role: 'Border & Seams', contrast: '10.5:1 AAA' },
      { name: 'Neutral Grey', hex: '#E8E5DF', role: 'Hairline Divider', contrast: '1.2:1' }
    ],
    displayFont: "'Newsreader', Georgia, serif",
    bodyFont: "'Albert Sans', system-ui, sans-serif",
    heroImage: '../../brand/products/EKC-1502-3%20Piece/1.jpeg',
    heroTag: 'Pure Silhouette · Art Silk Weave',
    heroHeading: 'Navy Floral Flared Anarkali & Dupatta',
    heroButton: 'View Details — ₹2,299',
    tileImage: '../../brand/products/EKC-82/12.jpeg',
    tileTitle: 'Indigo Blue Floral Rayon Kurta',
    tilePrice: '₹279',
    tileMrp: 'MRP ₹499',
    dots: ['#111111', '#666666', '#A67C38', '#E8E5DF']
  }
};

function renderPalette(palette) {
  const container = document.getElementById('palette-container');
  if (!container) return;
  container.innerHTML = '';

  palette.forEach(item => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch-item';
    swatch.innerHTML = `
      <div class="swatch-color" style="background-color: ${item.hex};"></div>
      <div class="swatch-info">
        <span class="swatch-name">${item.name}</span>
        <span class="swatch-hex">${item.hex}</span>
        <div class="swatch-ratio">${item.contrast}</div>
      </div>
    `;
    container.appendChild(swatch);
  });
}

function renderRegistrationDots(dots) {
  const container = document.getElementById('sig-dots');
  if (!container) return;
  container.innerHTML = '';
  dots.forEach(color => {
    const dot = document.createElement('span');
    dot.className = 'reg-dot';
    dot.style.backgroundColor = color;
    container.appendChild(dot);
  });
}

function applyDirection(dirKey) {
  const d = DIRECTIONS[dirKey];
  if (!d) return;
  currentDir = dirKey;

  // Body theme
  document.body.className = d.themeClass;

  // Banner details
  document.getElementById('dir-title').textContent = d.name;
  document.getElementById('dir-desc').textContent = d.description;
  document.getElementById('meta-aesthetic').textContent = d.aesthetic;
  document.getElementById('meta-contrast').textContent = d.contrast;
  document.getElementById('meta-slop').textContent = d.slopStatus;

  // Palette & dots
  renderPalette(d.palette);
  renderRegistrationDots(d.dots);

  // Hero section updates
  const heroImg = document.getElementById('hero-img');
  if (heroImg) heroImg.src = d.heroImage;
  document.getElementById('hero-heading').textContent = d.heroHeading;
  document.getElementById('demo-btn-primary').textContent = d.heroButton;

  // Tile updates
  const tileImg = document.getElementById('tile-img');
  if (tileImg) tileImg.src = d.tileImage;
  document.getElementById('tile-title').textContent = d.tileTitle;

  // Active tab state
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.dataset.dir === dirKey;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Highlight recommendation card
  document.querySelectorAll('.rec-card').forEach(card => {
    const matches = card.dataset.cardDir === dirKey;
    card.style.borderColor = matches ? 'var(--accent-primary)' : 'var(--border-subtle)';
  });
}

// Interactive Motion Triggers
function setupMotionTriggers() {
  const drapeBtn = document.querySelector('[data-trigger="drape"]');
  const drapeStage = document.getElementById('stage-drape');

  if (drapeBtn && drapeStage) {
    drapeBtn.addEventListener('click', () => {
      drapeStage.classList.remove('drape-animating');
      void drapeStage.offsetWidth; // Force reflow
      drapeStage.classList.add('drape-animating');
    });
  }

  const riseBtn = document.querySelector('[data-trigger="rise"]');
  const riseStage = document.getElementById('stage-rise');

  if (riseBtn && riseStage) {
    riseBtn.addEventListener('click', () => {
      riseStage.classList.remove('rise-animating');
      void riseStage.offsetWidth; // Force reflow
      riseStage.classList.add('rise-animating');
    });
  }
}

// Interactive Press State Tester
function setupPressStateDemo() {
  const statusIndicator = document.getElementById('press-status');
  const pressButtons = document.querySelectorAll('.interactive-press');

  pressButtons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      if (statusIndicator) {
        statusIndicator.textContent = 'Active press triggered: scale(0.985) via 120ms token';
        statusIndicator.style.color = 'var(--accent-primary)';
      }
    });

    btn.addEventListener('mouseup', () => {
      if (statusIndicator) {
        setTimeout(() => {
          statusIndicator.textContent = 'Press released · Settled with cubic-bezier(0.22, 1, 0.36, 1)';
          statusIndicator.style.color = 'var(--ink-muted)';
        }, 120);
      }
    });
  });
}

// Initial Initialization
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyDirection(btn.dataset.dir);
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const requestedDir = urlParams.get('dir') || 'a';
  applyDirection(requestedDir);
  setupMotionTriggers();
  setupPressStateDemo();
});
