# Web Page Scraper

A Python script that scrapes web pages and saves them as files. Given a list of links to webpages, the scraper gets the HTML/PDF content of each page and saves it as a file.

## Features

- ✅ Supports both HTTP/HTTPS and file:// URLs
- ✅ Automatically detects content type (HTML, PDF, JSON, XML, etc.)
- ✅ Saves files with appropriate extensions
- ✅ Sanitizes filenames to be filesystem-safe
- ✅ Handles errors gracefully with detailed logging
- ✅ Works with or without the 'requests' library (urllib fallback)
- ✅ Supports both command-line and programmatic usage
- ✅ Configurable output directory
- ✅ Returns detailed results including success/failure counts

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

Note: The scraper will work with just Python's built-in libraries if requests is not available.

## Usage

### Command Line Usage

```bash
# Scrape single URL
python3 scrape_pages.py https://example.com

# Scrape multiple URLs
python3 scrape_pages.py https://example.com https://httpbin.org/json https://www.python.org/

# Local file URLs also work
python3 scrape_pages.py file:///path/to/local/file.html
```

### Programmatic Usage

```python
from scrape_pages import scrape_pages

# Basic usage
urls = ['https://example.com', 'https://httpbin.org/json']
results = scrape_pages(urls)

print(f'Successfully scraped: {results["success"]} pages')
print(f'Failed to scrape: {results["failed"]} pages')

# With custom output directory
results = scrape_pages(urls, output_dir='my_scraped_pages')

# Read URLs from file
with open('urls.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip()]
results = scrape_pages(urls)
```

### URL List from File

Create a text file with URLs (one per line):

```text
https://example.com
https://httpbin.org/html
https://www.python.org/
```

Then scrape all URLs:

```python
with open('urls.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip()]
results = scrape_pages(urls)
```

## Output

The scraper saves files in the `scraped_pages` directory (or custom directory) with sanitized filenames based on the URL structure. File extensions are automatically determined based on content type:

- HTML pages: `.html`
- PDF files: `.pdf`
- JSON responses: `.json`
- XML content: `.xml`
- Plain text: `.txt`

Example output files:
- `example.com.html`
- `httpbin.org_json.json`
- `github.com_user_repo.html`

## Error Handling

The scraper handles various errors gracefully:
- Network connectivity issues
- Invalid URLs
- HTTP errors (404, 500, etc.)
- Timeout errors
- Permission errors

All errors are logged with details, and the scraper continues processing remaining URLs.

## Testing

Run the test suite:

```bash
python3 test_scraper.py
```

See example usage:

```bash
python3 example_usage.py
```

## Dependencies

- `requests` (optional, but recommended)
- `beautifulsoup4` (optional, for enhanced HTML parsing)
- `urllib3` (optional, comes with requests)

The scraper will work with just Python's built-in `urllib` library if external dependencies are not available.