import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { addPullRequestComment, getPullRequest, listPullRequestComments } from '$lib/server/github/pull-requests';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	const { owner, repo, number } = params;
	const prNumber = Number(number);
	if (Number.isNaN(prNumber)) {
		throw error(400, 'Invalid pull request number');
	}

	try {
		const [pullRequest, comments] = await Promise.all([
			getPullRequest({ owner, repo, number: prNumber, fetch, token: locals.token }),
			listPullRequestComments({ owner, repo, number: prNumber, fetch, token: locals.token })
		]);

		return {
			pullRequest,
			comments
		};
	} catch (err) {
		console.error('Failed to load pull request details', err);
		throw error(500, 'Failed to load pull request details');
	}
};

export const actions: Actions = {
	addComment: async ({ request, params }) => {
		const formData = await request.formData();
		const body = (formData.get('body') ?? '').toString().trim();
		if (!body) {
			throw error(400, 'Comment body is required');
		}

		const { owner, repo, number } = params;
		await addPullRequestComment({ owner, repo, number: Number(number), body });
		return { success: true };
	}
};
