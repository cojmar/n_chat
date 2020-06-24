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

	.chat-container :global(section p) {
		margin: 0;
	}

	.chat-container :global(.tabs) {
		height: 100%;
	}

	.chat-container :global(.tab-list) {
		height: 42px;
		overflow-x: hidden;
		overflow-y: hidden;
		white-space: nowrap;
		border-bottom: 1px solid #4c4c4c;
		border-radius: 0;
	}

	.chat-container :global(.container) {
		border: 1px solid #4c4c4c;
		border-radius: 0;
	}

	.chat-container :global(.tab-list:hover) {
		overflow-x: auto;
	}

	:global(.tab-list button) {
		color: #b0a9a9;
		border-bottom: 2px solid #7d7d7d;
		border-radius: 0;
		outline: 1px solid #7d7d7d;
		outline-offset: -2px;
	}

	:global(.tab-list button:active) {
		background-color: #7d7d7d;
		outline: 1px solid #fff;
		color: #fff;
	}

	:global(.tab-list button:hover) {
		border-bottom: 2px solid #fff;
		outline: 1px solid #fff;
	}

	:global(.tab-list button.selected) {
		color: #fff;
		border-bottom: 2px solid #fff;
		border-radius: 0;
		font-weight: normal;
	}

	.chat-container :global(.tabs-panel) {
		width: calc(100% - 6px);
		height: calc(100% - 91px);
		margin: 2px;
		padding: 0;
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
	} , {
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
			} , {
		name: 'two',
		messages: [],
		users: []
	} , {
		name: 'three',
		messages: [],
		users: []
	} , {
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
	} , {
		name: 'two',
		messages: [],
		users: []
	} , {
		name: 'three',
		messages: [],
		users: []
	} , {
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
	} , {
		name: 'two',
		messages: [],
		users: []
	} , {
		name: 'three',
		messages: [],
		users: []
	} , {
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
	} , {
		name: 'two',
		messages: [],
		users: []
	} , {
		name: 'three',
		messages: [],
		users: []
	} , {
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
	} , {
		name: 'two',
		messages: [],
		users: []
	} , {
		name: 'three',
		messages: [],
		users: []
	} , {
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
	} , {
		name: 'two',
		messages: [],
		users: []
	} , {
		name: 'three',
		messages: [],
		users: []
	} , {
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
							<p>right area</p>
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