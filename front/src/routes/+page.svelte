<script lang="ts">
	import { page } from '$app/stores';
	import Yagr from '@gravity-ui/yagr';
	import { onMount } from 'svelte';

	import { fetchAndDraw } from '$lib/api';
	import { getAbsoluteTime, nowSec } from '$lib/time';
	import { queryParam } from 'sveltekit-search-params';

	import '@gravity-ui/yagr/dist/index.min.css';
	import type { AggFunction } from '$lib/types';

	const queryName = queryParam('name', {
		defaultValue: 'cpu',
		decode(value) {
			return value || '';
		},
		encode(value) {
			return value;
		}
	});
	const refreshIntervalSec = queryParam('refresh', {
		defaultValue: 1,
		decode(value) {
			return parseInt(value || '0');
		},
		encode(value) {
			return value.toString();
		}
	});
	const isRelative = queryParam('relative', {
		defaultValue: true,
		decode(value) {
			return value === '1';
		},
		encode(value) {
			return value ? '1' : '0';
		}
	});

	let refreshIntervalId: number | undefined;
	let queryLabels: Record<string, string | number> = {};
	const fromSec = queryParam('from', {
		defaultValue: nowSec(-60),
		decode(value) {
			return parseInt(value || '0');
		},
		encode(value) {
			return value.toString();
		}
	});
	const toSec = queryParam('to', {
		defaultValue: nowSec(),
		decode(value) {
			return parseInt(value || '0');
		},
		encode(value) {
			return value.toString();
		}
	});
	const aggWindowSec = queryParam('aggWindow', {
		defaultValue: 1,
		decode(value) {
			return parseInt(value || '1');
		},
		encode(value) {
			return value.toString();
		}
	});
	const AGG_FUNCTIONS: AggFunction[] = ['avg', 'min', 'max', 'sum', 'count'];
	const aggFunction = queryParam<AggFunction>('aggFunction', {
		defaultValue: 'avg',
		decode(value) {
			return value && AGG_FUNCTIONS.includes(value as AggFunction) ? (value as AggFunction) : 'avg';
		},
		encode(value) {
			return value;
		}
	});

	let yagr: Yagr;

	let chart: HTMLDivElement;

	onMount(() => {
		$page.url.searchParams.set('weather', 'sunny');
		fetchAndDraw(
			{
				name: $queryName!,
				labels: queryLabels,
				aggWindowSec: $aggWindowSec!,
				aggFunction: $aggFunction!,
				...getAbsoluteTime($fromSec!, $toSec!, $isRelative)
			},
			yagr,
			chart
		).then((newYagr) => {
			yagr = newYagr;
		});

		if ($refreshIntervalSec && $refreshIntervalSec > 0) {
			refreshIntervalId = setInterval(() => {
				fetchAndDraw(
					{
						name: $queryName!,
						labels: queryLabels,
						aggWindowSec: $aggWindowSec!,
						aggFunction: $aggFunction!,
						...getAbsoluteTime($fromSec!, $toSec!, $isRelative)
					},
					yagr,
					chart
				).then((newYagr) => {
					yagr = newYagr;
				});
			}, $refreshIntervalSec * 1000);
		}

		return () => {
			clearInterval(refreshIntervalId);
		};
	});

	// $: if ($refreshIntervalSec && $refreshIntervalSec > 0) {
	// 	clearInterval(refreshIntervalId);
	// 	refreshIntervalId = setInterval(() => {
	// 		fetchAndDraw(
	// 			{
	// 				name: $queryName!,
	// 				labels: queryLabels,
	// 				aggWindowSec: $aggWindowSec!,
	// 				...getAbsoluteTime($fromSec!, $toSec!, $isRelative)
	// 			},
	// 			yagr,
	// 			chart
	// 		).then((newYagr) => {
	// 			yagr = newYagr;
	// 		});
	// 	}, $refreshIntervalSec * 1000);
	// } else {
	// 	clearInterval(refreshIntervalId);
	// }

	// $: yagr &&
	// 	fetchAndDraw(
	// 		{
	// 			name: $queryName!,
	// 			labels: queryLabels,
	// 			...getAbsoluteTime($fromSec!, $toSec!, $isRelative)
	// 		},
	// 		yagr,
	// 		chart
	// 	);
</script>

<h1 class="text-4xl">Microeye</h1>
<div class="w-full h-[300px]">
	<div bind:this={chart}></div>
</div>
<div class="label">
	<span class="label-text">Name</span>
</div>
<input type="text" placeholder="Name" class="input input-bordered w-full" bind:value={$queryName} />
<div class="label">
	<span class="label-text">Refresh interval in s</span>
</div>
<input
	type="number"
	placeholder="Refresh interval"
	class="input input-bordered"
	bind:value={$refreshIntervalSec}
/>
<div class="label">
	<span class="label-text">Aggregation window in s</span>
</div>
<input
	type="number"
	placeholder="Aggregation window"
	class="input input-bordered"
	bind:value={$aggWindowSec}
/>

<div class="label">
	<span class="label-text">Aggregation function</span>
</div>
<select class="select select-bordered" bind:value={$aggFunction}>
	{#each AGG_FUNCTIONS as aggFunction}
		<option value={aggFunction}>{aggFunction}</option>
	{/each}
</select>

<div class="label">
	<span class="label-text">From</span>
</div>
<input type="number" placeholder="From" class="input input-bordered" bind:value={$fromSec} />

<div class="label">
	<span class="label-text">To</span>
</div>
<input type="number" placeholder="To" class="input input-bordered" bind:value={$toSec} />

<div class="label">
	<span class="label-text">Relative</span>
</div>
<input type="checkbox" class="checkbox" bind:checked={$isRelative} />
