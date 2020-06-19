<style>
	#container {
		height: 100%;
		background-color: #302f2f;
		color: #b0a9a9;
	}

	#chat-container {
		position: relative;
		height: 100%;
		overflow: hidden;
	}
</style>

<script>
	import MessageList from "./MessageList.svelte";
	import ChatInput from "./ChatInput.svelte";

	let messages = [];

	function handleMessage(e) {
		messages[messages.length] = e.detail;
	}
</script>

<div id="container">
	<div id="chat-container">
		<MessageList messages={messages} />
		<ChatInput on:message={handleMessage} />
	</div>
</div>