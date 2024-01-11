import { AGG_FUNCTIONS } from '$lib/constants';
import type { AggFunction } from '$lib/types';
import { queryParam } from 'sveltekit-search-params';

export const queryName = queryParam(
	'name',
	{
		defaultValue: 'cpu',
		decode(value) {
			return value || '';
		},
		encode(value) {
			return value;
		}
	},
	{
		pushHistory: false
	}
);

export const refreshIntervalSec = queryParam(
	'refresh',
	{
		defaultValue: 1,
		decode(value) {
			return parseInt(value || '0');
		},
		encode(value) {
			return value.toString();
		}
	},
	{
		pushHistory: false
	}
);

export const isRelative = queryParam(
	'relative',
	{
		defaultValue: true,
		decode(value) {
			return value === '1';
		},
		encode(value) {
			return value ? '1' : '0';
		}
	},
	{
		pushHistory: false
	}
);

export const fromSec = queryParam(
	'from',
	{
		defaultValue: 60,
		decode(value) {
			const int = parseInt(value || '0');

			if (Number.isNaN(int)) {
				return 60;
			}

			return int;
		},
		encode(value) {
			return value.toString();
		}
	},
	{
		pushHistory: false
	}
);

export const toSec = queryParam(
	'to',
	{
		defaultValue: 0,
		decode(value) {
			return parseInt(value || '0');
		},
		encode(value) {
			return value.toString();
		}
	},
	{
		pushHistory: false
	}
);

export const aggWindowSec = queryParam(
	'aggWindow',
	{
		defaultValue: 1,
		decode(value) {
			return parseInt(value || '1');
		},
		encode(value) {
			return value.toString();
		}
	},
	{
		pushHistory: false
	}
);

export const aggFunction = queryParam<AggFunction>(
	'aggFunction',
	{
		defaultValue: 'avg',
		decode(value) {
			return value && AGG_FUNCTIONS.includes(value as AggFunction) ? (value as AggFunction) : 'avg';
		},
		encode(value) {
			return value;
		}
	},
	{
		pushHistory: false
	}
);
