import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';
import { getAllPosts as getAllBlogPosts } from '$lib/content/blog';
import { getAllPosts as getAllDesignPosts } from '$lib/content/design';
import { getAllPosts as getAllEngineeringPosts } from '$lib/content/engineering';

interface PageInfo {
	path: string;
	title: string;
	description: string;
	content?: string;
}

interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
}

async function parseHomeContent(): Promise<PageInfo> {
	try {
		const contentPath = path.resolve('src/routes/content.md');
		const content = await fs.readFile(contentPath, 'utf-8');

		// Extract key information from the content
		const lines = content.split('\n');
		const description =
			lines.find((line) => line.includes('My name is Quang'))?.trim() ||
			'Personal website and blog of Quang, a Vietnamese Graphic Designer skilled at crafting impactful brand identities.';

		return {
			path: '/',
			title: 'Home - Quang Design',
			description,
			content: content.substring(0, 500) + '...' // First 500 chars as preview
		};
	} catch (_error) {
		// Error parsing home content - using default description
		return {
			path: '/',
			title: 'Home - Quang Design',
			description: 'Personal website and blog of Quang, a Vietnamese Graphic Designer.'
		};
	}
}

async function parseEngineeringProjects(): Promise<PageInfo[]> {
	const projects: PageInfo[] = [
		{
			path: '/engineer',
			title: 'Engineering - All Things Engineering',
			description: 'Collection of engineering work built with Svelte and Tailwind CSS'
		}
	];

	// Add known engineering projects
	const engineeringProjects = [
		{
			path: '/engineer/telescopic',
			title: 'AI Telescopic Text',
			description: 'Interactive AI-powered text expansion tool'
		},
		{
			path: '/engineer/microscopic',
			title: 'AI Microscopic Text',
			description: 'Interactive AI-powered text compression tool'
		},
		{
			path: '/engineer/minesweeper',
			title: 'Minesweeper',
			description: 'Classic Minesweeper game implementation'
		}
	];

	projects.push(...engineeringProjects);
	return projects;
}

async function parseDesignSection(): Promise<PageInfo> {
	return {
		path: '/design',
		title: 'Design - Creative Work Collection',
		description: 'Interactive canvas showcasing design work and creative projects'
	};
}

async function parseBlogPosts(): Promise<BlogPost[]> {
	return getAllBlogPosts().map((p) => ({
		slug: p.slug,
		title: p.title,
		description: p.description,
		date: p.date
	}));
}

async function parseDesignPosts(): Promise<BlogPost[]> {
	return getAllDesignPosts().map((p) => ({
		slug: p.slug,
		title: p.title,
		description: p.description,
		date: p.date
	}));
}

async function parseEngineeringWriteups(): Promise<BlogPost[]> {
	return getAllEngineeringPosts().map((p) => ({
		slug: p.slug,
		title: p.title,
		description: p.description,
		date: p.date
	}));
}

export const GET: RequestHandler = async () => {
	try {
		// Parse all site content
		const [
			homeContent,
			designSection,
			engineeringProjects,
			blogPosts,
			designPosts,
			engineeringWriteups
		] = await Promise.all([
			parseHomeContent(),
			parseDesignSection(),
			parseEngineeringProjects(),
			parseBlogPosts(),
			parseDesignPosts(),
			parseEngineeringWriteups()
		]);

		// Generate sections for llms.txt
		const homeSection = `## Home Page

- [${homeContent.title}](${homeContent.path}): ${homeContent.description}`;

		const designSectionText = `## Design

- [${designSection.title}](${designSection.path}): ${designSection.description}`;

		const engineeringSection = `## Engineering

${engineeringProjects.map((project) => `- [${project.title}](${project.path}): ${project.description}`).join('\n')}`;

		const designPostsSection =
			designPosts.length > 0
				? `## Design Work

${designPosts.map((post) => `- [${post.title}](/design/${post.slug}): ${post.description}${post.date ? ` (${post.date})` : ''}`).join('\n')}`
				: '';

		const engineeringWriteupsSection =
			engineeringWriteups.length > 0
				? `## Engineering Write-ups

${engineeringWriteups.map((post) => `- [${post.title}](/engineering/${post.slug}): ${post.description}${post.date ? ` (${post.date})` : ''}`).join('\n')}`
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

		// Generate complete llms.txt content
		const llmsTxt = `# Quang Design

> Personal website and blog of Quang, a Vietnamese Graphic Designer skilled at crafting impactful brand identities and exploring technology through web development and AI.

This site contains comprehensive information about Quang's work, including design philosophy, engineering projects, and personal reflections on creative work. The content is aimed at designers, developers, and anyone interested in the intersection of design and technology.

${homeSection}

${designSectionText}

${designPostsSection}

${engineeringSection}

${engineeringWriteupsSection}

${blogSection}

${blogMarkdownSection}

${individualLlmsTxtSection}

## Additional Resources

- [Blog Index](/blog): Complete blog listing with search and filtering
- [Sitemap](/sitemap.xml): Complete site structure and navigation
- [Contact](mailto:xinchao@quang.design): Direct contact for collaboration and inquiries

## About the Author

Quang is a Vietnamese Graphic Designer with experience as Design Director at FlexOS, skilled in brand identity creation, web development, and AI/ML exploration. The site showcases both creative and technical work, representing the intersection of design and engineering.`;

		return new Response(llmsTxt, {
			headers: {
				'Content-Type': 'text/markdown; charset=utf-8',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (_error) {
		// Error generating llms.txt - using fallback content

		// Fallback content in case of errors
		const fallbackContent = `# Quang Design

> Personal website and blog of Quang, a Vietnamese Graphic Designer.

This site contains articles about design philosophy, engineering practices, and personal reflections on creative work.

## Error

There was an error generating the dynamic content. Please check the server logs.

## Contact

- Email: xinchao@quang.design`;

		return new Response(fallbackContent, {
			headers: {
				'Content-Type': 'text/markdown; charset=utf-8'
			}
		});
	}
};
