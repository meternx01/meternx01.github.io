// File: ahpricer/show-last-commit.js
// Shows the latest commit info for `ahpricer/item_list.js` using the GitHub API.

(async () => {
    const container = document.getElementById('itemLastUpdate');
    if (!container) return;

    const owner = 'meternx01';
    const repo = 'meternx01.github.io';
    const path = 'ahpricer/item_list.js';
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&per_page=1`;

    try {
        const resp = await fetch(url, { cache: 'no-cache' });
        if (!resp.ok) throw new Error(`GitHub API error ${resp.status}`);
        const data = await resp.json();
        if (!Array.isArray(data) || data.length === 0) {
            container.textContent = `No commits found for ${path}`;
            return;
        }

        const c = data[0];
        const msg = (c.commit && c.commit.message) ? c.commit.message.split('\n')[0] : 'no message';
        const author =
            (c.commit && c.commit.committer && c.commit.committer.name) ||
            (c.commit && c.commit.author && c.commit.author.name) ||
            (c.author && c.author.login) ||
            'unknown';
        const dateStr = (c.commit && c.commit.committer && c.commit.committer.date) ||
            (c.commit && c.commit.author && c.commit.author.date) ||
            null;
        const date = dateStr ? new Date(dateStr) : null;

        container.textContent = date
            ? `Last commit: ${date.toLocaleString()} — ${msg} — ${author}`
            : `Last commit: ${msg} — ${author}`;
    } catch (err) {
        container.textContent = `Could not fetch commit info: ${err.message}`;
    }
})();
