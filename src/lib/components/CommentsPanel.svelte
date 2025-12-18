<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Comment } from '$lib/types/comment';
	import Markdown from './Markdown.svelte';

	const dispatch = createEventDispatcher<{ submit: { body: string } }>();

	/** @type {{ title?: string; comments: Comment[] }} */
	let { title = 'Comments', comments } = $props();

	let draft = $state('');

	const submit = () => {
		const body = draft.trim();
		if (!body) return;
		dispatch('submit', { body });
		draft = '';
	};
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

	<form class="border-t border-slate-800 px-4 py-4" on:submit|preventDefault={submit}>
		<label for="new-comment" class="sr-only">Add a comment</label>
		<textarea
			id="new-comment"
			class="w-full resize-y rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500"
			rows="4"
			placeholder="Write a comment..."
			bind:value={draft}
		></textarea>
		<div class="mt-3 flex items-center justify-end">
			<button
				type="submit"
				class="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:opacity-50 disabled:hover:bg-slate-100"
				disabled={!draft.trim()}
			>
				Post comment
			</button>
		</div>
	</form>
</section>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
