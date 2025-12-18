import { githubFetch } from './client';
import { parseRepoFromUrl } from './repos-util';
import type { Comment } from '$lib/types/comment';

const DEFAULT_PAGE_SIZE = 30;

interface SearchPullRequestItem {
	id: number;
	number: number;
	title: string;
	html_url: string;
	updated_at: string;
	state: 'open' | 'closed';
	draft?: boolean;
	repository_url: string;
	user: {
		login: string;
		avatar_url: string;
	};
	pull_request: {
		url: string;
		html_url: string;
	};
}

interface SearchPullRequestsResponse {
	items: SearchPullRequestItem[];
}

export interface PullRequestSummary {
	id: number;
	number: number;
	title: string;
	htmlUrl: string;
	updatedAt: string;
	state: 'open' | 'closed';
	draft: boolean;
	repo: {
		owner: string;
		name: string;
	};
	author: {
		login: string;
		avatarUrl: string;
	};
}

interface PullRequestResponse {
	id: number;
	number: number;
	title: string;
	body: string | null;
	state: 'open' | 'closed';
	draft: boolean;
	html_url: string;
	user: {
		login: string;
		avatar_url: string;
	};
	comments: number;
	repository: {
		owner: { login: string };
		name: string;
	};
	updated_at: string;
	created_at: string;
}

interface PullRequestCommentResponse {
	id: number;
	body: string;
	user: {
		login: string;
		avatar_url: string;
	};
	created_at: string;
	updated_at: string;
}

export interface PullRequestDetails extends PullRequestSummary {
	body: string | null;
	commentCount: number;
	createdAt: string;
}

export interface PullRequestFile {
	sha: string;
	filename: string;
	status: string;
	additions: number;
	deletions: number;
	changes: number;
	patch?: string;
}

function mapToSummary(item: SearchPullRequestItem): PullRequestSummary {
	const repo = parseRepoFromUrl(item.repository_url);

	return {
		id: item.id,
		number: item.number,
		title: item.title,
		htmlUrl: item.html_url,
		updatedAt: item.updated_at,
		state: item.state,
		draft: Boolean(item.draft),
		repo,
		author: {
			login: item.user.login,
			avatarUrl: item.user.avatar_url
		}
	};
}

export async function listMyPullRequests({ perPage = DEFAULT_PAGE_SIZE } = {}): Promise<PullRequestSummary[]> {
	const query = encodeURIComponent('is:pr author:@me archived:false');
	const path = `/search/issues?q=${query}&sort=updated&order=desc&per_page=${perPage}`;
	const response = await githubFetch<SearchPullRequestsResponse>(path);

	return response.items.map(mapToSummary);
}

export async function getPullRequest(params: {
	owner: string;
	repo: string;
	number: number;
}): Promise<PullRequestDetails> {
	const { owner, repo, number } = params;
	const pr = await githubFetch<PullRequestResponse>(`/repos/${owner}/${repo}/pulls/${number}`);

	return {
		id: pr.id,
		number: pr.number,
		title: pr.title,
		htmlUrl: pr.html_url,
		updatedAt: pr.updated_at,
		state: pr.state,
		draft: pr.draft,
		repo: { owner, name: repo },
		author: {
			login: pr.user.login,
			avatarUrl: pr.user.avatar_url
		},
		body: pr.body,
		commentCount: pr.comments,
		createdAt: pr.created_at
	};
}

export async function listPullRequestFiles(params: {
	owner: string;
	repo: string;
	number: number;
}): Promise<PullRequestFile[]> {
	const { owner, repo, number } = params;
	const files = await githubFetch<
		Array<
			{
				sha: string;
				filename: string;
				status: string;
				additions: number;
				deletions: number;
				changes: number;
				patch?: string;
			}
		>
	>(`/repos/${owner}/${repo}/pulls/${number}/files?per_page=100`);

	return files.map((file) => ({
		sha: file.sha,
		filename: file.filename,
		status: file.status,
		additions: file.additions,
		deletions: file.deletions,
		changes: file.changes,
		patch: file.patch
	}));
}

export async function listPullRequestComments(params: {
	owner: string;
	repo: string;
	number: number;
}): Promise<Comment[]> {
	const { owner, repo, number } = params;
	const comments = await githubFetch<PullRequestCommentResponse[]>(
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
