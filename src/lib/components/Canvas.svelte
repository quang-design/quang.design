<script lang="ts">
	let canvas = $state<HTMLCanvasElement | undefined>();
	let context = $state<CanvasRenderingContext2D | undefined>();
	let coords = $state({ x: 0, y: 0 });

	let isPointerDown = $state(false);
	let mousePosition = $state({ x: 0, y: 0 });

	// Add state for canvas dimensions
	let canvasWidth = $state(0);
	let canvasHeight = $state(0);
	// Add state for responsive font size
	let fontSize = $state('1rem');

	const colors = ['#ff3e00', '#ff3eff', '#3effff', '#00ff3e', '#3e00ff', '#ff0077'];

	let selected = $state(colors[0]);
	let size = $state(1);

	// Define a type for events with touches
	type TouchLike = {
		touches?: {
			[index: number]: {
				clientX: number;
				clientY: number;
			};
			length: number;
		};
	};

	// Update canvas when component mounts
	$effect(() => {
		if (!canvas) return;

		context = canvas.getContext('2d') || undefined;

		function resize() {
			if (!canvas || !context) return;

			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();

			// Set the canvas dimensions with device pixel ratio for sharp rendering
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;

			// Store canvas dimensions for text positioning
			canvasWidth = rect.width;
			canvasHeight = rect.height;

			// Calculate responsive font size based on canvas width
			// Base size is 4vw with minimum and maximum constraints
			const baseFontSize = Math.max(16, Math.min(canvasWidth * 0.04, 48));
			fontSize = `${baseFontSize}px`;

			// Scale the context to ensure correct drawing
			context.scale(dpr, dpr);
		}

		window.addEventListener('resize', resize);
		resize();

		// Track mouse movement across the entire document
		function trackMouse(e: MouseEvent) {
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			mousePosition = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};
		}

		document.addEventListener('mousemove', trackMouse);

		// Create a named handler for touchmove to properly remove it later
		const touchMoveHandler = (e: TouchEvent) => {
			if (e.touches && e.touches.length > 0) {
				const touch = e.touches[0];
				const mouseEvent = {
					clientX: touch.clientX,
					clientY: touch.clientY
				} as MouseEvent;
				trackMouse(mouseEvent);
			}
		};

		document.addEventListener('touchmove', touchMoveHandler);

		return () => {
			window.removeEventListener('resize', resize);
			document.removeEventListener('mousemove', trackMouse);
			document.removeEventListener('touchmove', touchMoveHandler);
		};
	});

	function getCanvasCoordinates(e: MouseEvent | Touch | PointerEvent | TouchEvent) {
		if (!canvas) return { x: 0, y: 0 };

		const rect = canvas.getBoundingClientRect();
		let clientX: number, clientY: number;

		// Handle both mouse and touch events
		const isTouchEvent = 'touches' in e && e.touches;
		if (isTouchEvent && e.touches.length > 0) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = 'clientX' in e ? e.clientX : 0;
			clientY = 'clientY' in e ? e.clientY : 0;
		}

		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	}

	function handlePointerDown(e: PointerEvent) {
		e.preventDefault();
		if (!context) return;

		isPointerDown = true;

		const newCoords = getCanvasCoordinates(e);
		coords = newCoords;

		// Draw a dot at the starting point
		context.fillStyle = selected;
		context.beginPath();
		context.arc(newCoords.x, newCoords.y, size / 2, 0, 2 * Math.PI);
		context.fill();
	}

	function handlePointerMove(e: PointerEvent) {
		e.preventDefault();
		if (!context) return;

		// Always update mouse position for preview
		mousePosition = getCanvasCoordinates(e);

		if (!isPointerDown) return;

		const previous = coords;
		const newCoords = getCanvasCoordinates(e);
		coords = newCoords;

		// Draw a line from previous to current position
		context.strokeStyle = selected;
		context.lineWidth = size;
		context.lineCap = 'round';
		context.beginPath();
		context.moveTo(previous.x, previous.y);
		context.lineTo(newCoords.x, newCoords.y);
		context.stroke();
	}

	function handlePointerUp() {
		isPointerDown = false;
	}
</script>

<div class="relative h-full w-full overflow-hidden">
	<canvas
		bind:this={canvas}
		class="absolute left-0 top-0 h-full w-full touch-none border border-gray-900 bg-black"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
		onpointerleave={handlePointerUp}
		style="touch-action: none;"
	></canvas>

	<!-- Text overlay in the center -->
	<div
		class="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center p-4"
	>
		<p
			style="font-family: 'Comic Sans MS', 'Comic Sans', cursive; font-size: {fontSize};"
			class="max-w-full break-words text-center text-white"
		>
			graphic design is my passion
		</p>
	</div>

	<!-- Preview cursor that always shows -->
	<div
		class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
		style="left: {mousePosition.x}px; top: {mousePosition.y}px; width: {size}px; height: {size}px; background-color: {selected};"
	></div>

	<!-- Control panel at the top right -->
	<div class="absolute left-0 top-0 z-20">
		<div class="border border-amber-500 bg-black/80 p-2 shadow-lg backdrop-blur-sm">
			<!-- Color selection -->
			<div class="mb-2 grid grid-cols-3 gap-1">
				{#each colors as color}
					<button
						class="aspect-square h-4 w-4 rounded-full shadow-md transition-all duration-100 {selected ===
						color
							? 'shadow-inner ring-1 ring-white'
							: 'hover:scale-110'}"
						style="background-color: {color}"
						aria-label={color}
						aria-current={selected === color}
						onclick={() => {
							selected = color;
						}}
					></button>
				{/each}
			</div>

			<!-- Size slider -->
			<div class="flex items-center gap-1 text-xs">
				<span>S</span>
				<input
					type="range"
					bind:value={size}
					min="1"
					max="50"
					class="h-1 w-16 appearance-none rounded-lg bg-gray-700"
				/>
				<span>L</span>
			</div>

			<!-- Current size indicator -->
			<div class="mt-1 text-center text-xs">
				<span>{size}px</span>
			</div>

			<!-- Clear canvas button -->
			<button
				class="w-full rounded-lg bg-gray-700 px-2 py-1 text-xs text-white transition-all hover:bg-gray-600"
				onclick={() => {
					if (context && canvas) {
						context.clearRect(0, 0, canvas.width, canvas.height);
					}
				}}>Clear</button
			>
		</div>
	</div>
</div>
