<script lang="ts">
	import type { AggFunction } from '$lib/types';
	import AutoChart from './AutoChart.svelte';
	import Chart from './Chart.svelte';

	export let dashConfig: {
		id: string;
		title: string;
		items: {
			x: number;
			y: number;
			w: number;
			h: number;
			id: string;
			chart: {
				name: string;
				labels: Record<string, string | number>;
				aggWindowSec: number;
				aggFunction: AggFunction;
			};
		}[];
	} = {
		id: 'test',
		title: 'test',
		items: [
			{
				x: 0,
				y: 0,
				w: 2,
				h: 1,
				id: 'test',
				chart: {
					name: 'crawler_repository_sql_time',
					labels: {},
					aggWindowSec: 1,
					aggFunction: 'avg'
				}
			},
			{
				x: 2,
				y: 0,
				w: 2,
				h: 1,
				id: 'cpu',
				chart: {
					name: 'test2',
					labels: {},
					aggWindowSec: 1,
					aggFunction: 'avg'
				}
			}
		]
	};

	export let fromSec: number;
	export let toSec: number;
	export let refreshIntervalSec: number;
</script>

<div class="grid grid-cols-6 auto-rows-[30vh] gap-2">
	{#each dashConfig.items as item}
		<div
			class="border border-gray-600 rounded-md overflow-hidden"
			style="grid-column: {item.x + 1} / span {item.w}; grid-row: {item.y + 1} / span {item.h}"
		>
			<AutoChart
				{fromSec}
				{toSec}
				isRelative={true}
				queryName={item.chart.name}
				aggFunction={item.chart.aggFunction}
				aggWindowSec={item.chart.aggWindowSec}
				queryLabels={item.chart.labels}
				{refreshIntervalSec}
			/>
		</div>
	{/each}
</div>
