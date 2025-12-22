<script lang="ts">
	import type { PullRequestFile } from '$lib/server/github/pull-requests';
	import Prism from 'prismjs';
	import type { Token } from 'prismjs';
	import 'prismjs/components/prism-bash';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-diff';
	import 'prismjs/components/prism-docker';
	import 'prismjs/components/prism-go';
	import 'prismjs/components/prism-graphql';
	import 'prismjs/components/prism-json';
	import 'prismjs/components/prism-jsx';
	import 'prismjs/components/prism-markdown';
	import 'prismjs/components/prism-markup';
	import 'prismjs/components/prism-python';
	import 'prismjs/components/prism-scss';
	// import 'prismjs/components/prism-svelte';
	import 'prismjs/components/prism-tsx';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-yaml';

	type TokenSegment = { text: string; classes: string[] };

	const { file } = $props<{ file: PullRequestFile }>();

	const language = $derived(getLanguageId(file.filename));

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
			const hasDiffPrefix = text.startsWith('+') || text.startsWith('-') || text.startsWith(' ');
			const content = type === 'hunk' ? text : hasDiffPrefix ? text.slice(1) : text;
			const segments = type === 'hunk' ? [] : highlight(content, language);

			return { id: index, type, symbol, content, segments };
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

	function getLanguageId(filename: string): string | undefined {
		const lower = filename.toLowerCase();
		const ext = lower.split('.').pop();

		if (lower === 'dockerfile' || lower.endsWith('/dockerfile')) return 'docker';

		switch (ext) {
			case 'ts':
			case 'mts':
			case 'cts':
				return 'typescript';
			case 'tsx':
				return 'tsx';
			case 'js':
			case 'mjs':
			case 'cjs':
				return 'javascript';
			case 'jsx':
				return 'jsx';
			case 'svelte':
				return 'svelte';
			case 'css':
				return 'css';
			case 'scss':
				return 'scss';
			case 'md':
			case 'markdown':
				return 'markdown';
			case 'json':
				return 'json';
			case 'yml':
			case 'yaml':
				return 'yaml';
			case 'html':
			case 'htm':
			case 'xml':
			case 'svg':
				return 'markup';
			case 'sh':
			case 'bash':
				return 'bash';
			case 'dockerfile':
				return 'docker';
			case 'go':
				return 'go';
			case 'py':
				return 'python';
			case 'gql':
			case 'graphql':
				return 'graphql';
			default:
				return undefined;
		}
	}

	function highlight(value: string, languageId: string | undefined): TokenSegment[] {
		const lang = languageId && Prism.languages[languageId] ? languageId : 'plaintext';
		const grammar = Prism.languages[lang] ?? Prism.languages.plaintext;
		const tokens = Prism.tokenize(value, grammar, lang);
		return tokens.flatMap((token) => toSegments(token));
	}

	function toSegments(token: string | Token, parentClasses: string[] = []): TokenSegment[] {
		if (typeof token === 'string') {
			return [{ text: token, classes: parentClasses }];
		}

		const aliases = token.alias
			? Array.isArray(token.alias)
				? token.alias
				: [token.alias]
			: [];
		const classes = [...parentClasses, token.type, ...aliases];
		const content = token.content;

		if (Array.isArray(content)) {
			return content.flatMap((segment) => toSegments(segment as string | Token, classes));
		}

		return toSegments(content as string | Token, classes);
	}
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
		<pre class="diff__code" aria-label={`Diff for ${file.filename}`} data-language={language ?? 'plaintext'}>
			{#each parsedLines as line (line.id)}
				<div class={`line ${line.type}`}>
					<span class="gutter">{line.symbol}</span>
					<span class="text">
						{#if line.segments.length === 0}
							{line.content}
						{:else}
							{#each line.segments as segment, segmentIndex (segmentIndex)}<span class={segment.classes.length ? ['token', ...segment.classes].join(' ') : undefined}>{segment.text}</span>{/each}
						{/if}
					</span>
				</div>
			{/each}
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
		line-height: 0.4;
		overflow-x: auto;
		white-space: pre;
		overflow-y: hidden;

		display: flex;
		flex-direction: column;
	}

	.line {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		column-gap: 0.5rem;
		padding: 0.1rem 0.6rem;
		border-radius: 6px;
		white-space: pre;
		overflow-y: hidden;
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
		color: #e7e9f2;
		white-space: pre;
	}

	.text :global(.token.comment),
	.text :global(.token.prolog),
	.text :global(.token.doctype),
	.text :global(.token.cdata) {
		color: #8e8ea4;
	}

	.text :global(.token.punctuation) {
		color: #c4c4cf;
	}

	.text :global(.token.property),
	.text :global(.token.tag),
	.text :global(.token.constant),
	.text :global(.token.symbol),
	.text :global(.token.deleted) {
		color: #f28f85;
	}

	.text :global(.token.boolean),
	.text :global(.token.number) {
		color: #f2c77c;
	}

	.text :global(.token.selector),
	.text :global(.token.attr-name),
	.text :global(.token.string),
	.text :global(.token.char),
	.text :global(.token.builtin),
	.text :global(.token.inserted) {
		color: #9ae6b4;
	}

	.text :global(.token.operator),
	.text :global(.token.entity),
	.text :global(.token.url),
	.text :global(.language-css .token.string),
	.text :global(.style .token.string),
	.text :global(.token.variable) {
		color: #8be9fd;
	}

	.text :global(.token.atrule),
	.text :global(.token.attr-value),
	.text :global(.token.function),
	.text :global(.token.class-name) {
		color: #a78bfa;
	}

	.text :global(.token.keyword) {
		color: #f0a0ff;
	}

	.text :global(.token.regex),
	.text :global(.token.important) {
		color: #f78c6c;
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
