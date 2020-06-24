<style>
	.chat-input-wrapper {
		position: absolute;
		bottom: 0;
		left: 0;
		width: calc(100% - 16px);
		border: 1px solid #4c4c4c;
		margin: 0 2px 2px;
		height: 28px;
		padding: 5px;
	}

	.chat-input {
		height: 28px;
		overflow: hidden;
	}

	.chat-input input {
		width: calc(100% - 56px);
		background-color: #2c2c2c;
		border: 1px solid #7d7d7d;
		box-sizing: border-box;
		color: #7d7d7d;
		padding: 5px 8px;
		height: 28px;
		float: left;
		outline: none;
	}

	.chat-input input:active,
	.chat-input input:focus {
		outline: 1px solid #fff;
		outline-offset: -1px;
		color: #fff;
	}

	.chat-input button {
		background: none transparent;
		box-sizing: border-box;
		border: 1px solid #7d7d7d;
		border-left: none;
		width: 28px;
		height: 28px;
		padding: 0;
		margin: 0;
		vertical-align: middle;
		cursor: pointer;
		border-radius: 0;
		float: left;
		outline: none;
	}

	.chat-input button:hover {
		outline: 1px solid #fff;
		outline-offset: -1px;
	}

	.chat-input button svg {
		width: 24px;
		height: 24px;
		vertical-align: middle;
	}

	.chat-input button svg path {
		fill: #7d7d7d;
	}

	.chat-input button:hover svg path {
		fill: #fff;
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

<div class="chat-input-wrapper">
	<form class="chat-input" on:submit|preventDefault={handleSubmit}>
		<EmojiSelector on:emoji={onEmoji} />
		<input type="text" placeholder="Enter a message" bind:value={input} />
		<button type="submit" disabled={!input}>
			<svg viewBox="0 0 24 24">
				<path fill="#424242" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
			</svg>
		</button>
	</form>
</div>