<script>
	import { page } from '$app/stores';
	import Chart from '$lib/components/Chart.svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import { nowSec } from '$lib/time';
</script>

<main class="p-4">
	<a class="text-4xl link link-hover" href="/">Microeye</a>

	<div class="breadcrumbs">
		<ul>
			<li>
				<a href="/dashboards" class="link link-hover">Dashboards</a>
			</li>
			<li>{$page.params.name}</li>
		</ul>
	</div>

	<!-- <Chart /> -->
	<Dashboard fromSec={nowSec(-999999)} toSec={nowSec()} refreshIntervalSec={1} />
</main>
