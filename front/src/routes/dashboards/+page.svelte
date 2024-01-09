<script>
	import { goto } from '$app/navigation';
	import Table from '$lib/components/Table.svelte';
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

	<Table
		columns={[
			{ accessor: 'name', label: 'Name' },
			{ accessor: 'description', label: 'Description' }
		]}
		data={[
			{ name: 'Cpu overview', description: 'Basic CPU usage overview' },
			{ name: 'Memory overview', description: 'Basic memory usage overview' }
		]}
		onRowClick={(row, e) => {
			goto(`/dashboards/${row.name}`);
		}}
	/>
</main>
