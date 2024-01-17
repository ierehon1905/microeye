<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AutoDashboard from '$lib/components/AutoDashboard.svelte';

	let id = $page.params.id;
</script>

<svelte:head>
	<title>Microeye | Dashboards | {id}</title>
</svelte:head>

<main class="p-4">
	<div class="flex justify-between">
		<a class="text-4xl link link-hover" href="/">Microeye</a>
		<button
			class="btn btn-sm btn-primary"
			on:click={() => {
				goto(`/dashboards/${id}/edit`);
			}}
		>
			Edit
		</button>
	</div>

	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/dashboards" class="link link-hover">Dashboards</a>
			</li>
			<li>{$page.params.id}</li>
		</ul>
	</div>

	<AutoDashboard dashId={id} fromSec={60} toSec={0} refreshIntervalSec={1} />
</main>
