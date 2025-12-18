import { json, error } from '@sveltejs/kit';
import { addPullRequestComment } from '$lib/server/github/pull-requests';

export const POST = async ({ params, request }) => {
	const { owner, repo, number } = params;
	const bodyJson = await request.json().catch(() => null);
	const body = typeof bodyJson?.body === 'string' ? bodyJson.body.trim() : '';

	if (!body) {
		throw error(400, 'Comment body is required');
	}

	try {
		const comment = await addPullRequestComment({ owner, repo, number: Number(number), body });
		return json({ success: true, comment });
	} catch (err) {
		console.error('Failed to post pull request comment', err);
		throw error(500, 'Failed to post comment');
	}
};
