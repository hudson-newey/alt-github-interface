<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import CommentsPanel from '$lib/components/CommentsPanel.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import PullRequestNav from '$lib/components/PullRequestNav.svelte';

	const { data } = $props<{ data: PageData }>();

	const { pullRequest, comments } = data;
	const basePath = `/pull-requests/${pullRequest.repo.owner}/${pullRequest.repo.name}/${pullRequest.number}`;

	const handleSubmit = async (event: CustomEvent<{ body: string }>) => {
		const res = await fetch(`${basePath}/comment`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ body: event.detail.body })
		});
		if (res.ok) {
			await invalidateAll();
		} else {
			console.error('Failed to post comment');
		}
	};
</script>

<svelte:head>
	<title>{pullRequest.title} · PR #{pullRequest.number}</title>
</svelte:head>

<section class="page">
	<PullRequestNav pullRequest={pullRequest} active="overview" basePath={basePath} />

	<div class="panel">
		<header class="panel__header">
			<div>
				<p class="eyebrow">{pullRequest.repo.owner}/{pullRequest.repo.name}</p>
				<h1 class="title">{pullRequest.title}</h1>
				<p class="meta">PR #{pullRequest.number} · {pullRequest.state}{pullRequest.draft ? ' · Draft' : ''}</p>
			</div>
		</header>

		<article class="body">
			{#if pullRequest.body?.trim()}
                <Markdown content={pullRequest.body} class="body__text" />
			{:else}
				<p class="body__empty">No description provided.</p>
			{/if}
		</article>
	</div>

	<CommentsPanel comments={comments} on:submit={handleSubmit} />
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
		gap: 24px;
		padding: 24px;
		min-height: 100vh;
	}

	.panel {
		border: 1px solid #3a3a3d;
		border-radius: 16px;
		padding: 24px;
		background: #121214;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
	}

	.panel__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		border-bottom: 1px solid #252529;
		padding-bottom: 16px;
		margin-bottom: 16px;
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
		font-size: 28px;
		line-height: 1.2;
	}

	.meta {
		margin: 8px 0 0;
		color: #9c9ca3;
		font-size: 14px;
	}

	.body {
		line-height: 1.6;
		color: #d6d6da;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.body__empty {
		margin: 0;
		color: #8a8a8f;
	}

	@media (max-width: 720px) {
		.panel__header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
