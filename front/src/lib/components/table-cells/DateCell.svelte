<script lang="ts">
	export let value: string;

	$: date = new Date(value).toLocaleString();
</script>

{date}
