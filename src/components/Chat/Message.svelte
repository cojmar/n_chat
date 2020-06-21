<style>
	.message {
		margin: 7px 0;
	}

	.message p {
		border-radius: 5px;
		padding: 5px;
		background-color: #eaeaea;
		display: inline-block;
	}

	.message.mine {
		text-align: right;
	}

	.message.mine p.text {
		background-color: #a62824;
		color: white;
	}

	.message p.author {
		background-color: white;
		font-size: 0.8em;
		display: block;
		text-decoration: none;
	}
</style>

<script>
	export let author = '';
	export let message = '';
</script>

<div class="message">
	<p class="text"><span>{author}:</span> {message}</p>
</div>