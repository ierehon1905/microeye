<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fetchDashboard, updateDashboard, createDashboard } from '$lib/api';
	import type { NDashboard } from '$lib/types';
	import {
		JSONEditor,
		Mode as JSONEditorMode,
		toJSONContent,
		type Content
	} from 'svelte-jsoneditor';

	let dashboardData: Content = {
		json: {
			id: 'sample',
			title: 'sample',
			items: [
				{
					id: 'sample',
					x: 0,
					y: 0,
					w: 2,
					h: 1,
					chart: {
						name: 'test',
						labels: {},
						aggWindowSec: 60,
						aggFunction: 'avg',
						fromSec: 60,
						toSec: 0,
						isRelative: true
					}
				}
			]
		}
	};

	async function save() {
		const json = toJSONContent(dashboardData);
		const futureDashboard = json.json as NDashboard.Dashboard;

		console.log(futureDashboard);

		const res = await createDashboard(futureDashboard);
		console.log(res);

		await goto(`/dashboards/${futureDashboard.id}`);
	}

	$: dashboard = toJSONContent(dashboardData).json as NDashboard.Dashboard;
</script>

<svelte:head>
	<title>Microeye | Dashboards | New</title>
</svelte:head>

<main class="p-4">
	<div class="flex justify-between">
		<div class="text-4xl">
			<a class="link link-hover" href="/dashboards">&lt;</a>
			New dashboard
		</div>
		<button class="btn btn-sm btn-primary" on:click={save}> Save </button>
	</div>

	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/dashboards" class="link link-hover">Dashboards</a>
			</li>
			<li>New</li>
		</ul>
	</div>

	<div class="grid grid-cols-6 auto-rows-[30vh] gap-2">
		{#each dashboard.items as item}
			<div
				class="border border-gray-600 rounded-md overflow-hidden
							p-2"
				style="grid-column: {item.x + 1} / span {item.w}; grid-row: {item.y + 1} / span {item.h}"
			>
				{item.id}

				<pre class="text-xs p-2 bg-gray-800 rounded-md overflow-auto">
						<code>
							{JSON.stringify(item.chart, null, 2)}
						</code>
					</pre>
			</div>
		{/each}
	</div>

	<div class="divider"></div>
	<JSONEditor mode={JSONEditorMode.text} bind:content={dashboardData} />
</main>
