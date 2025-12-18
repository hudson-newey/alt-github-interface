<script lang="ts">
	import CommentsPanel from '$lib/components/CommentsPanel.svelte';

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	const issue = data.issue;
</script>

{#if data.error}
	<div class="rounded-md border border-red-500 px-4 py-3 text-sm text-red-200">{data.error}</div>
{/if}

{#if issue}
	<article class="space-y-6">
		<header class="space-y-2 rounded-md border border-slate-800 bg-black p-5">
			<p class="text-xs uppercase tracking-[0.3em] text-slate-500">Issue</p>
			<h1 class="text-3xl font-semibold text-slate-100">{issue.title}</h1>
			<div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
				<span class="rounded-sm border border-slate-700 px-2 py-1 text-slate-200">{issue.repo.owner}/{issue.repo.name}</span>
				<span class="rounded-sm border border-slate-700 px-2 py-1 text-slate-200">#{issue.number}</span>
				<span class="rounded-sm border border-slate-700 px-2 py-1 text-slate-200">{issue.state}</span>
			</div>
		</header>

		<section class="space-y-3 rounded-md border border-slate-800 bg-black p-5">
			<p class="text-xs uppercase tracking-[0.25em] text-slate-500">Description</p>
			{#if issue.body}
				<p class="whitespace-pre-wrap text-sm text-slate-100">{issue.body}</p>
			{:else}
				<p class="text-sm text-slate-500">No description provided.</p>
			{/if}
		</section>

		<CommentsPanel comments={data.comments} />
	</article>
{/if}
