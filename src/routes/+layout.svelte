<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/pull-requests', label: 'Pull Requests' },
		{ href: '/issues', label: 'Issues' },
	];

	const isActive = (href: string) => page.url.pathname === href;
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-black text-slate-100">
	<div class="relative mx-auto max-w-6xl px-6 pb-16">
		<header class="flex flex-col gap-4 border-b border-slate-800 py-8 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">A faster solution</p>
				<h1 class="text-3xl font-semibold">Git</h1>
			</div>
			<nav class="flex flex-wrap gap-2 rounded-md border border-slate-800 bg-black/60 p-2">
				{#each links as link (link.href)}
					<a
						href={link.href}
						data-sveltekit-preload-data="hover"
						class={`rounded-md px-4 py-2 text-sm font-semibold transition ${isActive(link.href) ? 'border border-slate-100 text-slate-100' : 'border border-transparent text-slate-300 hover:border-slate-600 hover:text-slate-100'}`}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</header>

		<main class="space-y-8 py-8">{@render children()}</main>
	</div>
</div>
