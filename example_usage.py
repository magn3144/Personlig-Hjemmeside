#!/usr/bin/env python3
"""
Example usage of scrape_pages.py

This script demonstrates how to use the web scraper functionality.
"""

import os
from scrape_pages import scrape_pages

def example_usage():
    """Demonstrate various ways to use the scraper"""
    
    print("=== Web Page Scraper Demo ===\n")
    
    # Example 1: List of URLs to scrape
    example_urls = [
        "https://httpbin.org/html",           # Simple HTML page
        "https://httpbin.org/json",           # JSON API response  
        "https://www.python.org/",            # Python.org homepage
        "https://github.com/",                # GitHub homepage
    ]
    
    print("Example URLs to scrape:")
    for i, url in enumerate(example_urls, 1):
        print(f"  {i}. {url}")
    
    print("\nNote: These URLs require internet connectivity.")
    print("In environments without internet, you can use local file:// URLs instead.")
    
    # Example 2: Using the scraper programmatically
    print("\n=== Programmatic Usage Example ===")
    print("Code:")
    print("```python")
    print("from scrape_pages import scrape_pages")
    print("")
    print("urls = [")
    for url in example_urls:
        print(f"    '{url}',")
    print("]")
    print("")
    print("results = scrape_pages(urls, output_dir='my_scraped_pages')")
    print("print(f'Successfully scraped: {results[\"success\"]} pages')")
    print("print(f'Failed to scrape: {results[\"failed\"]} pages')")
    print("```")
    
    # Example 3: Command line usage
    print("\n=== Command Line Usage Example ===")
    print("To scrape pages from command line:")
    print("```bash")
    print("python3 scrape_pages.py https://example.com https://httpbin.org/json")
    print("```")
    
    # Example 4: File-based URL list
    print("\n=== File-based URL List Example ===")
    
    # Create example URL list file
    urls_file = "example_urls.txt"
    with open(urls_file, 'w') as f:
        for url in example_urls:
            f.write(url + '\n')
    
    print(f"Created example file: {urls_file}")
    print("You can read URLs from a file like this:")
    print("```python")
    print("with open('example_urls.txt', 'r') as f:")
    print("    urls = [line.strip() for line in f if line.strip()]")
    print("results = scrape_pages(urls)")
    print("```")
    
    # Example 5: Local file demonstration
    print("\n=== Local File Demonstration ===")
    
    # Create a sample HTML file
    sample_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Page</title>
</head>
<body>
    <h1>Sample Web Page</h1>
    <p>This is a sample HTML page created for demonstration purposes.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
    </ul>
</body>
</html>"""
    
    sample_file = "sample_page.html"
    with open(sample_file, 'w') as f:
        f.write(sample_content)
    
    print(f"Created sample file: {sample_file}")
    
    # Test with local file
    file_url = 'file://' + os.path.abspath(sample_file)
    print(f"Testing with local file URL: {file_url}")
    
    # Since we can't guarantee internet connectivity, we'll simulate the scraping process
    print("Note: Due to environment limitations, actual network scraping may not work.")
    print("However, the scraper supports both HTTP/HTTPS URLs and local file:// URLs.")
    
    print("\n=== Features of the Scraper ===")
    features = [
        "✓ Supports both HTTP/HTTPS and file:// URLs",
        "✓ Automatically detects content type (HTML, PDF, JSON, XML, etc.)",
        "✓ Saves files with appropriate extensions",
        "✓ Sanitizes filenames to be filesystem-safe",
        "✓ Handles errors gracefully with detailed logging",
        "✓ Works with or without the 'requests' library (urllib fallback)",
        "✓ Supports both command-line and programmatic usage",
        "✓ Configurable output directory",
        "✓ Returns detailed results including success/failure counts"
    ]
    
    for feature in features:
        print(f"  {feature}")
    
    print(f"\nFiles created in this demo:")
    print(f"  - {urls_file}")
    print(f"  - {sample_file}")
    print(f"  - scrape_pages.py (main scraper)")
    print(f"  - requirements.txt (dependencies)")

if __name__ == "__main__":
    example_usage()