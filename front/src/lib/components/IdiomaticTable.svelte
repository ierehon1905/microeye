<script lang="ts" generics="T">
	type ColumnDef = {
		accessor: keyof T;
		label: string;
		fallback?: string;
		component?: any;
	};

	export let inlineBlock = false;

	export let columns: ColumnDef[];
	export let data: T[];

	export let actions:
		| undefined
		| {
				label: string;
				onClick: (row: T) => void;
		  }[] = undefined;

	export let onRowClick: undefined | ((row: T, event: MouseEvent) => void) = undefined;
</script>

<div class:inline-block={inlineBlock}>
	<table class="table">
		<thead>
			<tr>
				{#each columns as column}
					<th>{column.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as row}
				<tr
					class:hover={!!onRowClick}
					class:cursor-pointer={!!onRowClick}
					on:click={(e) => onRowClick?.(row, e)}
				>
					{#each columns as column}
						<td>
							{#if column.component}
								<svelte:component this={column.component} value={row[column.accessor]} />
							{:else}
								{row[column.accessor] ?? column.fallback ?? ''}
							{/if}
						</td>
					{/each}
					{#if actions}
						<td>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<details class="dropdown" on:click|stopPropagation>
								<summary class="m-1 btn btn-xs">...</summary>
								<div class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
									<div class="join join-vertical">
										{#each actions as action}
											<button
												class="btn btn-xs join-item"
												on:click|stopPropagation={() => action.onClick(row)}
											>
												{action.label}
											</button>
										{/each}
									</div>
								</div>
							</details>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
