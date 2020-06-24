<style>
	.message-container {
		height: 100%;
		overflow-y: auto;
		padding: 0 10px;
	}

	.message-container p {
		margin: 0;
	}
</style>

<script>
	import Message from "./Message.svelte";

	export let messages = [];
</script>

<div class="message-container">
	{#each messages as message}
		<Message author="me" message={message.text} />
	{:else}
		<p>No messages</p>
	{/each}
</div>