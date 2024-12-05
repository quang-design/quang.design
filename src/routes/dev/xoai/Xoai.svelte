<script lang="ts">
	import { onMount } from 'svelte';

	// Game state
	let board = $state(Array(9).fill(null));
	let aiMessage = $state("Let's play! You're X and I'm O.");
	let humanMessage = $state('');
	let inputMessage = $state('');
	let isGameOver = $state(false);
	let currentTurn = $state('X'); // X is human, O is AI

	// Winning combinations
	const winningCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8], // rows
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8], // columns
		[0, 4, 8],
		[2, 4, 6] // diagonals
	];

	// Check for winner
	function checkWinner(currentBoard: (string | null)[]) {
		for (let combo of winningCombos) {
			const [a, b, c] = combo;
			if (
				currentBoard[a] &&
				currentBoard[a] === currentBoard[b] &&
				currentBoard[a] === currentBoard[c]
			) {
				return currentBoard[a];
			}
		}
		return null;
	}

	// Check if board is full
	function isBoardFull(currentBoard: (string | null)[]) {
		return currentBoard.every((cell) => cell !== null);
	}

	// Function to fetch AI move and comment
	async function fetchAiMove() {
		try {
			const response = await fetch('/api/xoai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					board,
					isAiTurn: true
				})
			});
			const data = await response.json();
			try {
				// Parse the JSON string response from Claude
				return JSON.parse(data);
			} catch {
				return { move: null, comment: "I'm having trouble processing the move." };
			}
		} catch (error) {
			console.error('Error fetching AI move:', error);
			return { move: null, comment: "I'm having trouble thinking right now." };
		}
	}

	// Function to fetch AI response to human message
	async function fetchAiResponse(message: string) {
		try {
			const response = await fetch('/api/xoai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					board,
					isAiTurn: false,
					message
				})
			});
			const data = await response.json();
			return data; // This will be the text response from Claude
		} catch (error) {
			console.error('Error fetching AI response:', error);
			return "I'm having trouble understanding right now.";
		}
	}

	// AI move
	async function makeAiMove() {
		const { move, comment } = await fetchAiMove();
		if (move !== null) {
			board[move] = 'O';
			currentTurn = 'X';
			aiMessage = comment;
			checkGameState();
		}
	}

	// Check game state after each move
	function checkGameState() {
		const winner = checkWinner(board);
		if (winner) {
			isGameOver = true;
			aiMessage =
				winner === 'X'
					? "Congratulations! You've won! Want to play again?"
					: 'I win! Want to try again?';
		} else if (isBoardFull(board)) {
			isGameOver = true;
			aiMessage = "It's a draw! Shall we play another game?";
		}
	}

	// Handle cell click
	function handleCellClick(index: number) {
		if (board[index] || isGameOver || currentTurn !== 'X') return;

		board[index] = 'X';
		currentTurn = 'O';
		checkGameState();

		if (!isGameOver) {
			makeAiMove();
		}
	}

	// Handle sending messages
	async function handleSend() {
		if (!inputMessage.trim()) return;
		humanMessage = inputMessage;

		// Fetch AI response to human message
		const response = await fetchAiResponse(inputMessage);
		aiMessage = response;

		// Check if the AI response indicates a new game request
		if (
			response.toLowerCase().includes('new game') ||
			response.toLowerCase().includes('start') ||
			response.toLowerCase().includes('play again')
		) {
			setupGame();
		}

		inputMessage = '';
	}

	function setupGame() {
		board = Array(9).fill(null);
		isGameOver = false;
		currentTurn = 'X';
		aiMessage = "Let's play! You're X and I'm O.";
		humanMessage = '';
		inputMessage = '';
	}

	onMount(() => {
		setupGame();
	});
</script>

<div class="container mx-auto max-w-2xl space-y-6">
	<!-- AI Message Panel -->
	<div class="rounded border border-amber-400 p-2">
		<p class="text-white">{aiMessage}</p>
	</div>

	<!-- Turn Indicator -->
	<div class="text-center text-gray-400">
		{#if !isGameOver}
			Current turn:
			<div class="mt-2 flex w-full justify-center gap-2">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400 p-2 {currentTurn !==
					'X'
						? 'bg-amber-400 text-black'
						: 'text-gray-400'}"
				>
					AI
				</div>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400 p-2 {currentTurn ===
					'X'
						? 'bg-amber-400 text-black'
						: 'text-gray-400'}"
				>
					YOU
				</div>
			</div>
		{/if}
	</div>

	<!-- Game Board -->
	<div class="flex items-center justify-center gap-2">
		<div class="mx-auto grid w-full max-w-[300px] grid-cols-3 gap-2">
			{#each board as cell, i}
				<button
					class="flex aspect-square items-center justify-center rounded
					   bg-gray-100 text-4xl font-bold transition-colors hover:bg-gray-200
					   {cell === 'X' ? 'text-blue-600' : 'text-red-600'}"
					onclick={() => handleCellClick(i)}
					disabled={cell !== null || isGameOver || currentTurn !== 'X'}
				>
					{cell}
				</button>
			{/each}
		</div>
	</div>

	<!-- Human Message Display -->

	<p class="text-white">{humanMessage || 'Type a message below...'}</p>

	<!-- Input Area -->
	<div class="flex w-full flex-col gap-2 sm:flex-row">
		<input
			type="text"
			bind:value={inputMessage}
			placeholder="Type your message..."
			class="flex-1 rounded border p-2 text-base text-black"
			onkeydown={(e) => e.key === 'Enter' && handleSend()}
		/>
		<button
			onclick={handleSend}
			class="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-400"
		>
			Send
		</button>
	</div>
</div>
