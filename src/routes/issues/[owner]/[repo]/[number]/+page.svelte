<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CommentsPanel from '$lib/components/CommentsPanel.svelte';
	import Markdown from '$lib/components/Markdown.svelte';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	const issue = data.issue;
	const basePath = `/issues/${issue?.repo.owner ?? ''}/${issue?.repo.name ?? ''}/${issue?.number ?? ''}`;

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

{#if data.error}
	<div class="rounded-md border border-red-500 px-4 py-3 text-sm text-red-200">{data.error}</div>
{/if}

{#if issue}
	<article class="space-y-6">
		<header class="space-y-2 rounded-md border border-slate-800 bg-black p-5">
			<p class="text-xs uppercase tracking-[0.3em] text-slate-500">Issue</p>
			<h1 class="text-3xl font-semibold text-slate-100">
				<Markdown content={issue.title} class="whitespace-pre-wrap text-sm text-slate-100" />
			</h1>
			<div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
				<span class="rounded-sm border border-slate-700 px-2 py-1 text-slate-200">{issue.repo.owner}/{issue.repo.name}</span>
				<span class="rounded-sm border border-slate-700 px-2 py-1 text-slate-200">#{issue.number}</span>
				<span class="rounded-sm border border-slate-700 px-2 py-1 text-slate-200">{issue.state}</span>
			</div>
		</header>

		<section class="space-y-3 rounded-md border border-slate-800 bg-black p-5">
			<p class="text-xs uppercase tracking-[0.25em] text-slate-500">Description</p>
			{#if issue.body}
                <Markdown content={issue.body} class="whitespace-pre-wrap text-sm text-slate-100" />
			{:else}
				<p class="text-sm text-slate-500">No description provided.</p>
			{/if}
		</section>

		<CommentsPanel comments={data.comments} on:submit={handleSubmit} />
	</article>
{/if}
