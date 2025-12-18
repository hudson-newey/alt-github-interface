<script lang="ts">
	import type { PullRequestFile } from '$lib/server/github/pull-requests';

	const { file } = $props<{ file: PullRequestFile }>();

	const lines = $derived(
		file.patch
			? file.patch.replace(/\n$/, '').split('\n') // drop trailing newline to avoid rendering an extra blank line
			: []
	);

	const parsedLines = $derived(
		lines.map((text, index) => {
			const type = text.startsWith('+')
				? 'add'
				: text.startsWith('-')
				? 'del'
				: text.startsWith('@@')
				? 'hunk'
				: 'ctx';
			const symbol = type === 'add' ? '+' : type === 'del' ? '-' : type === 'hunk' ? '@@' : ' ';
			return { id: index, text, type, symbol };
		})
	);

	const badgeLabel = file.status === 'added'
		? 'Added'
		: file.status === 'removed'
		? 'Removed'
		: file.status === 'modified'
		? 'Modified'
		: file.status === 'renamed'
		? 'Renamed'
		: file.status;
</script>

<article class="diff">
	<header class="diff__header">
		<div class="diff__path">
			<p class="diff__file">{file.filename}</p>
			<span class={`diff__badge diff__badge--${file.status}`}>{badgeLabel}</span>
		</div>
		<div class="diff__counts">
			<span class="diff__add">+{file.additions}</span>
			<span class="diff__del">-{file.deletions}</span>
		</div>
	</header>

	{#if file.patch}
		<pre class="diff__code" aria-label={`Diff for ${file.filename}`}>
			{#each parsedLines as line (line.id)}<div class={`line ${line.type}`}>
					<span class="gutter">{line.symbol}</span>
					<span class="text">{line.text}</span>
            </div>{/each}
		</pre>
	{:else}
		<p class="diff__empty">No diff available (binary file or patch too large).</p>
	{/if}
</article>

<style>
	.diff {
		border: 1px solid #23232a;
		border-radius: 14px;
		overflow: hidden;
		background: #0f0f13;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

        content-visibility: auto;
        contain: content;
	}

	.diff__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1rem;
		background: #14141a;
		border-bottom: 1px solid #20202a;
	}

	.diff__path {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
	}

	.diff__file {
		margin: 0;
		font-weight: 700;
		color: #f0f0f5;
		font-size: 0.95rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.diff__badge {
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		border: 1px solid #2f2f37;
	}

	.diff__badge--added {
		background: rgba(34, 197, 94, 0.12);
		color: #4ade80;
		border-color: rgba(34, 197, 94, 0.35);
	}

	.diff__badge--removed {
		background: rgba(248, 113, 113, 0.12);
		color: #fca5a5;
		border-color: rgba(248, 113, 113, 0.35);
	}

	.diff__badge--modified,
	.diff__badge--changed {
		background: rgba(59, 130, 246, 0.12);
		color: #93c5fd;
		border-color: rgba(59, 130, 246, 0.35);
	}

	.diff__badge--renamed {
		background: rgba(234, 179, 8, 0.12);
		color: #fcd34d;
		border-color: rgba(234, 179, 8, 0.35);
	}

	.diff__counts {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
		font-size: 0.85rem;
	}

	.diff__add {
		color: #4ade80;
	}

	.diff__del {
		color: #fca5a5;
	}

	.diff__code {
		margin: 0;
		padding: 0.75rem 0.9rem 1rem;
		background: #0c0c10;
		font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		overflow-x: auto;
		white-space: pre;
	}

	.line {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		column-gap: 0.5rem;
		padding: 0.1rem 0.6rem;
		border-radius: 6px;
		white-space: pre;
	}

	.line + .line {
		margin-top: 2px;
	}

	.gutter {
		color: #737373;
		min-width: 1.5rem;
		text-align: right;
		font-weight: 600;
	}

	.text {
		overflow-x: auto;
		display: block;
	}

	.line.add {
		background: rgba(34, 197, 94, 0.08);
		color: #d1fae5;
	}

	.line.del {
		background: rgba(248, 113, 113, 0.08);
		color: #fee2e2;
	}

	.line.hunk {
		background: rgba(59, 130, 246, 0.12);
		color: #dbeafe;
		font-weight: 700;
	}

	.diff__empty {
		margin: 0;
		padding: 1rem;
		color: #9ca3af;
	}
</style>
