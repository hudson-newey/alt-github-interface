import { GITHUB_TOKEN } from '$env/static/private';

const API_BASE_URL = 'https://api.github.com';
const USER_AGENT = 'fast-github-interface';

interface GitHubErrorBody {
	message?: string;
	documentation_url?: string;
}

function ensureToken() {
	if (!GITHUB_TOKEN) {
		throw new Error('Missing GITHUB_TOKEN in environment.');
	}
}

function mergeHeaders(init?: RequestInit['headers']): Headers {
	const headers = new Headers(init);

	headers.set('Accept', 'application/vnd.github+json');
	headers.set('Authorization', `Bearer ${GITHUB_TOKEN}`);
	headers.set('User-Agent', USER_AGENT);

	return headers;
}

export async function githubFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
	ensureToken();

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: mergeHeaders(init.headers)
	});

	const rawBody = await response.text();
	let parsed: unknown = null;

	if (rawBody) {
		try {
			parsed = JSON.parse(rawBody);
		} catch (parseError) {
			throw new Error(`GitHub response was not valid JSON: ${String(parseError)}`);
		}
	}

	if (!response.ok) {
		const details = (parsed as GitHubErrorBody | null)?.message ?? response.statusText;
		throw new Error(`GitHub API error (${response.status}): ${details}`);
	}

	return parsed as T;
}
