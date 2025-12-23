# Alt GitHub Interface

SvelteKit + Tailwind playground for a faster GitHub view. The home page lists your pull requests sorted by last update using the GitHub REST API.

## GitHub API setup

Create a `.env` file and add a personal access token with `repo` scope so we can call the GitHub API server-side:

```sh
GITHUB_TOKEN=ghp_...
```

The token is only read on the server via `$env/static/private`.

## Developing

Once you've created a project and installed dependencies with `deno  install`

```sh
$ deno dev
>
```
