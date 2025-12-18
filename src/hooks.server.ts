import type { Handle, HandleFetch } from '@sveltejs/kit';

// Simple in-memory cache for GitHub API GET requests.
// Cleared on full document loads (page reloads), retained across client navigations.
const apiCache = new Map<string, CachedResponse>();

type CachedResponse = {
	status: number;
	statusText: string;
	headers: [string, string][];
	body: Uint8Array;
};

const isGithubApi = (url: URL) => url.host === 'api.github.com';

const cacheKeyFor = (request: Request) => {
	const url = new URL(request.url);
	const auth = request.headers.get('authorization') ?? 'anon';
	return `${request.method}:${url.toString()}:${auth}`;
};

export const handle: Handle = async ({ event, resolve }) => {
	const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');
	if (event.request.method === 'GET' && acceptsHtml) {
		apiCache.clear();
	}

	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const url = new URL(request.url);
	const isCacheable = request.method === 'GET' && isGithubApi(url);

	if (isCacheable) {
		const key = cacheKeyFor(request);
		const cached = apiCache.get(key);
		if (cached) {
			return new Response(cached.body.slice(0), {
				status: cached.status,
				statusText: cached.statusText,
				headers: cached.headers
			});
		}
	}

	const response = await fetch(request);

	if (isCacheable && response.ok) {
		const clone = response.clone();
		const body = new Uint8Array(await clone.arrayBuffer());
		const headers: [string, string][] = [];
		clone.headers.forEach((value, key) => headers.push([key, value]));

		apiCache.set(cacheKeyFor(request), {
			status: clone.status,
			statusText: clone.statusText,
			headers,
			body
		});
	}

	return response;
};
