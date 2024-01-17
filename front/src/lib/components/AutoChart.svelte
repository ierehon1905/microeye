<script lang="ts">
	import { onMount } from 'svelte';

	import Chart from './Chart.svelte';

	import { fetchMetrics } from '$lib/api';
	import { getAbsoluteTime } from '$lib/time';
	import type { AggFunction, MergedLines } from '$lib/types';

	import '@gravity-ui/yagr/dist/index.min.css';

	export let queryName: string;
	export let refreshIntervalSec: number;
	export let isRelative: boolean;
	let refreshIntervalId: number | undefined;
	export let queryLabels: Record<string, string | number> = {};
	export let fromSec: number;
	export let toSec: number;
	export let aggFunction: AggFunction = 'avg';
	export let aggWindowSec: number = 1;

	let data: MergedLines;

	onMount(() => {
		fetchMetrics({
			name: queryName,
			labels: queryLabels,
			aggWindowSec: aggWindowSec,
			aggFunction: aggFunction,
			...getAbsoluteTime(fromSec, toSec, isRelative)
		}).then((res) => {
			const time = getAbsoluteTime(fromSec, toSec, isRelative);
			data = res.unwrapOr({
				lines: [],
				timestampsSec: [time.fromSec, time.toSec]
			});
		});

		if (refreshIntervalSec && refreshIntervalSec > 0) {
			refreshIntervalId = setInterval(() => {
				fetchMetrics({
					name: queryName,
					labels: queryLabels,
					aggWindowSec: aggWindowSec,
					aggFunction: aggFunction,
					...getAbsoluteTime(fromSec, toSec, isRelative)
				}).then((res) => {
					const time = getAbsoluteTime(fromSec, toSec, isRelative);
					data = res.unwrapOr({
						lines: [],
						timestampsSec: [time.fromSec, time.toSec]
					});
				});
			}, refreshIntervalSec * 1000);
		}

		return () => {
			clearInterval(refreshIntervalId);
		};
	});
</script>

<Chart {data} />
