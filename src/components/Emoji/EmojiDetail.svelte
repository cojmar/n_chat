<script>
	export let emoji;
</script>

<style>
	.svelte-emoji-picker__emoji-detail {
		border-top: 1px solid #7d7d7d;
		padding: 0.25em;
		font-size: 0.8em;
		font-weight: bold;
		height: 3em;
		line-height: 3em;
		text-align: center;
	}
</style>

<div class="svelte-emoji-picker__emoji-detail">
	{#if emoji}
		{emoji.name}
	{:else}
		&nbsp;
	{/if}
</div>
