import { githubFetch } from './client';
import { parseRepoFromUrl } from './repos-util.ts';
import type { Comment } from '$lib/types/comment';

const DEFAULT_PAGE_SIZE = 30;

interface SearchIssueItem {
	id: number;
	number: number;
	title: string;
	html_url: string;
	updated_at: string;
	state: 'open' | 'closed';
	repository_url: string;
	user: {
		login: string;
		avatar_url: string;
	};
	body?: string;
}

interface SearchIssuesResponse {
	items: SearchIssueItem[];
}

interface IssueResponse {
	id: number;
	number: number;
	title: string;
	body: string | null;
	state: 'open' | 'closed';
	html_url: string;
	user: {
		login: string;
		avatar_url: string;
	};
	comments: number;
	repository_url: string;
	updated_at: string;
	created_at: string;
}

interface IssueCommentResponse {
	id: number;
	body: string;
	user: {
		login: string;
		avatar_url: string;
	};
	created_at: string;
	updated_at: string;
}

export interface IssueSummary {
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

export interface IssueDetails extends IssueSummary {
	body: string | null;
	commentCount: number;
	createdAt: string;
}

function mapToSummary(item: SearchIssueItem): IssueSummary {
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

export async function listMyIssues({ perPage = DEFAULT_PAGE_SIZE } = {}): Promise<IssueSummary[]> {
	const query = encodeURIComponent('is:issue involves:@me archived:false');
	const path = `/search/issues?q=${query}&sort=updated&order=desc&per_page=${perPage}`;
	const response = await githubFetch<SearchIssuesResponse>(path);

	return response.items.map(mapToSummary);
}

export async function getIssue(params: {
	owner: string;
	repo: string;
	number: number;
}): Promise<IssueDetails> {
	const { owner, repo, number } = params;
	const data = await githubFetch<IssueResponse>(`/repos/${owner}/${repo}/issues/${number}`);

	return {
		id: data.id,
		number: data.number,
		title: data.title,
		htmlUrl: data.html_url,
		updatedAt: data.updated_at,
		state: data.state,
		repo: { owner, name: repo },
		author: {
			login: data.user.login,
			avatarUrl: data.user.avatar_url
		},
		body: data.body,
		commentCount: data.comments,
		createdAt: data.created_at
	};
}

export async function listIssueComments(params: {
	owner: string;
	repo: string;
	number: number;
}): Promise<Comment[]> {
	const { owner, repo, number } = params;
	const comments = await githubFetch<IssueCommentResponse[]>(
		`/repos/${owner}/${repo}/issues/${number}/comments?per_page=100&sort=created&direction=asc`
	);

	return comments.map((comment) => ({
		id: comment.id,
		body: comment.body,
		author: {
			login: comment.user.login,
			avatarUrl: comment.user.avatar_url
		},
		createdAt: comment.created_at,
		updatedAt: comment.updated_at
	}));
}
