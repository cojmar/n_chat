<style>
	#message-container {
		height: calc(100% - 37px);
		overflow-y: auto;
		padding: 0 10px;
	}
</style>

<script>
	import Message from "./Message.svelte";

	export let messages = [];
</script>

<div id="message-container">
	{#each messages as message}
		<Message author="me" message={message.text} />
	{:else}
		<p>No messages</p>
	{/each}
</div>