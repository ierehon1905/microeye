<script lang="ts" generics="T">
	type ColumnDef = {
		accessor: keyof T;
		label: string;
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
			<!-- rows -->
			{#each data as row}
				<tr
					class:hover={!!onRowClick}
					class:cursor-pointer={!!onRowClick}
					on:click={(e) => onRowClick?.(row, e)}
				>
					{#each columns as column}
						<td>{row[column.accessor]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
