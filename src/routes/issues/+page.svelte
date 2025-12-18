<script lang="ts">
	import ContentList from '$lib/components/ContentList.svelte';
	import type { ContentItem } from '$lib/types/content';

	const { data } = $props<{ data: import('./$types').PageData }>();

	let items: ContentItem[] = $derived(data.items);
	let query = $state(data.query ?? '');
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


	<form class="flex flex-col gap-2" method="GET" role="search">
		<label class="text-sm font-medium text-slate-300" for="issues-search">Search</label>
		<input
			id="issues-search"
			name="query"
			type="search"
			placeholder="Search by title or repo..."
			class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
			bind:value={query}
		/>
	</form>

	<ContentList items={items} emptyTitle="No issues" emptyBody="You have no recent issues." />
</section>
