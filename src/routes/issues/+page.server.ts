import type { PageServerLoad } from './$types';
import { listMyIssues } from '$lib/server/github/issues';
import type { ContentItem } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	try {
		const issues = await listMyIssues({ perPage: 30 });
		const items: ContentItem[] = issues.map((issue) => ({
			id: issue.id,
			title: issue.title,
			url: issue.htmlUrl,
			href: `/issues/${issue.repo.owner}/${issue.repo.name}/${issue.number}`,
			repo: `${issue.repo.owner}/${issue.repo.name}`,
			updatedAt: issue.updatedAt,
			status: issue.state,
			badge: 'Issue',
			typeLabel: 'Issue',
			meta: issue.body ?? undefined
		}));

		return { items, error: null as string | null };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unable to load issues.';
		return { items: [], error: message };
	}
};
