#!/usr/bin/env python3
"""
Web Page Scraper

This script takes a list of webpage URLs and downloads/saves the HTML or PDF content
of each page as files in a specified directory.

Usage:
    python scrape_pages.py --urls url1 url2 url3 --output-dir ./scraped_pages
    python scrape_pages.py --file urls.txt --output-dir ./scraped_pages

Features:
- Supports both HTML and PDF content
- Automatic file naming based on URL
- Error handling for failed requests
- Progress tracking
"""

import argparse
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse, unquote
from typing import List, Optional

import requests


def clean_filename(url: str, content_type: str = "") -> str:
    """
    Generate a clean filename from a URL.
    
    Args:
        url: The URL to generate filename from
        content_type: The content type of the response
        
    Returns:
        A clean filename suitable for saving
    """
    parsed_url = urlparse(url)
    
    # Get the path part and remove leading slash
    path = parsed_url.path.lstrip('/')
    
    # If path is empty, use the domain
    if not path or path == '/':
        filename = parsed_url.netloc
    else:
        # Use the last part of the path
        filename = path.split('/')[-1]
        
        # If it doesn't have an extension, use the full path
        if '.' not in filename:
            filename = path.replace('/', '_')
    
    # Clean the filename
    filename = unquote(filename)  # Decode URL encoding
    filename = re.sub(r'[^\w\-_\.]', '_', filename)  # Replace invalid chars
    filename = re.sub(r'_+', '_', filename)  # Collapse multiple underscores
    filename = filename.strip('_')  # Remove leading/trailing underscores
    
    # If still empty, use domain
    if not filename:
        filename = parsed_url.netloc.replace('.', '_')
    
    # Add appropriate extension based on content type or URL
    if filename.endswith('.pdf'):
        # Already has PDF extension, keep it
        pass
    elif content_type and 'pdf' in content_type.lower():
        if not filename.endswith('.pdf'):
            filename += '.pdf'
    elif content_type and 'html' in content_type.lower():
        if not filename.endswith('.html'):
            filename += '.html'
    elif not any(filename.endswith(ext) for ext in ['.html', '.pdf', '.txt', '.htm']):
        filename += '.html'  # Default to HTML
    
    return filename


def download_page(url: str, output_dir: Path, timeout: int = 30) -> Optional[str]:
    """
    Download a single webpage and save it to a file.
    
    Args:
        url: The URL to download
        output_dir: Directory to save the file
        timeout: Request timeout in seconds
        
    Returns:
        The filename if successful, None if failed
    """
    try:
        print(f"Downloading: {url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        
        content_type = response.headers.get('content-type', '').lower()
        filename = clean_filename(url, content_type)
        
        # Ensure unique filename
        file_path = output_dir / filename
        counter = 1
        base_name, ext = os.path.splitext(filename)
        while file_path.exists():
            new_filename = f"{base_name}_{counter}{ext}"
            file_path = output_dir / new_filename
            counter += 1
        
        # Write content to file
        mode = 'wb' if 'pdf' in content_type else 'w'
        encoding = None if 'pdf' in content_type else 'utf-8'
        
        if 'pdf' in content_type:
            with open(file_path, 'wb') as f:
                f.write(response.content)
        else:
            with open(file_path, 'w', encoding='utf-8', errors='replace') as f:
                f.write(response.text)
        
        print(f"  → Saved as: {file_path.name}")
        return file_path.name
        
    except requests.exceptions.RequestException as e:
        print(f"  ✗ Failed to download {url}: {e}")
        return None
    except IOError as e:
        print(f"  ✗ Failed to save {url}: {e}")
        return None


def read_urls_from_file(file_path: str) -> List[str]:
    """
    Read URLs from a text file (one URL per line).
    
    Args:
        file_path: Path to the file containing URLs
        
    Returns:
        List of URLs
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip() and not line.strip().startswith('#')]
        return urls
    except IOError as e:
        print(f"Error reading URLs from file {file_path}: {e}")
        return []


def scrape_pages(urls: List[str], output_dir: str = "./scraped_pages", delay: float = 1.0) -> None:
    """
    Scrape multiple webpages and save them as files.
    
    Args:
        urls: List of URLs to scrape
        output_dir: Directory to save the files
        delay: Delay between requests in seconds
    """
    if not urls:
        print("No URLs provided.")
        return
    
    # Create output directory if it doesn't exist
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"Scraping {len(urls)} URLs...")
    print(f"Output directory: {output_path.absolute()}")
    print()
    
    successful = 0
    failed = 0
    
    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}]", end=" ")
        
        # Add delay between requests (except for the first one)
        if i > 1 and delay > 0:
            time.sleep(delay)
        
        result = download_page(url, output_path)
        if result:
            successful += 1
        else:
            failed += 1
    
    print()
    print(f"Scraping completed!")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Files saved in: {output_path.absolute()}")


def main():
    parser = argparse.ArgumentParser(
        description="Scrape webpages and save them as files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --urls https://example.com https://google.com
  %(prog)s --file urls.txt --output-dir ./my_pages
  %(prog)s --urls https://example.com/doc.pdf --delay 2
        """
    )
    
    # URL input options (mutually exclusive)
    url_group = parser.add_mutually_exclusive_group(required=True)
    url_group.add_argument(
        '--urls',
        nargs='+',
        help='List of URLs to scrape'
    )
    url_group.add_argument(
        '--file',
        help='Text file containing URLs (one per line)'
    )
    
    parser.add_argument(
        '--output-dir',
        default='./scraped_pages',
        help='Directory to save the scraped files (default: ./scraped_pages)'
    )
    
    parser.add_argument(
        '--delay',
        type=float,
        default=1.0,
        help='Delay between requests in seconds (default: 1.0)'
    )
    
    args = parser.parse_args()
    
    # Get URLs from command line or file
    if args.urls:
        urls = args.urls
    else:
        urls = read_urls_from_file(args.file)
        if not urls:
            print(f"No valid URLs found in file: {args.file}")
            sys.exit(1)
    
    # Validate URLs
    valid_urls = []
    for url in urls:
        if url.startswith(('http://', 'https://')):
            valid_urls.append(url)
        else:
            print(f"Warning: Skipping invalid URL: {url}")
    
    if not valid_urls:
        print("No valid URLs to process.")
        sys.exit(1)
    
    # Start scraping
    try:
        scrape_pages(valid_urls, args.output_dir, args.delay)
    except KeyboardInterrupt:
        print("\nScraping interrupted by user.")
        sys.exit(1)


if __name__ == "__main__":
    main()