import anime from 'animejs';

export type AnimateFn = (stage: HTMLElement) => void | (() => void);

export interface AnimationItem {
	title: string;
	description: string;
	animate: AnimateFn;
}

export interface AnimationSection {
	title: string;
	description: string;
	items: AnimationItem[];
}

const FG = 'var(--foreground)';
const MUT = 'var(--muted-foreground)';

function solo(stage: HTMLElement, size = 28, extra = ''): HTMLElement {
	stage.innerHTML = `<div style="width:${size}px;height:${size}px;background:${FG};${extra}"></div>`;
	return stage.firstElementChild as HTMLElement;
}

export const sections: AnimationSection[] = [
	{
		title: 'Entrances & Exits',
		description: 'How elements appear and disappear.',
		items: [
			{
				title: 'Fade in / Fade out',
				description: 'Element appears or disappears by changing opacity.',
				animate: (stage) => {
					const el = solo(stage);
					anime({
						targets: el,
						opacity: [0, 1],
						duration: 900,
						easing: 'easeInOutQuad',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Slide in',
				description: 'Element enters by sliding in from off-screen (left, right, top, or bottom).',
				animate: (stage) => {
					const el = solo(stage);
					anime({
						targets: el,
						translateX: [-50, 0],
						opacity: [0, 1],
						duration: 700,
						easing: 'easeOutCubic'
					});
				}
			},
			{
				title: 'Scale in',
				description:
					'Element grows from smaller to full size as it appears, often paired with a fade.',
				animate: (stage) => {
					const el = solo(stage);
					anime({
						targets: el,
						scale: [0, 1],
						opacity: [0, 1],
						duration: 600,
						easing: 'easeOutCubic'
					});
				}
			},
			{
				title: 'Pop in',
				description: 'Element appears with a slight overshoot, like it bounces into place.',
				animate: (stage) => {
					const el = solo(stage);
					anime({
						targets: el,
						scale: [0, 1.2, 1],
						opacity: [0, 1],
						duration: 700,
						easing: 'easeOutElastic(1, .6)'
					});
				}
			},
			{
				title: 'Reveal',
				description: 'Content is uncovered gradually, often by animating a clip-path or mask.',
				animate: (stage) => {
					const el = solo(stage);
					anime({
						targets: el,
						clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
						duration: 800,
						easing: 'easeInOutQuad'
					});
				}
			},
			{
				title: 'Enter / Exit',
				description:
					"The animation an element plays when it's added to or removed from the screen.",
				animate: (stage) => {
					const el = solo(stage);
					const tl = anime.timeline({ easing: 'easeOutCubic' });
					tl.add({
						targets: el,
						translateY: [16, 0],
						opacity: [0, 1],
						scale: [0.8, 1],
						duration: 500
					})
						.add({
							targets: el,
							translateY: -16,
							opacity: 0,
							scale: 0.8,
							duration: 500,
							easing: 'easeInCubic',
							delay: 400
						})
						.add({
							targets: el,
							translateY: [16, 0],
							opacity: [0, 1],
							scale: [0.8, 1],
							duration: 500,
							delay: 200
						});
				}
			}
		]
	},

	{
		title: 'Sequencing & Timing',
		description: 'Coordinating multiple elements or moments.',
		items: [
			{
				title: 'Keyframes',
				description:
					'Defined points in an animation (0%, 50%, 100%) that the browser fills the gaps between.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						keyframes: [
							{ translateX: -28, translateY: 28 },
							{ translateX: 28, translateY: 28 },
							{ translateX: 28, translateY: -28 },
							{ translateX: -28, translateY: -28 }
						],
						duration: 2000,
						easing: 'easeInOutQuad'
					});
				}
			},
			{
				title: 'Interpolation / Tween',
				description:
					'Generating all the in-between frames between a start and end value, so motion is continuous.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1200,
						easing: 'linear',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Stagger',
				description:
					'Animate several items one after another with a small delay between each, creating a cascade.',
				animate: (stage) => {
					stage.innerHTML = Array.from(
						{ length: 5 },
						(_, i) =>
							`<div style="position:absolute;left:${10 + i * 16}px;bottom:10px;width:10px;height:24px;background:${FG};opacity:0;transform:translateY(20px);"></div>`
					).join('');
					anime({
						targets: stage.children,
						translateY: [20, 0],
						opacity: [0, 1],
						delay: anime.stagger(80),
						duration: 500,
						easing: 'easeOutCubic'
					});
				}
			},
			{
				title: 'Orchestration',
				description:
					'Deliberately timing multiple animations so they feel like one coordinated motion.',
				animate: (stage) => {
					stage.innerHTML = [0, 1, 2]
						.map(
							(i) =>
								`<div style="position:absolute;left:${16 + i * 24}px;top:34px;width:18px;height:18px;background:${FG};transform:scale(0);"></div>`
						)
						.join('');
					const els = stage.querySelectorAll('div');
					const tl = anime.timeline({ easing: 'easeOutCubic' });
					tl.add({ targets: els[0], scale: [0, 1], duration: 300 })
						.add({ targets: els[1], scale: [0, 1], duration: 300 }, '-=150')
						.add({ targets: els[2], scale: [0, 1], duration: 300 }, '-=150')
						.add({ targets: els, translateY: -20, duration: 400 }, '+=100');
				}
			},
			{
				title: 'Delay',
				description: 'Time before an animation starts.',
				animate: (stage) => {
					const el = solo(stage);
					anime({
						targets: el,
						translateX: [-30, 0],
						opacity: [0, 1],
						delay: 600,
						duration: 600,
						easing: 'easeOutCubic'
					});
				}
			},
			{
				title: 'Duration',
				description: 'How long an animation takes.',
				animate: (stage) => {
					stage.innerHTML = [0, 1]
						.map(
							(i) =>
								`<div style="position:absolute;left:12px;top:${26 + i * 24}px;width:0;height:10px;background:${i === 0 ? FG : MUT};opacity:${i === 0 ? 1 : 0.5};"></div>`
						)
						.join('');
					const els = stage.querySelectorAll('div');
					anime({ targets: els[0], width: 72, duration: 600, easing: 'easeInOutQuad' });
					anime({ targets: els[1], width: 72, duration: 1800, easing: 'easeInOutQuad' });
				}
			},
			{
				title: 'Fill mode',
				description:
					"Whether an element keeps its first or last frame's styles before the animation starts or after it ends (e.g. forwards).",
				animate: (stage) => {
					const el = solo(stage);
					anime({
						targets: el,
						translateX: [0, 28],
						duration: 800,
						easing: 'easeOutCubic'
					});
				}
			},
			{
				title: 'Stepped animation',
				description: 'An animation that is divided into discrete steps, like a countdown timer.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						rotate: [0, 360],
						duration: 1600,
						easing: 'steps(8)',
						loop: 2
					});
				}
			}
		]
	},

	{
		title: 'Movement & Transforms',
		description: "Changing an element's position, size, or angle.",
		items: [
			{
				title: 'Translate',
				description: 'Move an element along the X or Y axis.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-28, 28],
						duration: 1000,
						easing: 'easeInOutQuad',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Scale',
				description: 'Make an element bigger or smaller.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						scale: [0.5, 1.5],
						duration: 800,
						easing: 'easeInOutQuad',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Rotate',
				description: 'Spin an element around a point.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						rotate: 360,
						duration: 1200,
						easing: 'easeInOutQuad',
						loop: 2
					});
				}
			},
			{
				title: 'Skew',
				description:
					'Slant an element along the X or Y axis, shearing it out of its rectangular shape.',
				animate: (stage) => {
					const el = solo(stage, 28);
					anime({
						targets: el,
						skewX: [0, 25, -25, 0],
						duration: 1600,
						easing: 'easeInOutSine'
					});
				}
			},
			{
				title: '3D tilt / Flip',
				description: 'Rotate in 3D space (rotateX / rotateY) to add depth.',
				animate: (stage) => {
					stage.innerHTML = `<div style="perspective:300px;"><div style="width:28px;height:28px;background:${FG};"></div></div>`;
					const el = stage.querySelector('div > div') as HTMLElement;
					anime({
						targets: el,
						rotateY: [0, 360],
						duration: 1400,
						easing: 'easeInOutQuad'
					});
				}
			},
			{
				title: 'Perspective',
				description:
					'How strong the 3D effect looks — a lower value exaggerates depth, like the viewer is closer.',
				animate: (stage) => {
					stage.innerHTML = `<div style="perspective:120px;"><div style="width:28px;height:28px;background:${FG};"></div></div>`;
					const el = stage.querySelector('div > div') as HTMLElement;
					anime({
						targets: el,
						rotateY: [0, 45, -45, 0],
						duration: 2000,
						easing: 'easeInOutSine'
					});
				}
			},
			{
				title: 'Transform origin',
				description: 'The anchor point a scale or rotation grows or spins from.',
				animate: (stage) => {
					const el = solo(stage, 24);
					el.style.transformOrigin = '0 0';
					anime({
						targets: el,
						rotate: [0, 90, 0],
						duration: 1400,
						easing: 'easeInOutQuad'
					});
				}
			},
			{
				title: 'Origin-aware animation',
				description:
					'An element animates out of its trigger, like a popover growing from the button that opened it instead of from its own center which is the default in CSS.',
				animate: (stage) => {
					const el = solo(stage, 28);
					el.style.transformOrigin = '100% 100%';
					anime({
						targets: el,
						scale: [0, 1],
						opacity: [0, 1],
						duration: 600,
						easing: 'easeOutCubic'
					});
				}
			}
		]
	},

	{
		title: 'Transitions Between States',
		description: 'Connecting one state, view, or element to another.',
		items: [
			{
				title: 'Crossfade',
				description: 'One element fades out as another fades in, in the same spot.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;width:28px;height:28px;background:${FG};left:34px;top:34px;"></div><div style="position:absolute;width:28px;height:28px;border-radius:50%;background:${MUT};left:34px;top:34px;opacity:0;"></div>`;
					const els = stage.querySelectorAll('div');
					const tl = anime.timeline({ easing: 'easeInOutQuad' });
					tl.add({ targets: els[0], opacity: [1, 0], duration: 800 }).add(
						{ targets: els[1], opacity: [0, 1], duration: 800 },
						'-=600'
					);
				}
			},
			{
				title: 'Continuity transition',
				description:
					'A change that keeps the user oriented by visually connecting before and after. For example, making the same rectangle bigger and smaller.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						scale: [1, 1.6, 1],
						width: [24, 48, 24],
						duration: 1600,
						easing: 'easeInOutQuad'
					});
				}
			},
			{
				title: 'Morph',
				description: 'One shape smoothly turns into another shape, e.g. Dynamic Island.',
				animate: (stage) => {
					const el = solo(stage, 28);
					anime({
						targets: el,
						borderRadius: ['0%', '50%', '0%'],
						width: [28, 36, 28],
						height: [28, 36, 28],
						duration: 1600,
						easing: 'easeInOutQuad'
					});
				}
			},
			{
				title: 'Shared element transition',
				description:
					'An element travels and transforms from one position into another, like a thumbnail expanding into a card.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:8px;top:68px;width:16px;height:16px;background:${FG};"></div>`;
					const el = stage.firstElementChild as HTMLElement;
					anime({
						targets: el,
						left: [8, 28],
						top: [68, 24],
						width: [16, 40],
						height: [16, 40],
						duration: 900,
						easing: 'easeInOutCubic'
					});
				}
			},
			{
				title: 'Layout animation',
				description:
					"When an element's size or position changes, it animates to the new spot instead of snapping.",
				animate: (stage) => {
					const el = solo(stage, 22);
					anime({
						targets: el,
						translateX: [-28, 28],
						duration: 800,
						easing: 'easeInOutCubic',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Accordion / Collapse',
				description: 'A section smoothly expands and collapses its height to show or hide content.',
				animate: (stage) => {
					stage.innerHTML = `<div style="width:60px;height:8px;background:${FG};overflow:hidden;"></div>`;
					const el = stage.firstElementChild as HTMLElement;
					anime({
						targets: el,
						height: [8, 50, 8],
						duration: 1600,
						easing: 'easeInOutQuad'
					});
				}
			},
			{
				title: 'Direction-aware transition',
				description:
					'Content slides one way going forward and the opposite way going back, so navigation has a sense of direction.',
				animate: (stage) => {
					const el = solo(stage, 24);
					const tl = anime.timeline({ easing: 'easeInOutCubic' });
					tl.add({
						targets: el,
						translateX: [0, -60],
						opacity: [1, 0],
						duration: 500
					})
						.add(
							{
								targets: el,
								translateX: [60, 0],
								opacity: [0, 1],
								duration: 500
							},
							'+=100'
						)
						.add(
							{
								targets: el,
								translateX: [0, 60],
								opacity: [1, 0],
								duration: 500
							},
							'+=400'
						)
						.add(
							{
								targets: el,
								translateX: [-60, 0],
								opacity: [0, 1],
								duration: 500
							},
							'+=100'
						);
				}
			}
		]
	},

	{
		title: 'Scroll',
		description: 'Motion tied to scrolling or navigating between views.',
		items: [
			{
				title: 'Scroll reveal',
				description: 'Elements fade or slide into place as they enter the viewport.',
				animate: (stage) => {
					stage.innerHTML = [0, 1, 2]
						.map(
							(i) =>
								`<div style="position:absolute;left:${14 + i * 24}px;top:60px;width:18px;height:18px;background:${FG};opacity:0;"></div>`
						)
						.join('');
					anime({
						targets: stage.children,
						translateY: [20, -16],
						opacity: [0, 1],
						delay: anime.stagger(120),
						duration: 600,
						easing: 'easeOutCubic'
					});
				}
			},
			{
				title: 'Scroll-driven animation',
				description: 'An animation whose progress is tied directly to scroll position.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:10px;top:43px;width:76px;height:6px;background:${MUT};opacity:0.2;border-radius:3px;"><div style="width:0;height:100%;background:${FG};border-radius:3px;"></div></div>`;
					const bar = stage.querySelector('div > div') as HTMLElement;
					anime({
						targets: bar,
						width: ['0%', '100%'],
						duration: 1600,
						easing: 'linear'
					});
				}
			},
			{
				title: 'Parallax',
				description:
					'Background and foreground move at different speeds while scrolling, creating depth.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:10px;top:30px;width:20px;height:20px;background:${MUT};opacity:0.4;"></div><div style="position:absolute;left:40px;top:40px;width:24px;height:24px;background:${FG};"></div>`;
					const els = stage.querySelectorAll('div');
					anime({
						targets: els[0],
						translateX: 30,
						duration: 1600,
						easing: 'easeInOutQuad',
						direction: 'alternate',
						loop: 2
					});
					anime({
						targets: els[1],
						translateX: 14,
						duration: 1600,
						easing: 'easeInOutQuad',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Page transition',
				description: 'An animation that plays when navigating from one page or route to another.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:20px;top:24px;width:56px;height:48px;background:${FG};opacity:0.2;"></div>`;
					const el = stage.firstElementChild as HTMLElement;
					const tl = anime.timeline({ easing: 'easeInOutCubic' });
					tl.add({ targets: el, translateX: -90, opacity: 0, duration: 500 }).add({
						targets: el,
						translateX: [90, 0],
						opacity: [0, 0.2],
						duration: 500
					});
				}
			},
			{
				title: 'View transition',
				description: 'The browser morphs between two states or pages, connecting shared elements.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:10px;top:60px;width:20px;height:20px;background:${FG};border-radius:2px;"></div>`;
					const el = stage.firstElementChild as HTMLElement;
					anime({
						targets: el,
						left: [10, 24],
						top: [60, 16],
						width: [20, 48],
						height: [20, 48],
						borderRadius: ['2px', '8px'],
						duration: 1000,
						easing: 'easeInOutCubic',
						direction: 'alternate',
						loop: 2
					});
				}
			}
		]
	},

	{
		title: 'Feedback & Interaction',
		description: "Responding to the user's actions.",
		items: [
			{
				title: 'Hover effect',
				description: 'Visual change when the cursor moves over an element.',
				animate: (stage) => {
					const el = solo(stage, 28);
					anime({
						targets: el,
						scale: [1, 1.2],
						duration: 400,
						easing: 'easeOutCubic',
						direction: 'alternate',
						loop: 4
					});
				}
			},
			{
				title: 'Press / Tap feedback',
				description: 'A subtle scale-down when an element is clicked, so it feels physical.',
				animate: (stage) => {
					const el = solo(stage, 28);
					anime({
						targets: el,
						scale: [1, 0.82, 1],
						duration: 400,
						easing: 'easeInOutQuad',
						loop: 3
					});
				}
			},
			{
				title: 'Hold to confirm',
				description: 'A progress effect that fills up while the user holds a button.',
				animate: (stage) => {
					stage.innerHTML = `<div style="width:60px;height:8px;background:${MUT};opacity:0.2;border-radius:4px;overflow:hidden;"><div style="width:0;height:100%;background:${FG};border-radius:4px;"></div></div>`;
					const bar = stage.querySelector('div > div') as HTMLElement;
					anime({
						targets: bar,
						width: ['0%', '100%'],
						duration: 1500,
						easing: 'linear'
					});
				}
			},
			{
				title: 'Drag',
				description: 'Moving an element by grabbing it, often with momentum when released.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-28, 28],
						duration: 700,
						easing: 'easeOutBack'
					});
				}
			},
			{
				title: 'Drag to reorder',
				description:
					'Dragging items in a list to rearrange them, while the others shift to make room.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:16px;top:26px;width:20px;height:20px;background:${FG};"></div><div style="position:absolute;left:16px;top:50px;width:20px;height:20px;background:${MUT};opacity:0.5;"></div>`;
					const els = stage.querySelectorAll('div');
					const tl = anime.timeline({ easing: 'easeInOutCubic' });
					tl.add({ targets: els[0], translateY: 24, translateX: 30, duration: 400 })
						.add({ targets: els[1], translateY: -24, duration: 300 }, '-=200')
						.add({ targets: els[0], translateX: 0, duration: 300 });
				}
			},
			{
				title: 'Swipe to dismiss',
				description: 'Dragging an element off-screen to close it, like a drawer or toast.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [0, 80],
						opacity: [1, 0],
						rotate: [0, 8],
						duration: 600,
						easing: 'easeInCubic'
					});
				}
			},
			{
				title: 'Rubber-banding',
				description:
					'Resistance and snap-back when you drag past a boundary (the iOS overscroll feel).',
				animate: (stage) => {
					const el = solo(stage, 24);
					const tl = anime.timeline({ easing: 'easeOutQuad' });
					tl.add({ targets: el, translateX: 36, duration: 300 }).add({
						targets: el,
						translateX: 0,
						duration: 600,
						easing: 'easeOutElastic(1, .4)'
					});
				}
			},
			{
				title: 'Shake / Wiggle',
				description: 'A quick side-to-side jitter signaling an error or rejected input.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [0, -10, 10, -8, 8, -4, 4, 0],
						duration: 500,
						easing: 'easeInOutSine'
					});
				}
			},
			{
				title: 'Ripple',
				description: 'A circle expanding from the point of a tap, confirming the press.',
				animate: (stage) => {
					stage.innerHTML = `<div style="width:12px;height:12px;border-radius:50%;background:${FG};"></div>`;
					const el = stage.firstElementChild as HTMLElement;
					anime({
						targets: el,
						scale: [0, 4],
						opacity: [0.7, 0],
						duration: 800,
						easing: 'easeOutCubic'
					});
				}
			}
		]
	},

	{
		title: 'Easing',
		description: 'How speed changes over an animation.',
		items: [
			{
				title: 'Easing',
				description: 'The rate at which an animation speeds up or slows down.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1000,
						easing: 'easeInOutQuad',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Ease-out',
				description:
					'Starts fast, ends slow. The default for most UI and anything responding to the user.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1000,
						easing: 'easeOutCubic',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Ease-in',
				description: 'Starts slow, ends fast. Usually avoided; can feel sluggish.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1000,
						easing: 'easeInCubic',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Ease-in-out',
				description: 'Slow, fast, slow. Good for elements already on screen moving from A to B.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1000,
						easing: 'easeInOutCubic',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Linear',
				description: 'Constant speed. Avoid for UI; reserve for spinners or marquees.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1000,
						easing: 'linear',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Cubic-bezier',
				description: 'A custom easing curve you define for precise control.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1000,
						easing: 'cubicBezier(.68, -.55, .27, 1.55)',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Asymmetric easing',
				description:
					'A curve that accelerates and decelerates at different rates. Feels more alive than a symmetric one.',
				animate: (stage) => {
					const el = solo(stage, 20);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1000,
						easing: 'cubicBezier(.05, .7, .1, 1)',
						direction: 'alternate',
						loop: 2
					});
				}
			}
		]
	},

	{
		title: 'Spring Animations',
		description: 'Physics-based motion as an alternative to fixed-duration easing.',
		items: [
			{
				title: 'Spring',
				description:
					'Motion driven by physics (tension, mass, damping) rather than a set duration.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-30, 30],
						easing: 'spring(1, 80, 10, 0)'
					});
				}
			},
			{
				title: 'Stiffness / Tension',
				description: 'How strongly the spring pulls toward its target. Higher feels snappier.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-30, 30],
						easing: 'spring(1, 200, 14, 0)'
					});
				}
			},
			{
				title: 'Damping',
				description:
					'How quickly a spring settles. Lower damping means more bounce and oscillation.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-30, 30],
						easing: 'spring(1, 80, 4, 0)'
					});
				}
			},
			{
				title: 'Mass',
				description:
					'How heavy the animated element feels. More mass makes it slower and more sluggish.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-30, 30],
						easing: 'spring(4, 80, 12, 0)'
					});
				}
			},
			{
				title: 'Bounce',
				description: 'A spring that overshoots and settles, adding playfulness.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateY: [-30, 10],
						easing: 'easeOutBounce',
						duration: 1200
					});
				}
			},
			{
				title: 'Perceptual duration',
				description:
					'How long a spring feels finished, even though it keeps micro-settling underneath.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-30, 30],
						easing: 'spring(1, 100, 8, 0)'
					});
				}
			},
			{
				title: 'Momentum',
				description: 'Motion that carries velocity, especially after a drag or interruption.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-34, 34],
						duration: 1400,
						easing: 'easeOutQuart'
					});
				}
			},
			{
				title: 'Velocity',
				description:
					'How fast and in which direction an element is moving. A spring carries it into the next animation when interrupted, so a flicked element keeps its speed.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-34, 34],
						duration: 900,
						easing: 'easeOutExpo'
					});
				}
			},
			{
				title: 'Interruptible animation',
				description:
					'An animation that can be smoothly redirected mid-flight instead of finishing first.',
				animate: (stage) => {
					const el = solo(stage, 22);
					const tl = anime.timeline({ easing: 'easeOutCubic' });
					tl.add({ targets: el, translateX: 34, duration: 500 }).add(
						{ targets: el, translateY: -28, translateX: 10, duration: 500 },
						250
					);
				}
			}
		]
	},

	{
		title: 'Looping & Ambient Motion',
		description: 'Animations that run on their own.',
		items: [
			{
				title: 'Marquee',
				description: 'Text or content that scrolls continuously in a loop.',
				animate: (stage) => {
					const items = Array.from(
						{ length: 8 },
						(_, i) =>
							`<div style="width:14px;height:14px;background:${i % 2 === 0 ? FG : MUT};opacity:${i % 2 === 0 ? 1 : 0.4};flex-shrink:0;"></div>`
					).join('');
					stage.innerHTML = `<div style="display:flex;gap:8px;position:absolute;left:0;top:41px;">${items}</div>`;
					const strip = stage.firstElementChild as HTMLElement;
					anime({
						targets: strip,
						translateX: [0, -88],
						duration: 3000,
						easing: 'linear',
						loop: true
					});
					return () => anime.remove(strip);
				}
			},
			{
				title: 'Loop',
				description: 'An animation that repeats, a set number of times or infinitely.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						rotate: 360,
						duration: 1500,
						easing: 'linear',
						loop: true
					});
					return () => anime.remove(el);
				}
			},
			{
				title: 'Alternate (yoyo)',
				description:
					'A loop that plays forward then reverses each iteration, instead of jumping back to the start.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateX: [-28, 28],
						duration: 1000,
						easing: 'easeInOutSine',
						direction: 'alternate',
						loop: true
					});
					return () => anime.remove(el);
				}
			},
			{
				title: 'Orbit',
				description: 'An element circling around another in a continuous path.',
				animate: (stage) => {
					stage.innerHTML = `<div style="width:8px;height:8px;border-radius:50%;background:${MUT};opacity:0.5;"></div><div style="position:absolute;left:48px;top:48px;width:0;height:0;"><div style="position:absolute;left:22px;top:-7px;width:14px;height:14px;background:${FG};border-radius:50%;"></div></div>`;
					const orbit = stage.children[1] as HTMLElement;
					anime({
						targets: orbit,
						rotate: 360,
						duration: 2000,
						easing: 'linear',
						loop: true
					});
					return () => anime.remove(orbit);
				}
			},
			{
				title: 'Pulse',
				description: 'A gentle repeating scale or opacity change to draw attention.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						scale: [1, 1.35],
						opacity: [1, 0.6],
						duration: 800,
						easing: 'easeInOutSine',
						direction: 'alternate',
						loop: true
					});
					return () => anime.remove(el);
				}
			},
			{
				title: 'Float',
				description:
					'A gentle, continuous up-and-down drift that makes a static element feel alive and weightless.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateY: [-8, 8],
						duration: 1500,
						easing: 'easeInOutSine',
						direction: 'alternate',
						loop: true
					});
					return () => anime.remove(el);
				}
			},
			{
				title: 'Idle animation',
				description:
					'Subtle motion that plays while an element is just sitting there, waiting to be interacted with.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						rotate: [-3, 3],
						scale: [1, 1.04],
						duration: 2000,
						easing: 'easeInOutSine',
						direction: 'alternate',
						loop: true
					});
					return () => anime.remove(el);
				}
			}
		]
	},

	{
		title: 'Polish & Effects',
		description: 'The small touches that separate good from great.',
		items: [
			{
				title: 'Blur',
				description: 'A blur filter used to soften an element or mask tiny imperfections.',
				animate: (stage) => {
					const el = solo(stage, 28);
					const o = { v: 0 };
					anime({
						targets: o,
						v: [0, 6, 0],
						duration: 1600,
						easing: 'easeInOutSine',
						update: () => {
							el.style.filter = `blur(${o.v}px)`;
						}
					});
					return () => anime.remove(o);
				}
			},
			{
				title: 'Clip-path',
				description:
					'Clipping an element to a shape, used for reveals, masks, and before/after sliders.',
				animate: (stage) => {
					const el = solo(stage, 32);
					anime({
						targets: el,
						clipPath: ['circle(0% at 50% 50%)', 'circle(70% at 50% 50%)'],
						duration: 1000,
						easing: 'easeInOutQuad',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Mask',
				description:
					'Hiding or revealing parts of an element using a shape or gradient — like clip-path, but with soft, fadeable edges.',
				animate: (stage) => {
					const el = solo(stage, 32);
					const o = { r: 0 };
					anime({
						targets: o,
						r: [0, 120],
						duration: 1200,
						easing: 'easeInOutQuad',
						update: () => {
							const m = `radial-gradient(circle at center, #000 ${Math.max(0, o.r - 30)}%, transparent ${o.r}%)`;
							el.style.setProperty('-webkit-mask-image', m);
							el.style.setProperty('mask-image', m);
						}
					});
					return () => anime.remove(o);
				}
			},
			{
				title: 'Before / after slider',
				description: 'A draggable divider that wipes between two overlaid images to compare them.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:8px;top:28px;width:80px;height:40px;background:${MUT};opacity:0.3;"></div><div style="position:absolute;left:8px;top:28px;width:80px;height:40px;background:${FG};clip-path:inset(0 50% 0 0);"></div><div style="position:absolute;left:48px;top:26px;width:2px;height:44px;background:${FG};"></div>`;
					const top = stage.children[1] as HTMLElement;
					const line = stage.children[2] as HTMLElement;
					const o = { p: 50 };
					anime({
						targets: o,
						p: [20, 80],
						duration: 2000,
						easing: 'easeInOutSine',
						direction: 'alternate',
						loop: true,
						update: () => {
							top.style.clipPath = `inset(0 ${100 - o.p}% 0 0)`;
							line.style.left = `${8 + o.p * 0.8}px`;
						}
					});
					return () => anime.remove(o);
				}
			},
			{
				title: 'Line drawing',
				description: 'An SVG path that draws itself in, like an invisible pen tracing it.',
				animate: (stage) => {
					stage.innerHTML = `<svg viewBox="0 0 80 80" width="80" height="80" fill="none" stroke="${FG}" stroke-width="2.5" stroke-linecap="round"><path d="M10 60 Q 25 10, 40 40 T 70 20"/></svg>`;
					const path = stage.querySelector('path') as SVGPathElement;
					anime({
						targets: path,
						strokeDashoffset: [anime.setDashoffset, 0],
						duration: 1400,
						easing: 'easeInOutSine'
					});
				}
			},
			{
				title: 'Text morph',
				description:
					'Text that animates character by character when it changes, drawing attention to the new value.',
				animate: (stage) => {
					stage.innerHTML = `<div style="perspective:200px;"><span style="display:inline-block;font-size:28px;font-weight:bold;color:${FG};">A</span></div>`;
					const el = stage.querySelector('span') as HTMLElement;
					const tl = anime.timeline({ easing: 'easeInQuad' });
					tl.add({
						targets: el,
						rotateX: 90,
						opacity: 0,
						duration: 300,
						complete: () => {
							el.textContent = 'B';
						}
					}).add({
						targets: el,
						rotateX: [-90, 0],
						opacity: [0, 1],
						duration: 300,
						easing: 'easeOutQuad'
					});
				}
			},
			{
				title: 'Skeleton / Shimmer',
				description: 'A placeholder with a moving sheen shown while content loads.',
				animate: (stage) => {
					stage.innerHTML = `<div style="width:72px;height:10px;border-radius:4px;background:${MUT};opacity:0.15;margin-bottom:6px;"></div><div style="width:52px;height:10px;border-radius:4px;background:${MUT};opacity:0.15;"></div>`;
					const o = { x: -80 };
					const els = stage.querySelectorAll('div');
					anime({
						targets: o,
						x: [-80, 96],
						duration: 1500,
						easing: 'linear',
						loop: true,
						update: () => {
							els.forEach((el) => {
								(el as HTMLElement).style.backgroundImage =
									`linear-gradient(90deg, transparent, rgba(128,128,128,0.15) ${o.x}px, transparent ${o.x + 40}px)`;
							});
						}
					});
					return () => anime.remove(o);
				}
			},
			{
				title: 'Number ticker',
				description: 'Digits rolling or counting up to a value.',
				animate: (stage) => {
					stage.innerHTML = `<span style="font-size:28px;font-weight:bold;color:${FG};font-variant-numeric:tabular-nums;">0</span>`;
					const el = stage.firstElementChild as HTMLElement;
					const o = { n: 0 };
					anime({
						targets: o,
						n: 42,
						round: 1,
						duration: 1400,
						easing: 'easeOutExpo',
						update: () => {
							el.textContent = String(o.n);
						}
					});
					return () => anime.remove(o);
				}
			},
			{
				title: 'Tabular numbers',
				description:
					"Fixed-width digits so numbers don't shift around as they change. Essential for tickers, timers, and counters.",
				animate: (stage) => {
					stage.innerHTML = `<span style="font-size:24px;font-weight:bold;color:${FG};font-variant-numeric:tabular-nums;letter-spacing:2px;">00:00</span>`;
					const el = stage.firstElementChild as HTMLElement;
					const o = { n: 0 };
					anime({
						targets: o,
						n: 59,
						round: 1,
						duration: 2000,
						easing: 'linear',
						update: () => {
							const m = Math.floor(o.n / 60);
							const s = o.n % 60;
							el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
						}
					});
					return () => anime.remove(o);
				}
			},
			{
				title: 'Typewriter',
				description: 'Text appearing one character at a time, as if being typed.',
				animate: (stage) => {
					const text = 'design';
					stage.innerHTML = `<span style="font-size:22px;font-weight:bold;color:${FG};border-right:2px solid ${FG};padding-right:2px;"></span>`;
					const el = stage.firstElementChild as HTMLElement;
					const o = { i: 0 };
					anime({
						targets: o,
						i: text.length,
						round: 1,
						duration: 1200,
						easing: `steps(${text.length})`,
						update: () => {
							el.textContent = text.slice(0, o.i);
						}
					});
					return () => anime.remove(o);
				}
			}
		]
	},

	{
		title: 'Performance',
		description: 'What keeps motion smooth instead of stuttering.',
		items: [
			{
				title: 'Frame rate (FPS)',
				description:
					'Frames drawn per second. 60fps is the baseline for smooth motion; 120fps on newer displays.',
				animate: (stage) => {
					const el = solo(stage, 22);
					anime({
						targets: el,
						rotate: 360,
						duration: 1000,
						easing: 'linear',
						loop: 3
					});
				}
			},
			{
				title: 'Jank',
				description:
					"Visible stutter when the browser drops frames because it can't keep up with the animation.",
				animate: (stage) => {
					const el = solo(stage, 22);
					anime({
						targets: el,
						translateX: [-30, 30],
						duration: 1200,
						easing: 'steps(4)',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Dropped frame',
				description:
					'A frame the browser missed its deadline to draw, causing a tiny hitch in motion.',
				animate: (stage) => {
					const el = solo(stage, 22);
					anime({
						targets: el,
						keyframes: [
							{ translateX: -30 },
							{ translateX: -10 },
							{ translateX: -10 },
							{ translateX: 10 },
							{ translateX: 30 }
						],
						duration: 1200,
						easing: 'linear'
					});
				}
			},
			{
				title: 'Compositing',
				description:
					'Letting the GPU move or fade an element on its own layer without redoing layout or paint.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						translateY: [0, -12],
						scale: [1, 1.05],
						boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 8px 20px rgba(0,0,0,0.2)'],
						duration: 800,
						easing: 'easeOutCubic',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'will-change',
				description:
					'A CSS hint that an element is about to animate, so the browser can promote it to its own layer ahead of time.',
				animate: (stage) => {
					const el = solo(stage, 24);
					el.style.outline = `2px dashed ${MUT}`;
					el.style.outlineOffset = '4px';
					anime({
						targets: el,
						translateX: [-24, 24],
						opacity: [0.5, 1],
						delay: 400,
						duration: 800,
						easing: 'easeOutCubic'
					});
				}
			},
			{
				title: 'Layout thrashing',
				description:
					'Animating properties like width, height, top, or left that force the browser to recalculate layout every frame, causing jank.',
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						width: [24, 50, 24],
						height: [24, 50, 24],
						duration: 1200,
						easing: 'steps(6)'
					});
				}
			}
		]
	},

	{
		title: 'Principles to Know',
		description: 'Concepts that guide when and how to animate.',
		items: [
			{
				title: 'Purposeful animation',
				description:
					'Motion should serve a function — orient, give feedback, show relationships — not just decorate.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:58px;top:37px;width:22px;height:22px;border:2px dashed ${MUT};box-sizing:border-box;"></div><div style="position:absolute;left:14px;top:37px;width:22px;height:22px;background:${FG};"></div>`;
					const box = stage.children[1] as HTMLElement;
					anime({
						targets: box,
						left: [14, 58],
						duration: 800,
						easing: 'easeInOutCubic'
					});
				}
			},
			{
				title: 'Anticipation',
				description:
					"A small wind-up in the opposite direction before a move, hinting at what's about to happen.",
				animate: (stage) => {
					const el = solo(stage, 24);
					anime({
						targets: el,
						keyframes: [
							{
								translateX: 18,
								scaleX: 0.8,
								duration: 400,
								easing: 'easeOutQuad'
							},
							{
								translateX: -34,
								scaleX: 1.1,
								duration: 450,
								easing: 'easeOutCubic'
							},
							{
								translateX: 0,
								scaleX: 1,
								duration: 500,
								easing: 'easeOutElastic(1, .6)'
							}
						]
					});
				}
			},
			{
				title: 'Follow-through',
				description:
					'Parts of an element keep moving and settle slightly after the main motion stops, adding weight.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:28px;top:38px;width:22px;height:22px;background:${FG};"></div><div style="position:absolute;left:52px;top:43px;width:12px;height:12px;background:${MUT};border-radius:50%;"></div>`;
					const main = stage.children[0] as HTMLElement;
					const tail = stage.children[1] as HTMLElement;
					anime({
						targets: main,
						translateX: [-30, 0],
						duration: 500,
						easing: 'easeOutCubic'
					});
					anime({
						targets: tail,
						translateX: [-30, 0],
						duration: 900,
						easing: 'easeOutElastic(1, .4)'
					});
				}
			},
			{
				title: 'Squash & stretch',
				description: 'Deforming an element as it moves to convey weight, speed, and flexibility.',
				animate: (stage) => {
					const el = solo(stage, 22, 'border-radius:50%;');
					anime({
						targets: el,
						keyframes: [
							{
								translateY: -26,
								scaleX: 0.85,
								scaleY: 1.25,
								duration: 350,
								easing: 'easeInQuad'
							},
							{
								translateY: 24,
								scaleX: 1.4,
								scaleY: 0.6,
								duration: 300,
								easing: 'easeInQuad'
							},
							{
								translateY: 0,
								scaleX: 1,
								scaleY: 1,
								duration: 500,
								easing: 'easeOutBounce'
							}
						],
						loop: 2
					});
				}
			},
			{
				title: 'Perceived performance',
				description: "The right animation makes an interface feel faster, even when it isn't.",
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:20px;top:28px;width:56px;height:10px;background:${MUT};opacity:0.2;"></div><div style="position:absolute;left:20px;top:42px;width:40px;height:10px;background:${MUT};opacity:0.2;"></div><div style="position:absolute;left:20px;top:28px;width:56px;height:10px;background:${FG};transform:scaleX(0);transform-origin:left;"></div><div style="position:absolute;left:20px;top:42px;width:40px;height:10px;background:${FG};transform:scaleX(0);transform-origin:left;"></div>`;
					const bars = [stage.children[2] as HTMLElement, stage.children[3] as HTMLElement];
					const tl = anime.timeline({ easing: 'easeOutCubic' });
					tl.add({ targets: bars[0], scaleX: [0, 1], duration: 400 }).add(
						{ targets: bars[1], scaleX: [0, 1], duration: 350 },
						100
					);
				}
			},
			{
				title: 'Frequency of use',
				description:
					'The more often a user sees an animation, the shorter and subtler it should be.',
				animate: (stage) => {
					const el = solo(stage, 26);
					const tl = anime.timeline({ targets: el, easing: 'easeOutCubic' });
					tl.add({ scale: [0, 1.35], opacity: [0, 1], duration: 600 })
						.add({ scale: [0.9, 1.15], duration: 300 }, '+=200')
						.add({ scale: [0.95, 1.04], duration: 180 }, '+=150')
						.add({ scale: [0.98, 1.01], duration: 120 }, '+=100');
				}
			},
			{
				title: 'Spatial consistency',
				description:
					'Animating so an element keeps its identity and position across states, so users never lose track of where things went.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:12px;top:37px;width:22px;height:22px;border:2px dashed ${MUT};box-sizing:border-box;"></div><div style="position:absolute;left:62px;top:37px;width:22px;height:22px;border:2px dashed ${MUT};box-sizing:border-box;"></div><div style="position:absolute;left:12px;top:37px;width:22px;height:22px;background:${FG};"></div>`;
					const box = stage.children[2] as HTMLElement;
					anime({
						targets: box,
						left: [12, 62],
						duration: 900,
						easing: 'easeInOutCubic',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Hardware acceleration',
				description: 'Animating transform and opacity lets the GPU keep motion smooth.',
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:14px;top:26px;width:18px;height:18px;background:${MUT};opacity:0.35;"></div><div style="position:absolute;left:14px;top:52px;width:18px;height:18px;background:${FG};"></div>`;
					const ghost = stage.children[0] as HTMLElement;
					const solid = stage.children[1] as HTMLElement;
					anime({
						targets: ghost,
						translateX: 46,
						duration: 1200,
						easing: 'steps(6)',
						direction: 'alternate',
						loop: 2
					});
					anime({
						targets: solid,
						translateX: 46,
						duration: 1200,
						easing: 'easeInOutSine',
						direction: 'alternate',
						loop: 2
					});
				}
			},
			{
				title: 'Reduced motion',
				description:
					"Respecting the user's prefers-reduced-motion setting by toning down or removing motion.",
				animate: (stage) => {
					stage.innerHTML = `<div style="position:absolute;left:36px;top:24px;width:24px;height:24px;background:${MUT};opacity:0;"></div><div style="position:absolute;left:36px;top:52px;width:24px;height:24px;background:${FG};opacity:0;"></div>`;
					const ghost = stage.children[0] as HTMLElement;
					const solid = stage.children[1] as HTMLElement;
					anime({
						targets: ghost,
						translateX: [-40, 0],
						scale: [0.4, 1],
						opacity: [0, 0.35],
						duration: 700,
						easing: 'easeOutBack'
					});
					anime({
						targets: solid,
						opacity: [0, 1],
						duration: 1000,
						easing: 'easeInOutQuad'
					});
				}
			}
		]
	}
];
