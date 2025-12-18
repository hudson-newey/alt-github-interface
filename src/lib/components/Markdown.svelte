<script lang="ts">
	import { marked } from 'marked';
	import { filterXSS } from 'xss';

	/** @type {{ content?: string; class?: string } & svelteHTML.HTMLAttributes<HTMLDivElement>} */
	let { content = '', class: className = '', ...restProps } = $props();

	const sanitize = (markdown: string) => {
		const rendered = marked.parse(markdown ?? '');
		return rendered;
		// return filterXSS(typeof rendered === 'string' ? rendered : '');
	};

	let html = $derived(sanitize(content));
	let combinedClass = $derived(['markdown', className].filter(Boolean).join(' '));
</script>

<div class={combinedClass} {...restProps}>
	{@html html}
</div>

<style>
	.markdown :global(p) {
		margin: 0;
	}

	.markdown :global(p + p) {
		margin-top: 0.5rem;
	}

	.markdown :global(ul),
	.markdown :global(ol) {
		margin: 0.5rem 0 0 1.25rem;
		padding: 0;
	}

	.markdown :global(li + li) {
		margin-top: 0.25rem;
	}

	.markdown :global(a) {
		color: #38bdf8;
		text-decoration: underline;
	}

	.markdown :global(code) {
		background: #0f172a;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		padding: 0.1rem 0.25rem;
	}

	.markdown :global(pre) {
		background: #0f172a;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin-top: 0.5rem;
		overflow-x: auto;
		padding: 0.75rem;
	}

	.markdown :global(pre code) {
		background: transparent;
		padding: 0;
	}
</style>
