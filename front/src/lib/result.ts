export class Result<V, E> {
	static ok<V, E>(value: V): Result<V, E> {
		return new Result(value, null);
	}

	static err<V, E>(error: E): Result<V, E> {
		return new Result(null, error);
	}

	constructor(
		public readonly value: V | null,
		public readonly error: E | null
	) {
		if (value === null && error === null) {
			throw new Error('Result must have a value or an error');
		}

		if (value !== null && error !== null) {
			throw new Error('Result cannot have both a value and an error');
		}

		Object.freeze(this);
	}

	isOk(): boolean {
		return this.value !== null;
	}

	isErr(): boolean {
		return this.error !== null;
	}

	unwrap(): V {
		if (this.value === null) {
			throw new Error('Result has no value');
		}

		return this.value;
	}

	unwrapErr(): E {
		if (this.error === null) {
			throw new Error('Result has no error');
		}

		return this.error;
	}
}
