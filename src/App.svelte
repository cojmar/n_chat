<style>
	.chat-wrapper {
		position: relative;
		width: calc(100% - 2px);
		height: calc(100% - 2px);
		box-sizing: border-box;
		background-color: rgba(51, 51, 51, 0.8);
		color: #b0a9a9;
		border: 1px solid #4c4c4c;
	}

	.chat-container {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.chat-container :global(section) {
		position: relative;
		height: 100%;
		box-sizing: border-box;
	}

	.chat-container :global(.tabs-panel) {
		height: 300px;
	}
</style>

<script>
	import SplitPane from './components/Chat/SplitPane.svelte';
	import {MessageInput, MessageList} from './components/Chat';
	import {Tabs, Tab, TabList, TabPanel} from './components/Svelteit';

	let channels = [{
		name: 'one',
		messages: [],
		users: []
	} , {
		name: 'two',
		messages: [],
		users: []
	} , {
		name: 'three',
		messages: [],
		users: []
	}];

	function handleMessage(e, tabIndex) {
		channels[tabIndex].messages[channels[tabIndex].messages.length] = e.detail;
	}
</script>

<div class="chat-wrapper">
	<div class="chat-container">
		<Tabs initialSelectedIndex={1}>
			<TabList>
				{#each channels as channel}
					<Tab>{channel.name}</Tab>
				{:else}
					<Tab>Status</Tab>
				{/each}
			</TabList>

			{#each channels as channel, tabIndex}
				<TabPanel>
					<SplitPane type="horizontal">
						<section slot="a">
							<MessageList messages="{channel.messages}" />
						</section>

						<section slot="b">
							<h1>right area</h1>
						</section>
					</SplitPane>
					<MessageInput on:message="{event => handleMessage(event, tabIndex)}" />
				</TabPanel>
			{:else}
				<TabPanel>
					<p>No messages</p>
				</TabPanel>
			{/each}
		</Tabs>
	</div>
</div>