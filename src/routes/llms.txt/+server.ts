import type { RequestHandler } from './$types';
import { getAllPosts as getAllBlogPosts } from '$lib/content/blog';
import { getAllPosts as getAllDesignPosts } from '$lib/content/design';
import { engineerProjects } from '$lib/content/engineer';
import homeMd from '../content.md?raw';

function homeDescription() {
	const line = homeMd
		.split('\n')
		.find((row) => row.includes('My name is Quang'))
		?.trim();
	return (
		line ||
		'Personal website and blog of Quang, a Vietnamese Graphic Designer skilled at crafting impactful brand identities.'
	);
}

export const GET: RequestHandler = async () => {
	const homeBlurb = homeDescription();
	const blogPosts = getAllBlogPosts();
	const designPosts = getAllDesignPosts();

	const engineerLines = [
		'- [Engineering](/engineer): Collection of engineering work built with Svelte and Tailwind CSS',
		...engineerProjects.map(
			(project) => `- [${project.title}](${project.href}): ${project.description}`
		)
	].join('\n');

	const designWork =
		designPosts.length > 0
			? `## Design Work

${designPosts.map((post) => `- [${post.title}](/design/${post.slug}): ${post.description}${post.date ? ` (${post.date})` : ''}`).join('\n')}`
			: '';

	const blogSection =
		blogPosts.length > 0
			? `## Blog Posts

${blogPosts.map((post) => `- [${post.title}](/blog/posts/${post.slug}): ${post.description}${post.date ? ` (${post.date})` : ''}`).join('\n')}`
			: '';

	const blogMarkdownSection =
		blogPosts.length > 0
			? `## Blog Posts (Markdown Format)

${blogPosts.map((post) => `- [${post.title} (Markdown)](/blog/posts/${post.slug}/post.md): Raw markdown content for LLM consumption`).join('\n')}`
			: '';

	const individualLlmsTxtSection =
		blogPosts.length > 0
			? `## Individual Blog Post LLMs.txt Files

${blogPosts.map((post) => `- [${post.title} (LLM optimized)](/blog/posts/${post.slug}/llms.txt): Individual llms.txt for this post`).join('\n')}`
			: '';

	const llmsTxt = `# Quang Design

> Personal website and blog of Quang, a Vietnamese Graphic Designer skilled at crafting impactful brand identities and exploring technology through web development and AI.

This site contains information about Quang's work, including design, engineering projects, and writing on design and technology.

## Home Page

- [Home - Quang Design](/): ${homeBlurb}

## Design

- [Design](/design): A collection of my design work.

${designWork}

## Engineering

${engineerLines}

${blogSection}

${blogMarkdownSection}

${individualLlmsTxtSection}

## Additional Resources

- [Blog Index](/blog): Complete blog listing
- [Sitemap](/sitemap.xml): Complete site structure and navigation
- [Contact](mailto:xinchao@quang.design): Direct contact for collaboration and inquiries

## About the Author

Quang is a Vietnamese Graphic Designer with experience as Design Director at FlexOS, skilled in brand identity creation, web development, and AI/ML exploration. The site showcases both creative and technical work, representing the intersection of design and engineering.`;

	return new Response(llmsTxt, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
