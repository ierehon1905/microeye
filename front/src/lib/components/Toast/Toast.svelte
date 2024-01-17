<script lang="ts">
	import { fade } from 'svelte/transition';
	import { toasts } from './toast';
</script>

<div class="toast">
	{#each $toasts as toast (toast.id)}
		<div class={`alert alert-${toast.type}`}>
			<span>{toast.text}</span>
		</div>
	{/each}
</div>
