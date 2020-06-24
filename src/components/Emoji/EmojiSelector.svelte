<style>
	.svelte-emoji-picker {
		background: #2c2c2c;
		border: 1px solid #7d7d7d;
		/*border-radius: 5px;*/
		width: 25rem;
		height: 21rem;
		margin: 0 0.5em;
		/*box-shadow: 0 0 3px 1px #ccc;*/
	}

	.svelte-emoji-picker :global(a) {
		color: rgb(0,100,200);
		text-decoration: none;
	}

	.svelte-emoji-picker :global(a:hover) {
		text-decoration: underline;
	}

	.svelte-emoji-picker :global(a:visited) {
		color: rgb(0,80,160);
	}

	.svelte-emoji-picker :global(label) {
		display: block;
	}

	.svelte-emoji-picker :global(input, button, select, textarea) {
		/* font-family: inherit; */
		/* font-size: inherit; */
		padding: 0.4em;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 2px;
	}

	.svelte-emoji-picker :global(input:disabled) {
		color: #ccc;
	}

	.svelte-emoji-picker :global(input[type="range"]) {
		height: 0;
	}

	.svelte-emoji-picker :global(button) {
		border-color: #7d7d7d;
		outline: none;
	}

	.svelte-emoji-picker :global(button:active) {
		background-color: #7d7d7d;
	}

	.svelte-emoji-picker :global(button:hover) {
		border-color: #fff;
	}

	.svelte-emoji-picker__trigger {
		background-color: #2c2c2c;
		border: 1px solid #7d7d7d;
		border-right: none;
		color: #7d7d7d;
		width: 28px;
		height: 28px;
		padding: 0;
		cursor: pointer;
		vertical-align: top;
		float: left;
		overflow: hidden;
		border-radius: 0;
		outline: none;
	}

	.svelte-emoji-picker__trigger:hover {
		outline: 1px solid #fff;
		outline-offset: -1px;
	}

	.svelte-emoji-picker__trigger :global(svg) {
		width: 20px;
		height: 20px;
		vertical-align: middle;
	}

	.svelte-emoji-picker__trigger :global(svg path) {
		fill: #7d7d7d;
	}

	.svelte-emoji-picker__trigger:hover :global(svg path) {
		fill: #fff;
	}

	.svelte-emoji-picker__emoji-tabs {
		padding: 0.25em;
		height: 15rem;
	}

	:global(.svelte-emoji-picker__emoji-tabs .tabs .tabs-panel) {
		padding: 0;
	}

	:global(.svelte-emoji-picker__emoji-tabs .tabs .tab-list) {
		display: flex;
	}

	:global(.svelte-emoji-picker__emoji-tabs .tabs .tab-list button) {
		flex-grow: 1;
	}
</style>

<script>
	import {createEventDispatcher, onMount, tick} from 'svelte';

	import {faBuilding, faFlag, faLightbulb, faSmile} from '@fortawesome/free-regular-svg-icons';
	import {faCat, faCoffee, faFutbol, faHistory, faMusic} from '@fortawesome/free-solid-svg-icons';
	import Icon from 'fa-svelte';
	import Popper from 'popper.js';

	import ClickOutside from '../Misc/ClickOutside.svelte';
	import {Tabs, Tab, TabList, TabPanel} from '../Svelteit/';

	import EmojiDetail from './EmojiDetail.svelte';
	import EmojiList from './EmojiList.svelte';
	import EmojiSearch from './EmojiSearch.svelte';
	import EmojiSearchResults from './EmojiSearchResults.svelte';
	import VariantPopup from '../Misc/VariantPopup.svelte';

	import emojiData from './data/emoji.js';

	const smileIcon = faSmile;

	export let maxRecents = 50;
	export let autoClose = true;

	let triggerButtonEl;
	let pickerEl;
	let popper;

	let variantsVisible = false;
	let pickerVisible = false;

	let variants;
	let currentEmoji;
	let searchText;
	let recentEmojis = JSON.parse(localStorage.getItem('svelte-emoji-picker-recent')) || [];

	const dispatch = createEventDispatcher();

	const emojiCategories = {};
	emojiData.forEach(emoji => {
		let categoryList = emojiCategories[emoji.category];

		if (!categoryList) {
			categoryList = emojiCategories[emoji.category] = [];
		}

		categoryList.push(emoji);
	});

	const categoryOrder = [
		'Smileys & People',
		'Animals & Nature',
		'Food & Drink',
		'Activities',
		'Travel & Places',
		'Objects',
		'Symbols',
		'Flags'
	];

	const categoryIcons = {
		'Smileys & People': faSmile,
		'Animals & Nature': faCat,
		'Food & Drink': faCoffee,
		'Activities': faFutbol,
		'Travel & Places': faBuilding,
		'Objects': faLightbulb,
		'Symbols': faMusic,
		'Flags': faFlag
	};

	function hidePicker(event) {
		pickerVisible = false;
		searchText = '';
		popper.destroy();
	}

	async function togglePicker() {
		pickerVisible = !pickerVisible;

		if (pickerVisible) {
			await tick();
			popper = new Popper(triggerButtonEl, pickerEl, {
				placement: 'right'
			});
		} else {
			searchText = '';
			popper.destroy();
		}
	}

	function onKeyDown(event) {
		if (event.key === 'Escape') {
			hidePicker();
		}
	}

	function showEmojiDetails(event) {
		currentEmoji = event.detail;
	}

	function onEmojiClick(event) {
		if (event.detail.variants) {
			variants = event.detail.variants;
			variantsVisible = true;
		} else {
			dispatch('emoji', event.detail.emoji);
			saveRecent(event.detail);

			if (autoClose) {
				hidePicker();
			}
		}
	}

	function onVariantClick(event) {
		dispatch('emoji', event.detail.emoji);
		saveRecent(event.detail);
		hideVariants();

		if (autoClose) {
			hidePicker();
		}
	}

	function saveRecent(emoji) {
		recentEmojis = [emoji, ...recentEmojis.filter(recent => recent.key !== emoji.key)].slice(0, maxRecents);
		localStorage.setItem('svelte-emoji-picker-recent', JSON.stringify(recentEmojis));
	}

	function hideVariants() {
		// We have to defer the removal of the variants popup.
		// Otherwise, it gets removed before the click event on the body
		// happens, and the target will have a `null` parent, which
		// means it will not be excluded and the clickoutside event will fire.
		setTimeout(() => {
			variantsVisible = false;
		});
	}
</script>

<svelte:body on:keydown={onKeyDown} />

<button class="svelte-emoji-picker__trigger" bind:this={triggerButtonEl} on:click|preventDefault={togglePicker} type="button">
	<Icon icon={smileIcon} />
</button>

{#if pickerVisible}
	<ClickOutside on:clickoutside={hidePicker} exclude={[triggerButtonEl]}>
		<div class="svelte-emoji-picker" bind:this={pickerEl} on:keydown={onKeyDown}>
			<EmojiSearch bind:searchText={searchText} />
			{#if searchText}
				<EmojiSearchResults searchText={searchText} on:emojihover={showEmojiDetails} on:emojiclick={onEmojiClick}/>
			{:else}
				<div class="svelte-emoji-picker__emoji-tabs">
					<Tabs initialSelectedIndex={1}>
						<TabList>
							<Tab>
								<Icon icon={faHistory} />
							</Tab>
							{#each categoryOrder as category}
								<Tab>
									<Icon icon={categoryIcons[category]} />
								</Tab>
							{/each}
						</TabList>

						<TabPanel>
							<EmojiList name="Recently Used" emojis={recentEmojis} on:emojihover={showEmojiDetails} on:emojiclick={onEmojiClick} />
						</TabPanel>

						{#each categoryOrder as category}
							<TabPanel>
								<EmojiList name={category} emojis={emojiCategories[category]} on:emojihover={showEmojiDetails} on:emojiclick={onEmojiClick} />
							</TabPanel>
						{/each}
					</Tabs>
				</div>
			{/if}

			{#if variantsVisible}
				<VariantPopup variants={variants} on:emojiclick={onVariantClick} on:close={hideVariants}/>
			{/if}

			<EmojiDetail emoji={currentEmoji}/>
		</div>
	</ClickOutside>
{/if}