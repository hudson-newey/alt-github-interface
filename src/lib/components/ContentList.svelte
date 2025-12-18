<script lang="ts">
	import type { ContentItem } from '$lib/types/content';

	/** @type {{ items: ContentItem[]; emptyTitle?: string; emptyBody?: string }} */
	let { items, emptyTitle = 'All caught up', emptyBody = 'No items to display right now.' } = $props();

	const formatDate = (value: string) =>
		new Intl.DateTimeFormat('en', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
</script>

{#if items.length === 0}
	<div class="rounded-md border border-slate-800 bg-black p-10 text-center">
		<p class="text-xl font-semibold">{emptyTitle}</p>
		<p class="mt-2 text-sm text-slate-400">{emptyBody}</p>
	</div>
{:else}
	<div class="rounded-md border border-slate-800 bg-black">
		<ul class="divide-y divide-slate-800">
			{#each items as item (item.id)}
				<li>
					<a
						href={item.href ?? item.url}
						target={item.href ? undefined : '_blank'}
						rel={item.href ? undefined : 'noreferrer'}
						class="flex items-start gap-4 px-5 py-4 transition hover:bg-slate-900"
					>
						<div class="mt-1 h-3 w-3 flex-shrink-0 rounded-sm border border-slate-400"></div>
						<div class="flex flex-1 flex-col gap-2">
							<div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
								<span class="rounded-sm border border-slate-700 px-2 py-1 text-slate-200">{item.typeLabel}</span>
								<span class="text-slate-400">{item.repo}</span>
								{#if item.status}
									<span
										class="rounded-sm px-2 py-1 text-xs font-medium
											{item.status === 'open' ? 'bg-emerald-700/20 text-emerald-200 border border-emerald-700' : ''}
											{item.status === 'closed' ? 'bg-red-700/20 text-red-200 border border-red-700' : ''}
											{item.status !== 'open' && item.status !== 'closed' ? 'border border-slate-700 text-slate-200' : ''}"
									>
										{item.status}
									</span>
								{/if}
							</div>
							<p class="text-base font-semibold leading-snug text-slate-100 line-clamp-2">{item.title}</p>
							{#if item.meta}
								<p class="text-sm text-slate-400 line-clamp-2">{item.meta}</p>
							{/if}
							<p class="text-xs text-slate-500">Updated {formatDate(item.updatedAt)}</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}
