<script lang="ts">
	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	const formatDate = (value: string) =>
		new Intl.DateTimeFormat('en', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(value));
</script>

{#if data.error}
	<div class="rounded-md border border-red-500 px-4 py-3 text-sm text-red-200">
		{data.error}
	</div>
{/if}

<section class="space-y-6">
	<div class="flex flex-col gap-2">
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
		<h2 class="text-3xl font-semibold">Recently used repositories</h2>
		<p class="text-sm text-slate-400">Sorted by last update across your GitHub account.</p>
	</div>

	{#if data.repos.length === 0}
		<div class="rounded-md border border-slate-800 bg-black p-10 text-center">
			<p class="text-xl font-semibold">No repositories found</p>
			<p class="mt-2 text-sm text-slate-400">
				Push a repo or star one to see it appear here.
			</p>
		</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-2">
			{#each data.repos as repo (repo.id)}
				<article class="group rounded-md border border-slate-800 bg-black p-5 transition hover:border-slate-500">
					<div class="flex items-start justify-between gap-3">
						<div class="space-y-2">
							<p class="text-xs uppercase tracking-wide text-slate-500">{repo.owner}</p>
							<a
								href={repo.htmlUrl}
								target="_blank"
								rel="noreferrer"
								class="block text-lg font-semibold leading-snug text-slate-100 transition group-hover:text-slate-50"
							>
								{repo.name}
							</a>
							{#if repo.description}
								<p class="text-sm text-slate-400 line-clamp-2">{repo.description}</p>
							{/if}
						</div>
						<div class="rounded-sm border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
							{repo.private ? 'Private' : 'Public'}
						</div>
					</div>
					<p class="mt-4 text-xs text-slate-500">Updated {formatDate(repo.updatedAt)}</p>
				</article>
			{/each}
		</div>
	{/if}
</section>
