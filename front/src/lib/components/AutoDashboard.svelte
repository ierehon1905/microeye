<script lang="ts">
	import { fetchDashboard } from '$lib/api';
	import AutoChart from './AutoChart.svelte';

	export let dashId: string;

	let dashConfigPromise = fetchDashboard(dashId);

	export let fromSec: number;
	export let toSec: number;
	export let refreshIntervalSec: number;
</script>

{#await dashConfigPromise}
	<p>Loading...</p>
{:then dashConfig}
	{#if dashConfig.isOk}
		{@const unwrapped = dashConfig.value}
		<h1 class="text-2xl font-bold">{unwrapped.title}</h1>

		<div class="grid grid-cols-6 auto-rows-[30vh] gap-2">
			{#each unwrapped.items as item}
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
	{:else}
		<p>{dashConfig.error.message}</p>
	{/if}
{:catch error}
	<p>{error.message}</p>
{/await}
