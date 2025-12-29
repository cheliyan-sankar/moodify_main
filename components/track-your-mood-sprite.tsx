import fs from 'fs';
import path from 'path';

// Server component that inlines the SVG sprite so <use href="#symbol-id" /> works reliably in all browsers.
export function TrackYourMoodSprite() {
  let svgContent = '';

  try {
    const spritePath = path.join(process.cwd(), 'public', 'track-your-mood.svg');
    svgContent = fs.readFileSync(spritePath, 'utf8');
  } catch (error) {
    console.error('Failed to load track-your-mood.svg sprite:', error);
  }

  if (!svgContent) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      suppressHydrationWarning
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}
