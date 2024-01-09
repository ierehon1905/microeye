<script lang="ts" generics="T">
	type ColumnDef = {
		accessor: keyof T;
		label: string;
		fallback?: string;
		component?: any;
	};

	export let columns: ColumnDef[];
	export let data: T[];

	export let onRowClick: undefined | ((row: T, event: MouseEvent) => void) = undefined;
</script>

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				{#each columns as column}
					<th>{column.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as row}
				<!-- <tr
					class:hover={!!onRowClick}
					class:cursor-pointer={!!onRowClick}
					on:click={(e) => onRowClick?.(row, e)}
				>
					{#each columns as column}
						<td>{row[column.accessor] ?? column.fallback ?? ''}</td>
					{/each}
				</tr> -->
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
				</tr>
			{/each}
		</tbody>
	</table>
</div>
