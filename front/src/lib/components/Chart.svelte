<script lang="ts">
	import Yagr from '@gravity-ui/yagr';
	import { onMount } from 'svelte';

	import type { MergedLines } from '$lib/types';
	import '@gravity-ui/yagr/dist/index.min.css';

	export let data: MergedLines = {
		timestampsSec: [1, 2, 3, 4],
		lines: [
			{
				name: 'test',
				labels: {},
				values: [1, 2, 3, 4]
			}
		]
	};

	let chart: HTMLDivElement;
	let yagr: Yagr;

	onMount(() => {
		const series = data.lines.map((line) => {
			return {
				id: line.name + JSON.stringify(line.labels),
				data: line.values,
				name: line.name + JSON.stringify(line.labels)
			};
		});

		yagr = new Yagr(chart!, {
			timeline: data.timestampsSec,
			series,
			chart: {
				timeMultiplier: 0.001,
				series: {
					spanGaps: true,
					type: 'line'
				}
			}
		});
	});

	$: {
		if (yagr) {
			const series = data.lines.map((line) => {
				return {
					id: line.name + JSON.stringify(line.labels),
					data: line.values,
					name: line.name + JSON.stringify(line.labels)
				};
			});

			yagr.setConfig({
				timeline: data.timestampsSec,
				series
			});
		}
	}
</script>

<div class="w-full h-full">
	<div bind:this={chart}></div>
</div>
