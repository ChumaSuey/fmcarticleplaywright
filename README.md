# PC Gamer Most Commented Article Finder

A practice/portfolio script built with Playwright (JavaScript) that identifies the most engaged news article on [PC Gamer](https://www.pcgamer.com) and navigates to it.

## 🚀 Features

- **Dynamic Content Handling**: Automatically scrolls and waits for Viafoura comment widgets to load.
- **Robust Scraping**: Uses multiple strategies to extract comment counts even if the site layout changes.
- **Automated Results**: Identifies the #1 article, logs the Top 5 to the console, and captures a screenshot of the winner.

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ChumaSuey/fmcarticleplaywright.git
   cd fmcarticleplaywright
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## 🖥️ Usage

Run the script with the following command:

```bash
node findMostCommented.js
```

The script will open a browser window, perform the automation, and save a result screenshot as `most_commented_article.png`.

## 📁 Project Structure

- `findMostCommented.js`: Core Playwright script.
- `walkthrough.md`: Detailed explanation of the technical implementation.
- `most_commented_article.png`: Sample result from a successful run.

---
Created for practice and portfolio demonstration. Hugs! :)
