<script lang="ts">
	import type { Comment } from '$lib/types/comment';
	import Markdown from './Markdown.svelte';

	/** @type {{ title?: string; comments: Comment[] }} */
	let { title = 'Comments', comments } = $props();
</script>

<section class="rounded-md border border-slate-800 bg-black">
	<header class="border-b border-slate-800 px-4 py-3">
		<p class="text-xs uppercase tracking-[0.25em] text-slate-500">{title}</p>
	</header>

	{#if comments.length === 0}
		<div class="px-4 py-6 text-sm text-slate-500">No comments yet.</div>
	{:else}
		<ul class="divide-y divide-slate-800">
			{#each comments as comment (comment.id)}
				<li class="px-4 py-4">
					<div class="flex items-start gap-3">
						<div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-sm border border-slate-700">
							<img src={comment.author.avatarUrl} alt={comment.author.login} class="h-full w-full object-cover" />
						</div>
						<div class="flex-1 space-y-2">
							<div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
								<span class="font-semibold text-slate-100">{comment.author.login}</span>
								<span class="text-slate-600">•</span>
								<span>{new Date(comment.createdAt).toLocaleString()}</span>
							</div>
							<Markdown class="text-sm leading-relaxed text-slate-100" content={comment.body} />
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>
