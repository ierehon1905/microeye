<script lang="ts">
	import { page } from '$app/stores';
	import { fetchDashboard, updateDashboard } from '$lib/api';
	import type { NDashboard } from '$lib/types';
	import { onMount } from 'svelte';
	import { JSONEditor, type Content, isJSONContent, toJSONContent } from 'svelte-jsoneditor';
	// import {no} from 'daisyui';

	// notifi
	// import { startWindToast } from '@mariojgt/wind-notify/packages/index.js';

	let dashId = $page.params.id;

	let dashboardData: Content;
	let savedDashboardData: NDashboard.Dashboard;
	let dashboardPromise = fetchDashboard(dashId).then((data) => {
		dashboardData = { json: data } as Content;
		savedDashboardData = structuredClone(data);
		return data;
	});

	function save() {
		if (!isJSONContent(dashboardData)) return;
		const json = toJSONContent(dashboardData);
		updateDashboard(dashId, json.json as NDashboard.Dashboard).then(() => {
			savedDashboardData = structuredClone(json.json as NDashboard.Dashboard);
		});
	}

	function unload(e: BeforeUnloadEvent) {
		if (!isJSONContent(dashboardData)) return;
		const json = toJSONContent(dashboardData);
		if (JSON.stringify(json.json) !== JSON.stringify(savedDashboardData)) {
			e.preventDefault();
			e.returnValue = '';
			return '...';
		}
	}
</script>

<svelte:window on:beforeunload={unload} />

<main class="p-4">
	<a class="text-4xl link link-hover" href="/">Microeye</a>

	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/dashboards" class="link link-hover">Dashboards</a>
			</li>
			<li>
				<a href="/dashboards/{$page.params.id}" class="link link-hover">{$page.params.id}</a>
			</li>
			<li>Edit</li>
		</ul>
	</div>

	{#await dashboardPromise}
		<p>Loading...</p>
	{:then dashboard}
		<div class="grid grid-cols-6 auto-rows-[30vh] gap-2">
			{#each dashboardData.json.items as item}
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
	{:catch error}
		<p>{error.message}</p>
	{/await}
	<div class="divider"></div>
	<button class="btn btn-primary" on:click={save}>Save</button>
	<JSONEditor bind:content={dashboardData} />
</main>
