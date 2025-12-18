import { githubFetch } from './client';

interface RepoSummaryResponse {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	owner: {
		login: string;
	};
	updated_at: string;
	private: boolean;
	description: string | null;
}

export interface RepoSummary {
	id: number;
	name: string;
	owner: string;
	fullName: string;
	htmlUrl: string;
	updatedAt: string;
	private: boolean;
	description: string | null;
}

export async function listRecentlyUsedRepos({ perPage = 12 } = {}): Promise<RepoSummary[]> {
	const path = `/user/repos?sort=updated&direction=desc&per_page=${perPage}`;
	const repos = await githubFetch<RepoSummaryResponse[]>(path);

	return repos.map((repo) => ({
		id: repo.id,
		name: repo.name,
		owner: repo.owner.login,
		fullName: repo.full_name,
		htmlUrl: repo.html_url,
		updatedAt: repo.updated_at,
		private: repo.private,
		description: repo.description
	}));
}
