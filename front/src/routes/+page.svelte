<script lang="ts">
	import Yagr from '@gravity-ui/yagr';
	import { onMount } from 'svelte';

	import { fetchMetrics } from '$lib/api';
	import { nowSec } from '$lib/time';
	import type { MergedLines } from '$lib/types';

	import '@gravity-ui/yagr/dist/index.min.css';

	let queryName: string = 'cpu';
	let refreshIntervalMs: number = 1000;
	let refreshInterval: number | undefined;
	let queryLabels: Record<string, string | number> = {};
	let yagr: Yagr;

	let chart: HTMLDivElement;

	onMount(() => {
		fetchMetrics({
			name: queryName,
			labels: queryLabels,
			fromSec: nowSec(-60),
			toSec: nowSec()
		}).then((res: MergedLines) => {
			yagr = new Yagr(chart, {
				timeline: res.timestampsSec,
				series: res.lines.map((line) => {
					return {
						id: line.name + JSON.stringify(line.labels),
						data: line.values,
						name: line.name + JSON.stringify(line.labels)
					};
				}),
				processing: {
					interpolation: {
						value: null,
						type: 'linear'
					}
				},
				chart: {
					timeMultiplier: 0.001
				}
			});
		});

		refreshInterval = setInterval(() => {
			fetchMetrics({
				name: queryName,
				labels: queryLabels,
				fromSec: nowSec(-60),
				toSec: nowSec()
			}).then((res: MergedLines) => {
				yagr.setSeries(
					res.timestampsSec,
					res.lines.map((line) => {
						return {
							id: line.name + JSON.stringify(line.labels),
							data: line.values,
							name: line.name + JSON.stringify(line.labels)
						};
					}),
					{
						incremental: false
					}
				);
			});
		}, refreshIntervalMs);

		return () => {
			clearInterval(refreshInterval);
		};
	});

	$: if (refreshInterval) {
		clearInterval(refreshInterval);
		refreshInterval = setInterval(() => {
			fetchMetrics({
				name: queryName,
				labels: queryLabels,
				fromSec: nowSec(-60),
				toSec: nowSec()
			}).then((res: MergedLines) => {
				yagr.setSeries(
					res.timestampsSec,
					res.lines.map((line) => {
						return {
							id: line.name + JSON.stringify(line.labels),
							data: line.values,
							name: line.name + JSON.stringify(line.labels)
						};
					}),
					{
						incremental: false
					}
				);
			});
		}, refreshIntervalMs);
	}
</script>

<h1>microeye</h1>
<div class="w-full h-[300px]">
	<div bind:this={chart}></div>
</div>
<div class="label">
	<span class="label-text">Name</span>
</div>
<input type="text" placeholder="Name" class="input input-bordered w-full" bind:value={queryName} />
<div class="label">
	<span class="label-text">Refresh interval in ms</span>
</div>
<input
	type="number"
	placeholder="Refresh interval"
	class="input input-bordered"
	bind:value={refreshIntervalMs}
/>
