export type StorageOperation = 'get' | 'set' | 'remove'

export class StorageServiceError extends Error {
	readonly operation: StorageOperation;
	readonly key?: string;
	readonly cause?: unknown;

	constructor(operation: StorageOperation, message: string, key?: string, cause?: unknown) {
		super(message);
		this.name = 'StorageServiceError';
		this.operation = operation;
		this.key = key;
		this.cause = cause;
	}
}

export type StorageErrorHandler = (error: StorageServiceError) => void
