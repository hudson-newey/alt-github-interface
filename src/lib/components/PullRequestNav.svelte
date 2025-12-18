<script lang="ts">
	type ActiveTab = 'overview' | 'files';
	type PullRequestRef = { repo: { owner: string; name: string }; number: number };

	let { pullRequest, active, basePath }: { pullRequest: PullRequestRef; active: ActiveTab; basePath?: string } = $props();

	const root = basePath ?? `/pull-requests/${pullRequest.repo.owner}/${pullRequest.repo.name}/${pullRequest.number}`;
</script>

<nav class="tabs" aria-label="Pull request navigation">
	<a href={root} class:active={active === 'overview'}>Overview</a>
	<a href={`${root}/files`} class:active={active === 'files'}>File Changes</a>
</nav>

<style>
	.tabs {
		display: inline-flex;
		gap: 0.75rem;
		padding: 0.25rem;
		border: 1px solid #2d2d32;
		border-radius: 999px;
		background: #151518;
		align-items: center;
	}

	.tabs a {
		padding: 0.45rem 0.95rem;
		border-radius: 999px;
		text-decoration: none;
		color: #c7c7d1;
		font-weight: 600;
		font-size: 0.95rem;
		transition: background 120ms ease, color 120ms ease, transform 120ms ease;
	}

	.tabs a:hover {
		background: #1f1f24;
		color: #f8f8ff;
		transform: translateY(-1px);
	}

	.tabs a.active {
		background: linear-gradient(135deg, #2f2fe4, #7c7cff);
		color: #fff;
	}
</style>
