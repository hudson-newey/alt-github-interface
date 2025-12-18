import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { addIssueComment, getIssue, listIssueComments } from '$lib/server/github/issues';

export const load: PageServerLoad = async ({ params }) => {
	const { owner, repo, number } = params;
	const issueNumber = Number(number);

	try {
		const [issue, comments] = await Promise.all([
			getIssue({ owner, repo, number: issueNumber }),
			listIssueComments({ owner, repo, number: issueNumber })
		]);

		return { issue, comments, error: null as string | null };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unable to load issue.';
		return { issue: null, comments: [], error: message };
	}
};

export const actions: Actions = {
	addComment: async ({ request, params }) => {
		const formData = await request.formData();
		const body = (formData.get('body') ?? '').toString().trim();
		if (!body) {
			return fail(400, { message: 'Comment body is required.' });
		}

		const { owner, repo, number } = params;
		try {
			await addIssueComment({ owner, repo, number: Number(number), body });
			return { success: true };
		} catch (error) {
			console.error('Failed to post issue comment', error);
			return fail(500, { message: 'Failed to post comment.' });
		}
	}
};
