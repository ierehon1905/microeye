<script lang="ts">
	import { page } from '$app/stores';
	import Yagr from '@gravity-ui/yagr';
	import { onMount } from 'svelte';

	import { fetchAndDraw, fetchMetricsNames } from '$lib/api';
	import { getAbsoluteTime, nowSec } from '$lib/time';

	import '@gravity-ui/yagr/dist/index.min.css';

	import { AGG_FUNCTIONS } from '$lib/constants';
	import {
		aggFunction,
		aggWindowSec,
		fromSec,
		isRelative,
		queryName,
		refreshIntervalSec,
		toSec
	} from './params';
	import { addToast } from '$lib/components/Toast/toast';

	let refreshIntervalId: number | undefined;
	let queryLabels: Record<string, string | number> = {};

	let yagr: Yagr;

	let chart: HTMLDivElement;

	let metricsNames: string[] = [];

	function runRefresh() {
		clearInterval(refreshIntervalId);
		refreshIntervalId = setInterval(() => {
			fetchAndDraw(
				{
					name: $queryName!,
					labels: queryLabels,
					aggWindowSec: $aggWindowSec!,
					aggFunction: $aggFunction!,
					...getAbsoluteTime($fromSec!, $toSec!, $isRelative)
				},
				yagr,
				chart
			).then((newYagr) => {
				if (newYagr.isErr) {
					addToast({
						id: 'space-metrics-fetch-error',
						text: `Failed to fetch metrics: ${newYagr.error.message}`,
						type: 'error'
					});
				}
			});
		}, $refreshIntervalSec! * 1000);
	}

	onMount(() => {
		$page.url.searchParams.set('weather', 'sunny');
		fetchAndDraw(
			{
				name: $queryName!,
				labels: queryLabels,
				aggWindowSec: $aggWindowSec!,
				aggFunction: $aggFunction!,
				...getAbsoluteTime($fromSec!, $toSec!, $isRelative)
			},
			yagr,
			chart
		).then((newYagr) => {
			newYagr.match({
				Ok(value) {
					yagr = value;
				},
				Err(error) {
					addToast({
						id: 'space-metrics-fetch-error',
						text: `Failed to fetch metrics: ${error.message}`,
						type: 'error'
					});
				}
			});
		});

		if ($refreshIntervalSec && $refreshIntervalSec > 0) {
			runRefresh();
		}

		fetchMetricsNames().then((names) => {
			names.match({
				Ok(value) {
					metricsNames = value;
					if (!value.includes($queryName!)) {
						$queryName = value[0];
					}
				},
				Err(error) {
					addToast({
						id: 'space-metrics-names-fetch-error',
						text: `Failed to fetch metrics names: ${error.message}`,
						type: 'error'
					});
				}
			});
		});

		return () => {
			clearInterval(refreshIntervalId);
			yagr.dispose();
		};
	});

	let fromDateStr = new Date($fromSec! * 1000).toISOString().replace(/\..*/, '');

	function handleFromChange(e: Event) {
		$fromSec = new Date((e.target as HTMLInputElement).value).getTime() / 1000;
	}

	let toDateStr = new Date($toSec! * 1000).toISOString().replace(/\..*/, '');

	function handleToChange(e: Event) {
		$toSec = new Date((e.target as HTMLInputElement).value).getTime() / 1000;
	}

	function handleRelativeChange(e: Event) {
		const checked = (e.target as HTMLInputElement).checked;
		if (checked) {
			$fromSec = $toSec! - $fromSec!;
			$toSec = 0;
		} else {
			$fromSec = nowSec(-$fromSec!);
			$toSec = nowSec();
		}
	}

	function handleRefreshIntervalChange(e: Event) {
		const newRefreshIntervalSec = Number((e.target as HTMLInputElement).value);
		if (newRefreshIntervalSec > 0) {
			runRefresh();
		} else {
			clearInterval(refreshIntervalId);
		}
	}
</script>

<svelte:head>
	<title>Microeye | Space</title>
</svelte:head>

<main class="p-4">
	<div class="mb-4 text-4xl">
		<a class="link link-hover" href="/">&lt;</a>
		Space
	</div>

	<div class="w-full h-[300px]">
		<div bind:this={chart}></div>
	</div>
	<div class="flex flex-col gap-1">
		<div class="label">
			<span class="label-text">Name</span>
		</div>
		<select class="select select-bordered select-sm" bind:value={$queryName}>
			{#each metricsNames as metricName}
				<option value={metricName}>{metricName}</option>
			{/each}
		</select>

		<div class="flex items-center">
			<div class="label">
				<span class="label-text">Refresh interval in s</span>
			</div>
			<input
				type="number"
				placeholder="Refresh interval"
				class="input input-bordered input-sm"
				bind:value={$refreshIntervalSec}
				on:change={handleRefreshIntervalChange}
			/>
		</div>
		<div class="flex items-center">
			<div class="label">
				<span class="label-text">Aggregation window in s</span>
			</div>
			<input
				type="number"
				placeholder="Aggregation window"
				class="input input-bordered input-sm"
				bind:value={$aggWindowSec}
			/>
		</div>

		<div class="flex items-center">
			<div class="label">
				<span class="label-text">Aggregation function</span>
			</div>
			<select class="select select-bordered select-sm" bind:value={$aggFunction}>
				{#each AGG_FUNCTIONS as aggFunction}
					<option value={aggFunction}>{aggFunction}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center">
			<div class="label">
				<span class="label-text">Relative</span>
			</div>
			<input
				type="checkbox"
				class="checkbox checkbox-sm"
				bind:checked={$isRelative}
				on:change={handleRelativeChange}
			/>
		</div>

		{#if $isRelative}
			<div class="flex items-center">
				<div class="label">
					<span class="label-text">Left offset from now</span>
				</div>
				<input
					type="number"
					placeholder="From"
					class="input input-bordered input-sm"
					bind:value={$fromSec}
				/>
			</div>

			<div class="flex items-center">
				<div class="label">
					<span class="label-text">Right offset from now</span>
				</div>
				<input
					type="number"
					placeholder="To"
					class="input input-bordered input-sm"
					bind:value={$toSec}
				/>
			</div>
		{:else}
			<div class="flex items-center">
				<div class="label">
					<span class="label-text">From</span>
				</div>
				<input
					type="datetime-local"
					placeholder="From"
					class="input input-bordered input-sm"
					bind:value={fromDateStr}
					on:change={handleFromChange}
				/>
				<!-- bind:value={new Date($fromSec * 1000).toISOString()} -->
			</div>

			<div class="flex items-center">
				<div class="label">
					<span class="label-text">To</span>
				</div>
				<input
					type="datetime-local"
					placeholder="To"
					class="input input-bordered input-sm"
					bind:value={toDateStr}
					on:change={handleToChange}
				/>
			</div>
		{/if}
	</div>
</main>
