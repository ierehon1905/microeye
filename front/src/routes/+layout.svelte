<script>
	import Toast from '$lib/components/Toast/Toast.svelte';

	import '../app.css';
</script>

<svelte:head>
	<title>Microeye</title>
</svelte:head>

<slot />

<Toast />
