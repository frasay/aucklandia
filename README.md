# Aucklandia

An independent Auckland journal by Guy Fraser. Warm paper, oversized editorial typography, original illustrated postcards, field notes and a small cinema.

## What is here

A complete static website — no npm, framework, database, subscription or build step.

- `index.html` — homepage structure, introduction, about and footer copy.
- `styles.css` — responsive layout, colours, typography and animation.
- `content.js` — **edit this to add articles and YouTube films.**
- `app.js` — article rendering, filters, shareable story views, video modal and interactions.
- `assets/` — original SVG illustrations and favicon. Add your own photographs here.
- `.nojekyll` — tells GitHub Pages to serve these files without Jekyll.

The supplied writing is clearly marked **sample writing**, not published work by Guy. Replace or remove it when ready. The film is Guy's real *Slit scan*, YouTube ID `qgk3I9wtoms`; its description comes from the YouTube listing. Illustrations are stylised original artwork, not documentary photographs.

## Publish on GitHub Pages

1. Open this repository → **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then **Save**.
4. Wait for the Pages deployment to finish (see the Actions tab).
5. Open **https://frasay.github.io/aucklandia/**.

A repository commit alone does NOT enable Pages. If you see a GitHub 404, check these settings and the deployment status. All site links and assets are relative so this works under `/aucklandia/` and on a future custom domain.

## Edit an existing article

Open `content.js` in GitHub, click the pencil, make changes, and **Commit changes** to `main`. Pages will redeploy after commits if enabled. Keep quotes and commas intact. Use double quotes inside a single-quoted string, or escape an apostrophe as `\'`. Text is rendered as text, never injected as HTML.

Each item in `articles` contains its own content. `sample: true` shows the preview-copy labels. When you replace an entire sample article with your own work, set `sample: false` and optionally add `author` and `date`.

## Add an article (copy this)

Copy this object inside the `articles: [ ... ]` array in `content.js`, above the other objects if you want it first. Separate objects with commas. Do not put it in the `videos` array.

```javascript
{
  slug: 'a-walk-around-auckland',
  title: 'A walk around Auckland.',
  category: 'City life',
  minutes: 4,
  image: 'assets/my-auckland-photo.jpg',
  imageAlt: 'Describe what is actually visible in the photograph.',
  visual: 'harbour',
  sample: false,
  author: 'Guy Fraser',
  date: '24 September 2026',
  excerpt: 'A short introduction for the homepage and article header.',
  paragraphs: [
    'Your opening paragraph goes here.',
    'Your next paragraph goes here.',
    'And another paragraph. No HTML is needed.'
  ]
},
```

- Every slug must be unique and use lowercase letters, numbers and hyphens.
- Keep a published slug unchanged so shared links keep working.
- Categories currently supported by the filter buttons: `City life` and `Small escapes`.
- `minutes` is an editorial estimate; update it yourself.
- Each string in `paragraphs` becomes one paragraph.
- An article URL is `https://frasay.github.io/aucklandia/?story=a-walk-around-auckland`.
- The optional `visual` value adds an image styling class. Omit it for normal images.
- To add another filter category, duplicate a filter button in `index.html` and change its `data-filter` value and label to match your new category exactly. All entries always appear under Everything.
- Remove an article by deleting its complete object, keeping the surrounding array and commas valid.

### Images

Upload images with GitHub's **Add file → Upload files** into `assets/`. Prefer WebP or JPEG, about 1600px wide and ideally under 300KB. Use descriptive lowercase filenames without spaces. Set `image` to `assets/your-file.webp` and write helpful `imageAlt` text. Use only imagery you own or have permission to publish. Images are cropped on cards, so keep the main subject near the centre. The original SVGs can be used as long as you like.

To change the main homepage artwork, replace the `src` and `alt` on the image in `index.html` inside `class="hero-art"`. Update its `width`/`height` attributes to your image dimensions and the nearby illustration credit. The CSS controls its displayed size.

## Add a YouTube film

Copy this object inside `videos: [ ... ]` in `content.js`:

```javascript
{
  youtubeId: 'qgk3I9wtoms',
  title: 'Your film title',
  subtitle: 'A short, evocative subtitle.',
  location: 'Auckland, New Zealand',
  duration: '6:33',
  credit: 'A film by Guy Fraser',
  description: 'One or two sentences about the film.'
},
```

Replace `youtubeId` with the 11-character ID from your video URL, NOT the whole URL. For `https://youtu.be/qgk3I9wtoms`, it is `qgk3I9wtoms`. Use your video's real duration. Thumbnails load from YouTube; there is no video upload to this repository. The privacy-enhanced YouTube player is created only after a visitor clicks play. Escape, Close, and a click outside the modal stop playback and restore keyboard focus. A direct YouTube link is available if playback is blocked. Embedding must be allowed in YouTube Studio; some browsers/network policies can also block playback or autoplay.

## Edit the homepage and look

In `index.html`, edit the hero heading, introduction, about section and closing message directly. Keep the IDs (`journal`, `cinema`, `about`) so navigation keeps working. In `styles.css`, the `:root` variables define the palette. No newsletter or contact form is included: nothing pretends to collect information without a backend.

Typography uses Google Fonts (Manrope and DM Sans) with system fallbacks. Fonts are optional for functionality. The marquee and reveal animations respect **prefers-reduced-motion**. There is no scroll hijacking or custom cursor. The site includes a skip link, labelled video dialog, visible focus states and responsive mobile layouts.

## Preview locally

Download the repo and serve its directory with any static server. If Python 3 is installed:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. No dependencies to install. Opening `index.html` directly is enough for a basic preview, but a local server behaves more like the real site. Clipboard sharing may require HTTPS or localhost.

## Connect aucklandia.com later

No custom domain or CNAME is set by this build.

1. Follow GitHub's current guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
2. Verify domain ownership in GitHub if available, then add `aucklandia.com` in **Settings → Pages → Custom domain**.
3. At your DNS provider, configure the apex records using the current GitHub Pages IP addresses listed in the guide. Set `www` to the GitHub-provided target if using that subdomain. Do not point a CNAME to a URL containing `/aucklandia/`.
4. Wait for DNS/certificate provisioning and enable **Enforce HTTPS**.
5. Recheck navigation, images and story links at the custom domain. New copied story links will automatically use that domain.

## Search engines and limitations

The homepage has a title, description and basic Open Graph tags. Story titles and descriptions update in the browser. Since articles are client-rendered query-string views, social crawlers that do not execute JavaScript will see the homepage metadata rather than article-specific previews. This is a deliberate simple-editing trade-off, not a full publishing CMS. If independent article SEO/social cards become important, migrate to generated static article pages or a CMS. There are no analytics, cookies set by our own code, user accounts or tracking scripts. Google Fonts and YouTube thumbnails make external requests; playing a film contacts YouTube. Consider self-hosted fonts and thumbnails if stricter privacy is required.

## Before launch / after an edit

- Replace or approve the clearly labelled sample articles and homepage copy.
- Check images and their alt text, spelling and content rights.
- Check every category filter and each article link; refresh a story URL directly.
- Play the film; test Escape and Close. Confirm the player disappears when closed.
- Check mobile portrait and landscape; keyboard Tab navigation; reduced-motion settings.
- Check the browser console and Network tab for errors and missing files.
- Enable Pages and verify the real public deployment. A repository preview is not deployment verification.

Content is yours to edit. Keep building the view from here.
