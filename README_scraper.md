# Web Page Scraper

A Python script that downloads HTML and PDF content from a list of webpage URLs and saves them as files.

## Features

- Downloads both HTML pages and PDF files
- Supports URL input via command line or text file
- Automatic filename generation based on URLs
- Error handling for failed downloads
- Configurable delay between requests
- Progress tracking
- Duplicate filename handling

## Requirements

Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Command Line URLs

```bash
python scrape_pages.py --urls https://example.com https://github.com
```

### URLs from File

Create a text file with URLs (one per line):

```
https://example.com
https://github.com
https://stackoverflow.com
```

Then run:

```bash
python scrape_pages.py --file urls.txt
```

### Options

- `--output-dir`: Directory to save files (default: `./scraped_pages`)
- `--delay`: Delay between requests in seconds (default: 1.0)

### Examples

```bash
# Basic usage
python scrape_pages.py --urls https://example.com

# Custom output directory
python scrape_pages.py --file urls.txt --output-dir ./my_pages

# With delay between requests
python scrape_pages.py --urls https://example.com --delay 2

# Multiple URLs
python scrape_pages.py --urls https://example.com https://github.com https://google.com
```

## File Naming

The script automatically generates filenames based on the URL:
- Uses the last part of the URL path
- Replaces invalid characters with underscores
- Adds appropriate extensions (.html or .pdf)
- Handles duplicate filenames by adding a counter

## Error Handling

- Network timeouts and connection errors are handled gracefully
- Invalid URLs are skipped with warnings
- Failed downloads are reported but don't stop the process
- Summary statistics are shown at the end