# Design pages

Case-study copy follows the Collins studio voice without copying their sentences. Open with what the brand is. Name the tension in plain words. Keep paragraphs short and in the present tense. Leave process talk out of the page.

The page grid is 24px. Space type, images, and padding on that unit. On a flat gallery, image heights snap to a multiple of 24px.

A flat gallery puts one text block on its own row and alternates the column, left then right. It has no dividers between blocks. A split gallery alternates heading and paragraph columns. Leave `layout` off the frontmatter for a single stacked gallery.

The design list prints the year only. Keep the full date in frontmatter so the list can sort by the real day.

Set the treatment in frontmatter instead of naming the project in the page component.

```yaml
layout: split
```

```yaml
layout: flat
credit:
  paragraph: Illustration by Luong Doo
  label: Luong Doo
  href: https://luongdoo.com
```

`layout` is `split` or `flat`. `credit` links one intro sentence. The label has to appear inside that sentence.
