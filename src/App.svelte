<style>
	.chat-wrapper {
		height: 100%;
		background-color: #302f2f;
		color: #b0a9a9;
	}

	.chat-container {
		position: relative;
		height: 100%;
		overflow: hidden;
	}
</style>

<script>
	import {MessageInput, MessageList} from "./components/Chat";
	import {Tabs, Tab, TabList, TabPanel} from './components/Tabs';

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
					<MessageList messages="{channel.messages}" />
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