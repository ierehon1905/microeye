<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchDashboards } from '$lib/api';
	import IdiomaticTable from '$lib/components/IdiomaticTable.svelte';
	import Table from '$lib/components/Table.svelte';
	import DateCell from '$lib/components/table-cells/DateCell.svelte';

	let dashboardsPromise = fetchDashboards();
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
			<IdiomaticTable
				columns={[
					{ accessor: 'id', label: 'ID', fallback: '-' },
					{ accessor: 'title', label: 'Name' },
					{ accessor: 'created_at', label: 'Created at', fallback: '-', component: DateCell },
					{ accessor: 'updated_at', label: 'Updated at', fallback: '-', component: DateCell }
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
