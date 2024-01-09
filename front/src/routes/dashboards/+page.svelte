<script lang="ts">
	import { goto } from '$app/navigation';
	import Table from '$lib/components/Table.svelte';
	import { HOST } from '$lib/constants';
	import { onMount } from 'svelte';

	let dashboardsPromise: Promise<any> = fetch(`${HOST}/dashboards`).then((res) => res.json());
	// });
</script>

<main class="p-4">
	<a class="text-4xl link link-hover" href="/">Microeye</a>

	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/dashboards" class="link link-hover">Dashboards</a>
			</li>
		</ul>
	</div>

	{#await dashboardsPromise}
		<p>Loading...</p>
	{:then dashboards}
		{#if dashboards.data.length === 0}
			<p>No dashboards found</p>
		{:else}
			<Table
				columns={[
					{ accessor: 'title', label: 'Name' },
					{ accessor: 'description', label: 'Description', fallback: '-' }
				]}
				data={dashboards.data}
				onRowClick={(row, e) => {
					goto(`/dashboards/${row.title}`);
				}}
			/>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
