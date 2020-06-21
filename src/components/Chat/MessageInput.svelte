<style>
	#chat-input {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 37px;
		padding-top: 5px;
		/*background-color: white;*/
	}

	#chat-input input {
		width: 90%;
		border-radius: 10px;
		border: none;
		border: 1px solid rgba(0, 0, 0, 0.2);
		padding: 5px 8px;
		float: left;
	}

	#chat-input button {
		background: none;
		border: none;
		width: 5%;
		padding-top: 2px;
		margin: 0;
	}

	#chat-input button svg {
		width: 24px;
		height: 24px;
		text-align: center;
	}

	#chat-input button:hover {
		cursor: pointer;
	}

	#chat-input button:hover svg path {
		fill: #a62824;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	import { EmojiSelector } from '../Emoji';

	const dispatch = createEventDispatcher();

	let input = '';

	function handleSubmit() {
		dispatch('message', {
			text: input,
			author: ''
		});

		input = '';
	}

	function onEmoji(event) {
		input += event.detail;
	}
</script>

<form id="chat-input" on:submit|preventDefault={handleSubmit}>
	<EmojiSelector on:emoji={onEmoji} />
	<input type="text" placeholder="Enter a message" bind:value={input} />
	<button type="submit" disabled={!input}>
		<svg viewBox="0 0 24 24">
			<path fill="#424242" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
		</svg>
	</button>
</form>