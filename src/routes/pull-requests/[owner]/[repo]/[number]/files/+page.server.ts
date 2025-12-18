import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getPullRequest, listPullRequestFiles } from '$lib/server/github/pull-requests';

export const load: PageServerLoad = async ({ params }) => {
	const { owner, repo, number } = params;
	const prNumber = Number(number);

	if (Number.isNaN(prNumber)) {
		throw error(400, 'Invalid pull request number');
	}

	try {
		const [pullRequest, files] = await Promise.all([
			getPullRequest({ owner, repo, number: prNumber }),
			listPullRequestFiles({ owner, repo, number: prNumber })
		]);

		return { pullRequest, files };
	} catch (err) {
		console.error('Failed to load pull request files', err);
		throw error(500, 'Failed to load pull request files');
	}
};
