const { chromium } = require('playwright');

(async () => {
    console.log('--- PC Gamer: Most Commented Article Finder ---');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    // Log console to help debugging
    page.on('console', msg => {
        if (msg.type() === 'log') console.log(`PAGE LOG: ${msg.text()}`);
    });

    try {
        console.log('Navigating to PC Gamer...');
        await page.goto('https://www.pcgamer.com', { waitUntil: 'load', timeout: 90000 });

        // Handle possible cookie consent
        try {
            const consentBtn = await page.waitForSelector('button:has-text("ACCEPT"), button:has-text("Agree"), .sp_choice_type_11', { timeout: 5000 });
            if (consentBtn) {
                console.log('Accepting cookies...');
                await consentBtn.click();
            }
        } catch (e) {
            console.log('No consent banner found or timed out.');
        }

        console.log('Waiting for Viafoura widgets to initialize...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('Scrolling to load all articles...');
        // PC Gamer has a long homepage, scroll several times
        for (let i = 0; i < 10; i++) {
            await page.mouse.wheel(0, 1500);
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log('Waiting for counts to populate...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('Extracting articles...');
        const articles = await page.evaluate(() => {
            const results = [];
            console.log('Scanning for articles and comments...');

            // Method 1: Look for any element containing "Comments" text
            // This is often more reliable than specific selectors if site changes
            const allElements = document.querySelectorAll('span, a, div, vf-conversations-count');
            allElements.forEach(el => {
                const text = el.innerText.trim();
                const match = text.match(/^(\d+,?\d*)\s+Comments$/i) || text.match(/^(\d+,?\d*)$/);

                if (match) {
                    let count = parseInt(match[1].replace(/,/g, '')) || 0;

                    // Specific check for vf-conversations-count which might just have the number
                    if (el.tagName === 'VF-CONVERSATIONS-COUNT') {
                        count = parseInt(text.replace(/,/g, '')) || 0;
                    }

                    if (count > 0) {
                        // Find the nearest article link
                        // Usually, the comment count is within an article container
                        const container = el.closest('.listingResult, .feature-block-item, .content-card, div[data-recirc-item-id], .native-ad-unit');
                        const link = container ? container.querySelector('a.article-link, a[href*="/news/"], a[href*="/reviews/"]') : null;

                        if (link && link.href) {
                            results.push({
                                title: (link.innerText || "No Title").split('\n')[0].trim(),
                                url: link.href,
                                count: count,
                                method: 'text-match'
                            });
                        }
                    }
                }
            });

            return results;
        });

        // Dedup and filter
        const uniqueArticles = Array.from(new Map(articles.map(a => [a.url, a])).values())
            .filter(a => a.count > 0 && a.url.startsWith('http'))
            .sort((a, b) => b.count - a.count);

        if (uniqueArticles.length === 0) {
            console.log('\n[!] No articles with comment counts found.');
            console.log('Check screenshots to see if the page loaded normally.');
            await page.screenshot({ path: 'failure_debug.png' });
        } else {
            console.log(`\nFound ${uniqueArticles.length} articles with comments.`);
            console.log('\nTOP 5 MOST COMMENTED:');
            console.log('--------------------------------------------------');
            uniqueArticles.slice(0, 5).forEach((a, i) => {
                console.log(`${i + 1}. [${a.count} comments] ${a.title}`);
                console.log(`   URL: ${a.url}`);
            });
            console.log('--------------------------------------------------');

            const top = uniqueArticles[0];
            console.log(`\nNavigating to most commented: "${top.title}"`);
            await page.goto(top.url, { waitUntil: 'load', timeout: 60000 });

            // Wait for comments section to load on the article page
            await page.mouse.wheel(0, 3000);
            await new Promise(r => setTimeout(r, 2000));

            const screenshotName = 'most_commented_article.png';
            await page.screenshot({ path: screenshotName, fullPage: false });
            console.log(`\n[SUCCESS] Screenshot saved as ${screenshotName}`);
        }

    } catch (err) {
        console.error('\n[ERROR] An error occurred:', err.message);
    } finally {
        console.log('\nClosing browser in 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
        await browser.close();
        console.log('--- Task Complete ---');
    }
})();
