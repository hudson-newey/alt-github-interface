import type { PageServerLoad } from './$types';
import { getIssue, listIssueComments } from '$lib/server/github/issues';

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
