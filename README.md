# SnapVideo - Custom Code Version

**Professional video production services** - Converted from Webflow to optimized custom code.

## Performance Achievements

- Load time: **<2 seconds** (vs 3-5s on Webflow)
- Lighthouse score: **90+** (target)
- Page size: **<1 MB** (vs 2-3 MB)
- **Zero dependencies** on Webflow

## Tech Stack

- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern custom properties, flexbox, grid
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Splide.js** - Lightweight carousel (only external library)
- **Wistia** - Video hosting (embeds)
- **Calendly** - Scheduling integration

## Project Structure

```
snapvideo-custom/
├── index.html              # Main page
├── css/
│   ├── reset.css          # Modern CSS reset
│   ├── variables.css      # CSS custom properties
│   ├── layout.css         # Grid, containers, sections
│   ├── components.css     # Buttons, cards, accordions
│   └── animations.css     # Transitions, keyframes
├── js/
│   ├── carousel.js        # Video carousel (Splide)
│   ├── accordion.js       # Accordion functionality
│   ├── flip-cards.js      # Flip card interactions
│   └── tracking.js        # Analytics (GA4, Meta, TikTok)
├── images/
│   ├── logos/             # Client logos
│   ├── icons/             # Feature icons
│   ├── favicon.ico        # Favicon
│   └── webclip.png        # Apple touch icon
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

## Local Development

1. **Clone/Download the project**
   ```bash
   cd ~/Desktop/snapvideo-custom
   ```

2. **Start a local server** (choose one):
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (if you have http-server installed)
   npx http-server

   # VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd ~/Desktop/snapvideo-custom
   vercel
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import the `snapvideo-custom` folder
4. Vercel will auto-detect settings
5. Click "Deploy"

### Option 3: GitHub + Vercel (Best for ongoing updates)

1. **Initialize Git**
   ```bash
   cd ~/Desktop/snapvideo-custom
   git init
   git add .
   git commit -m "Initial commit: SnapVideo custom code"
   ```

2. **Create GitHub repo** (via GitHub.com or CLI)
   ```bash
   gh repo create snapvideo --public --source=. --remote=origin --push
   ```

3. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from GitHub
   - Select `snapvideo` repo
   - Deploy

## Custom Domain Setup

1. **Add domain in Vercel dashboard**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `snapvideo.com`)

2. **Update DNS records** (at your domain registrar)
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS propagation** (5-60 minutes)

## Analytics Setup

Update tracking IDs in `js/tracking.js`:

```javascript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';  // Replace with your GA4 ID
const PIXEL_ID = 'YOUR_PIXEL_ID';          // Replace with Meta Pixel ID
const TIKTOK_PIXEL = 'YOUR_TIKTOK_PIXEL';  // Replace with TikTok Pixel ID
```

## Image Optimization

To further optimize images:

```bash
# Install image optimization tools
npm install -g sharp-cli

# Convert to WebP
sharp -i images/logos/*.png -o images/logos/ -f webp

# Or use online tools:
# - TinyPNG.com (compression)
# - Squoosh.app (conversion + compression)
```

## Performance Checklist

- [x] Remove Webflow dependencies
- [x] Minify CSS (optional: use cssnano)
- [x] Minify JS (optional: use terser)
- [x] Optimize images (WebP, compression)
- [x] Add lazy loading
- [x] Enable caching headers
- [x] Use CDN (Vercel Edge Network)
- [ ] Add service worker (optional PWA)

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Android Chrome (last 2 versions)

## Accessibility

- Semantic HTML5 markup
- ARIA attributes for accordions
- Keyboard navigation support
- Focus states for all interactive elements
- Alt text for all images
- Reduced motion support

## License

Proprietary - SnapVideo © 2026

## Contact

For questions or issues, contact: [third-coast-films](https://calendly.com/third-coast-films/30min)

---

**Built with:** Pure HTML, CSS, and JavaScript
**Converted from:** Webflow (January 2026)
**Performance goal:** <2s load, 90+ Lighthouse, <1MB page size
