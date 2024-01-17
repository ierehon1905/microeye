<script lang="ts">
	import { goto } from '$app/navigation';

	import { deleteDashboard, fetchDashboards } from '$lib/api';
	import IdiomaticTable from '$lib/components/IdiomaticTable.svelte';
	import DateCell from '$lib/components/table-cells/DateCell.svelte';

	let dashboardsPromise = fetchDashboards();
</script>

<svelte:head>
	<title>Microeye | Dashboards</title>
</svelte:head>

<main class="p-4">
	<div class="flex justify-between">
		<div class="text-4xl">
			<a class="link link-hover" href="/">&lt;</a>
			Dashboards
		</div>
		<button
			class="btn btn-sm btn-primary"
			on:click={() => {
				goto('/dashboards/create');
			}}>Create dashboard</button
		>
	</div>

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
		{#if dashboards.isOk}
			{@const unwrapped = dashboards.value}
			{#if unwrapped.data.length === 0}
				<p>No dashboards found</p>
			{:else}
				<IdiomaticTable
					inlineBlock
					columns={[
						{ accessor: 'id', label: 'ID', fallback: '-' },
						{ accessor: 'title', label: 'Name' },
						{ accessor: 'created_at', label: 'Created at', fallback: '-', component: DateCell },
						{ accessor: 'updated_at', label: 'Updated at', fallback: '-', component: DateCell }
					]}
					data={unwrapped.data}
					onRowClick={(row, e) => {
						goto(`/dashboards/${row.title}`);
					}}
					actions={[
						{
							label: 'Edit',
							onClick: (row) => {
								goto(`/dashboards/${row.title}/edit`);
							}
						},
						{
							label: 'Delete',
							onClick: (row) => {
								deleteDashboard(row.id);
								dashboardsPromise = fetchDashboards();
							}
						}
					]}
				/>
			{/if}
		{:else}
			<p>{dashboards.error.message}</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</main>
