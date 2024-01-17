<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fetchDashboard, updateDashboard } from '$lib/api';
	import { addToast } from '$lib/components/Toast/toast';
	import type { NDashboard } from '$lib/types';
	import {
		JSONEditor,
		Mode as JSONEditorMode,
		toJSONContent,
		type Content
	} from 'svelte-jsoneditor';

	let dashboardId = $page.params.id;

	let dashboardDataContent: Content;
	let savedDashboardData: NDashboard.Dashboard;
	let dashboardPromise = fetchDashboard(dashboardId).then((data) => {
		return data.match<Promise<void>>({
			async Ok(value) {
				dashboardDataContent = { json: value } as Content;
				savedDashboardData = structuredClone(value);
			},
			async Err(error) {
				console.error(error);
				addToast({
					id: 'dashboard-fetch-error',
					text: `Failed to fetch dashboard: ${error.message}`,
					type: 'error'
				});
				await goto('/dashboards');
			}
		});
	});

	async function save() {
		const json = toJSONContent(dashboardDataContent);
		await updateDashboard(dashboardId, json.json as NDashboard.Dashboard).then(() => {
			savedDashboardData = structuredClone(json.json as NDashboard.Dashboard);
		});
	}

	function unload(e: BeforeUnloadEvent) {
		const json = toJSONContent(dashboardDataContent);
		if (JSON.stringify(json.json) !== JSON.stringify(savedDashboardData)) {
			e.preventDefault();
			e.returnValue = '';
			return '...';
		}
	}

	// $: dashboard = (dashboardDataContent && toJSONContent(dashboardDataContent).json) as
	// 	| NDashboard.Dashboard
	// 	| undefined;
</script>

<svelte:head>
	<title>Microeye | Dashboards | {dashboardId} | Edit</title>
</svelte:head>

<svelte:window on:beforeunload={unload} />

<main class="p-4">
	<div class="flex justify-between">
		<a class="text-4xl link link-hover" href={`/dashboards/${dashboardId}`}>Microeye</a>
		<button
			class="btn btn-sm btn-primary"
			on:click={() => {
				save().then(() => {
					goto(`/dashboards/${dashboardId}`);
				});
			}}
		>
			Save
		</button>
	</div>

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
	{:then}
		<div class="grid grid-cols-6 auto-rows-[30vh] gap-2">
			{#each toJSONContent(dashboardDataContent).json?.items || [] as item}
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
	<JSONEditor mode={JSONEditorMode.text} bind:content={dashboardDataContent} />
</main>
