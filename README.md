# Orizzonte Scudetto

A lightweight static React app for presenting manually entered Bayesian title-winning probabilities as an editorial-style visual experience.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. If you want to preview it from a local server before deploying, expose Vite on localhost and open the URL shown in terminal:

```bash
npm run dev -- --host 127.0.0.1
```

4. Build for production:

```bash
npm run build
```

## Edit the data

All content lives in local JSON so you can update the app without touching the components.

Main file:

- `src/data/seasons/serie-a-2025.json`

The structure is:

```json
{
  "competition": "Serie A",
  "season": "2025-26",
  "hero": {
    "title": "Orizzonte Scudetto",
    "subtitle": "Optional hero text"
  },
  "matchdays": [
    {
      "id": 28,
      "label": "After Matchday 28",
      "date": "2026-03-20",
      "storyTitle": "Optional section title",
      "note": "Editorial summary for this snapshot",
      "summaryStats": [
        { "label": "Lead favourite", "value": "Inter 54%" }
      ],
      "teams": [
        {
          "name": "Inter",
          "shortName": "INT",
          "probability": 0.54,
          "projectedPoints": 84,
          "color": "#6EC5FF"
        }
      ]
    }
  ]
}
```

Notes:

- `probability` should be entered as a decimal between `0` and `1`.
- Team colors are optional but strongly recommended.
- `summaryStats`, `storyTitle`, and `note` are optional.
- The app uses the `id` field to build the matchday slider and the shareable URL query param, for example `?matchday=28`.
- Make sure the probabilities for a matchday sum to roughly `1.0` for the cleanest multiverse split.

## Deploy for free

This project is fully static and works well on:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

Typical flow:

1. Push the project to GitHub.
2. Import the repo into Vercel or Netlify.
3. Use the default build settings:
   - Build command: `npm run build`
   - Output directory: `dist`

For GitHub Pages, you can build with `npm run build` and publish the generated `dist` folder.

## Deploy on Vercel

Recommended setup for this project:

1. Create a GitHub repository and push this project.
2. Go to [Vercel](https://vercel.com/).
3. Click `Add New...` -> `Project`.
4. Import the GitHub repository.
5. Keep the default Vite settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
6. Click `Deploy`.

After that, every new push to GitHub will automatically publish an updated version.

## Project structure

```text
src/
  components/
    EvolutionChart.jsx
    Hero.jsx
    MatchdaySelector.jsx
    MultiverseView.jsx
    NarrativeNote.jsx
    TeamTable.jsx
  data/
    seasons/
      serie-a-2025.json
  utils/
    dataHelpers.js
  App.jsx
  main.jsx
  styles.css
```

## MVP features

- Static JSON-driven content
- Matchday slider plus previous/next controls
- Shareable selected matchday via query params
- 100-particle multiverse visualization
- Ranked probability table with matchday delta
- Lightweight SVG evolution chart with team toggles
- Responsive, screenshot-friendly dark editorial design
