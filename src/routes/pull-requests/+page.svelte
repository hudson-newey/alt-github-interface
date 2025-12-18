<script lang="ts">
	import ContentList from '$lib/components/ContentList.svelte';
	import type { ContentItem } from '$lib/types/content';

	const { data } = $props<{ data: import('./$types').PageData }>();

	const items: ContentItem[] = data.items;
</script>

{#if data.error}
	<div class="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
		{data.error}
	</div>
{/if}

<section class="space-y-4">
	<div class="flex flex-col gap-2">
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Content</p>
		<h2 class="text-3xl font-semibold">Pull Requests</h2>
		<p class="text-sm text-slate-400">Latest pull requests you are involved in.</p>
	</div>

	<ContentList items={items} emptyTitle="No pull requests" emptyBody="You have no recent pull requests." />
</section>
