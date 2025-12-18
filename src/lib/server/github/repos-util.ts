export function parseRepoFromUrl(repositoryUrl: string): { owner: string; name: string } {
	try {
		const repoPath = new URL(repositoryUrl).pathname.replace(/^\//, '');
		const segments = repoPath.split('/');
		const owner = segments.at(-2);
		const name = segments.at(-1);

		if (!owner || !name) {
			throw new Error('Missing owner or name');
		}

		return { owner, name };
	} catch (error) {
		throw new Error(`Unable to parse repository from URL "${repositoryUrl}": ${String(error)}`);
	}
}
