# Fast GitHub Interface

SvelteKit + Tailwind playground for a faster GitHub view. The home page lists your pull requests sorted by last update using the GitHub REST API.

## GitHub API setup

Create a `.env` file and add a personal access token with `repo` scope so we can call the GitHub API server-side:

```sh
GITHUB_TOKEN=ghp_...
```

The token is only read on the server via `$env/static/private`.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
