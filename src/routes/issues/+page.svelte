<script lang="ts">
	import ContentList from '$lib/components/ContentList.svelte';
	import type { ContentItem } from '$lib/types/content';

	const { data } = $props<{ data: import('./$types').PageData }>();

	const items: ContentItem[] = data.items;
</script>

{#if data.error}
	<div class="rounded-md border border-red-500 px-4 py-3 text-sm text-red-200">
		{data.error}
	</div>
{/if}

<section class="space-y-4">
	<div class="flex flex-col gap-2">
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Content</p>
		<h2 class="text-3xl font-semibold">Issues</h2>
		<p class="text-sm text-slate-400">Latest issues you are involved in.</p>
	</div>

	<ContentList items={items} emptyTitle="No issues" emptyBody="You have no recent issues." />
</section>
