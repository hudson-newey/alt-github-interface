import { githubFetch } from './client';
import { parseRepoFromUrl } from './repos-util';

const DEFAULT_PAGE_SIZE = 30;

interface SearchDiscussionItem {
	id: number;
	number: number;
	title: string;
	html_url: string;
	updated_at: string;
	state: 'open' | 'closed';
	repository_url: string;
	body?: string;
	user: {
		login: string;
		avatar_url: string;
	};
}

interface SearchDiscussionsResponse {
	items: SearchDiscussionItem[];
}

export interface DiscussionSummary {
	id: number;
	number: number;
	title: string;
	htmlUrl: string;
	updatedAt: string;
	state: 'open' | 'closed';
	repo: {
		owner: string;
		name: string;
	};
	author: {
		login: string;
		avatarUrl: string;
	};
	body?: string;
}

function mapToSummary(item: SearchDiscussionItem): DiscussionSummary {
	const repo = parseRepoFromUrl(item.repository_url);

	return {
		id: item.id,
		number: item.number,
		title: item.title,
		htmlUrl: item.html_url,
		updatedAt: item.updated_at,
		state: item.state,
		repo,
		author: {
			login: item.user.login,
			avatarUrl: item.user.avatar_url
		},
		body: item.body
	};
}

export async function listMyDiscussions({ perPage = DEFAULT_PAGE_SIZE } = {}): Promise<DiscussionSummary[]> {
	const query = encodeURIComponent('is:discussion involves:@me archived:false');
	const path = `/search/issues?q=${query}&sort=updated&order=desc&per_page=${perPage}`;
	const response = await githubFetch<SearchDiscussionsResponse>(path);

	return response.items.map(mapToSummary);
}
