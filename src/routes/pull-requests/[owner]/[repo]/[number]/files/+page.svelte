<script lang="ts">
	import type { PageData } from './$types';
	import DiffView from '$lib/components/DiffView.svelte';
	import PullRequestNav from '$lib/components/PullRequestNav.svelte';

	const { data } = $props<{ data: PageData }>();
	const { pullRequest, files } = data;
	const basePath = `/pull-requests/${pullRequest.repo.owner}/${pullRequest.repo.name}/${pullRequest.number}`;
</script>

<svelte:head>
	<title>File Changes · PR #{pullRequest.number}</title>
</svelte:head>

<section class="page">
	<PullRequestNav pullRequest={pullRequest} active="files" basePath={basePath} />

	<div class="header">
		<div>
			<p class="eyebrow">{pullRequest.repo.owner}/{pullRequest.repo.name}</p>
			<h1 class="title">File Changes</h1>
			<p class="meta">PR #{pullRequest.number} · {files.length} file{files.length === 1 ? '' : 's'}</p>
		</div>
	</div>

	{#if files.length === 0}
		<p class="empty">No file changes found for this pull request.</p>
	{:else}
		<div class="diff-grid">
			{#each files as file (file.sha)}
				<DiffView file={file} />
			{/each}
		</div>
	{/if}
</section>

<style>
	:global(body) {
		background: #0e0e10;
		color: #f7f7f7;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
	}

	.page {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		min-height: 100vh;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		margin-bottom: 4px;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 12px;
		color: #8a8a8f;
		margin: 0 0 6px;
	}

	.title {
		margin: 0;
		font-size: 26px;
		line-height: 1.2;
	}

	.meta {
		margin: 8px 0 0;
		color: #9c9ca3;
		font-size: 14px;
	}

	.diff-grid {
		display: grid;
		gap: 14px;
	}

	.empty {
		margin: 0;
		padding: 1rem;
		border: 1px dashed #303038;
		border-radius: 12px;
		color: #9ca3af;
		background: rgba(255, 255, 255, 0.02);
	}

	@media (max-width: 720px) {
		.header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
