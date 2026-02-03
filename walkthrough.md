# PC Gamer Most Commented Article Script

This project demonstrates a Playwright script that automates the process of finding the most engaged news article on [PC Gamer](https://www.pcgamer.com).

## How it Works

The script is designed to handle the dynamic and heavy nature of the PC Gamer website. It uses a combination of scrolling, waiting for dynamic widgets, and resilient element selection.

1. **Browser Setup**: Launches a chromium browser with a custom User-Agent to ensure compatibility.
2. **Navigation**: Navigates to the homepage and handles potential cookie consent banners.
3. **Lazy Loading**: Performs sequential scrolling to trigger the loading of all articles and their corresponding comment counts, which are powered by the **Viafoura** widget.
4. **Data Extraction**: Scrapes the page using two strategies:
    * **Viafoura Integration**: Directly targets the `vf-conversations-count` elements.
    * **Resilient Text Matching**: Falls back to searching for any text matching the "X Comments" pattern near article links.
5. **Sorting & Navigation**: Ranks articles by comment count, logs the Top 5 results, and navigates the browser to the #1 article.
6. **Results Capture**: Saves a screenshot of the winning article.

## Features

* [x] **Dynamic Scraping**: Successfully waits for and extracts counts from third-party widgets.
* [x] **Resilient Logic**: Handles different types of article layouts (listings, feature blocks, content cards).
* [x] **Automated Navigation**: Transitions from data discovery to content viewing automatically.
* [x] **Visual Evidence**: Generates screenshots for both debugging and final results.

## Final Results

The script successfully identified and navigated to the top article.

````carousel
![Homepage Debug](file:///c:/Users/luism/PycharmProjects/playwrightmostcomment/homepage_debug.png)
<!-- slide -->
![Most Commented Article](file:///c:/Users/luism/PycharmProjects/playwrightmostcomment/most_commented_article.png)
````

## Technical Implementation

The core logic is contained in [findMostCommented.js](file:///c:/Users/luism/PycharmProjects/playwrightmostcomment/findMostCommented.js).

```javascript
// High-level extraction logic
const articles = await page.evaluate(() => {
    const results = [];
    const vfElements = document.querySelectorAll('vf-conversations-count');
    vfElements.forEach(el => {
        const count = parseInt(el.textContent.replace(/,/g, '')) || 0;
        const container = el.closest('.listingResult, .feature-block-item, .content-card');
        const link = container.querySelector('a.article-link');
        if (link && count > 0) {
            results.push({ title: link.innerText, url: link.href, count });
        }
    });
    return results;
});
```

---
**Practice/Portfolio Script** | Developed with Playwright & Node.js
