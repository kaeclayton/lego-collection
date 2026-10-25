# My LEGO Collection

A responsive website showcasing my personal LEGO collection, with a searchable gallery, saved favorites, and a daily-updated feed of new sets I don't own yet.

**Live site:** https://kaeclayton.github.io/lego-collection/

> This site started as a project for a web development course with BYU-Pathway Worldwide. I've since enhanced it to showcase more skills, including the items under Technical highlights.

> LEGO® is a trademark of the LEGO Group, which does not sponsor, authorize, or endorse this site.

## Features

- **Gallery** of 34 sets loaded from JSON, with a detail view for each set
- **Filter, sort, and favorites.** Filter by theme, sort by name, piece count, or year, and show only favorites. Favorites are saved in the browser with localStorage
- **Featured sets** on the homepage, randomly chosen from the collection on each visit
- **Sets on My Radar,** a homepage section of recent large sets not in my collection, pulled from the Rebrickable API
- **Share form** where visitors can submit their own favorite set, with a confirmation page

## Technical highlights

- **API key kept out of the browser.** A GitHub Actions workflow runs daily, fetches new sets from the Rebrickable API using an encrypted repository secret, filters out sets already in the collection, and saves the results to `data/discover-sets.json`.
- **Safe handling of form data.** The confirmation page builds its content with `textContent` rather than `innerHTML`, preventing cross-site scripting through the URL.
- **Accessibility.** Gallery cards are keyboard-accessible buttons with visible focus styles, controls are labeled, and the result count is announced to screen readers.
- **Clean, maintainable JavaScript.** ES modules, a single delegated event listener for the gallery, and one render function that combines all filters.

## Built with

- HTML, CSS (Grid, Flexbox, media queries), and JavaScript (ES modules)
- [Rebrickable API](https://rebrickable.com/api/)
- GitHub Actions and GitHub Pages