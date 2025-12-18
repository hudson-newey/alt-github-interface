export type Comment = {
	id: number;
	body: string;
	author: {
		login: string;
		avatarUrl: string;
	};
	createdAt: string;
	updatedAt: string;
};
