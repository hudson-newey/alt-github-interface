import type { PageServerLoad } from './$types';
import { listMyPullRequests } from '$lib/server/github/pull-requests';
import type { ContentItem } from '$lib/types/content';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('query') ?? '';
	try {
		const pullRequests = await listMyPullRequests({ perPage: 30, search });
		const items: ContentItem[] = pullRequests.map((pr) => ({
			id: pr.id,
			title: pr.title,
			url: pr.htmlUrl,
			href: `/pull-requests/${pr.repo.owner}/${pr.repo.name}/${pr.number}`,
			repo: `${pr.repo.owner}/${pr.repo.name}`,
			updatedAt: pr.updatedAt,
			status: pr.state,
			badge: pr.draft ? 'Draft' : undefined,
			typeLabel: 'Pull Request'
		}));

		return { items, error: null as string | null, query: search };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unable to load pull requests.';
		return { items: [], error: message, query: search };
	}
};
