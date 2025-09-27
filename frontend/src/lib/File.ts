export interface File {
	id: number;
	filename: string;
	createdAt: Date;
	is_summarized: boolean;
	is_processing: boolean;
	reason?: string;
}
