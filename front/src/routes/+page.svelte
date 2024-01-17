<script lang="ts">
	const links = [
		{ name: 'Space', href: '/space', description: 'Quickly explore your metrics' },
		{
			name: 'Dashboards',
			href: '/dashboards',
			description: 'Create and view your own charts dashboards'
		}
	];
</script>

<main class="p-4">
	<div class="mb-4">
		<a class="text-4xl link link-hover" href="/">Microeye</a>
	</div>

	<div class="grid gap-2">
		{#each links as link}
			<a
				href={link.href}
				class="border border-gray-600 rounded-md p-2
					   hover:border-gray-400"
			>
				<div class="text-xl">{link.name}</div>
				<p class="text-gray-500">{link.description}</p>
			</a>
		{/each}
	</div>
</main>
