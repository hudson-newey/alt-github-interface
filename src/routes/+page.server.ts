import type { PageServerLoad } from './$types';
import { listRecentlyUsedRepos } from '$lib/server/github/repos';

export const load: PageServerLoad = async () => {
	try {
		const repos = await listRecentlyUsedRepos({ perPage: 12 });
		return { repos, error: null as string | null };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unable to load repositories.';
		return { repos: [], error: message };
	}
};
