#!/usr/bin/env python3
"""
Web Page Scraper

Given a list of links to webpages, this scraper gets the HTML/PDF content
of each page and saves it as a file.

Usage:
    python scrape_pages.py [URLs...]
    
    Or import and use the scrape_pages function:
    from scrape_pages import scrape_pages
    scrape_pages(['http://example.com', 'http://example.org'])
"""

import os
import sys
import urllib.parse
import urllib.request
import logging
from typing import List, Optional
import re

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    print("Warning: requests library not available, falling back to urllib")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def sanitize_filename(url: str) -> str:
    """
    Convert a URL to a safe filename by removing/replacing problematic characters.
    
    Args:
        url: The URL to convert
        
    Returns:
        A sanitized filename
    """
    # Parse the URL to get the domain and path
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc
    path = parsed.path.strip('/')
    
    # Create a base filename from domain and path
    if path:
        filename = f"{domain}_{path}"
    else:
        filename = domain
    
    # Replace problematic characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    filename = re.sub(r'[^\w\-_.]', '_', filename)
    filename = re.sub(r'_+', '_', filename)  # Replace multiple underscores with single
    filename = filename.strip('_')
    
    # Ensure filename isn't too long
    if len(filename) > 200:
        filename = filename[:200]
    
    return filename


def detect_content_type(url: str, headers: dict) -> str:
    """
    Detect the content type of a URL based on headers and URL extension.
    
    Args:
        url: The URL to analyze
        headers: HTTP headers from the response
        
    Returns:
        File extension (e.g., 'html', 'pdf', 'txt')
    """
    content_type = headers.get('content-type', '').lower()
    
    # Check content-type header first
    if 'application/pdf' in content_type:
        return 'pdf'
    elif 'text/html' in content_type:
        return 'html'
    elif 'text/plain' in content_type:
        return 'txt'
    elif 'application/json' in content_type:
        return 'json'
    elif 'application/xml' in content_type or 'text/xml' in content_type:
        return 'xml'
    
    # Fall back to URL extension
    parsed_url = urllib.parse.urlparse(url)
    path = parsed_url.path.lower()
    
    if path.endswith('.pdf'):
        return 'pdf'
    elif path.endswith('.html') or path.endswith('.htm'):
        return 'html'
    elif path.endswith('.txt'):
        return 'txt'
    elif path.endswith('.json'):
        return 'json'
    elif path.endswith('.xml'):
        return 'xml'
    
    # Default to html for web pages
    return 'html'


def scrape_url_with_requests(url: str, output_dir: str = 'scraped_pages') -> bool:
    """
    Scrape a single URL using the requests library.
    
    Args:
        url: URL to scrape
        output_dir: Directory to save the file
        
    Returns:
        True if successful, False otherwise
    """
    try:
        logger.info(f"Scraping {url} with requests...")
        
        # Make the request with a user agent to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        # Detect content type and set filename
        content_type = detect_content_type(url, response.headers)
        base_filename = sanitize_filename(url)
        filename = f"{base_filename}.{content_type}"
        filepath = os.path.join(output_dir, filename)
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Save the content
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        logger.info(f"Successfully saved {url} to {filepath}")
        return True
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error scraping {url}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error scraping {url}: {e}")
        return False


def scrape_url_with_urllib(url: str, output_dir: str = 'scraped_pages') -> bool:
    """
    Scrape a single URL using urllib (fallback when requests is not available).
    
    Args:
        url: URL to scrape
        output_dir: Directory to save the file
        
    Returns:
        True if successful, False otherwise
    """
    try:
        logger.info(f"Scraping {url} with urllib...")
        
        # Create request with user agent
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            content = response.read()
            headers = {k.lower(): v for k, v in response.headers.items()}
            
            # Detect content type and set filename
            content_type = detect_content_type(url, headers)
            base_filename = sanitize_filename(url)
            filename = f"{base_filename}.{content_type}"
            filepath = os.path.join(output_dir, filename)
            
            # Create output directory if it doesn't exist
            os.makedirs(output_dir, exist_ok=True)
            
            # Save the content
            with open(filepath, 'wb') as f:
                f.write(content)
            
            logger.info(f"Successfully saved {url} to {filepath}")
            return True
            
    except urllib.error.URLError as e:
        logger.error(f"Error scraping {url}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error scraping {url}: {e}")
        return False


def scrape_pages(urls: List[str], output_dir: str = 'scraped_pages') -> dict:
    """
    Scrape multiple web pages and save them as files.
    
    Args:
        urls: List of URLs to scrape
        output_dir: Directory to save the scraped files
        
    Returns:
        Dictionary with success/failure counts and details
    """
    if not urls:
        logger.warning("No URLs provided")
        return {'success': 0, 'failed': 0, 'details': []}
    
    logger.info(f"Starting to scrape {len(urls)} URLs...")
    
    # Choose scraping method based on availability
    scrape_func = scrape_url_with_requests if HAS_REQUESTS else scrape_url_with_urllib
    
    results = {'success': 0, 'failed': 0, 'details': []}
    
    for url in urls:
        # Ensure URL has a scheme (but don't modify file:// URLs)
        if not url.startswith(('http://', 'https://', 'file://')):
            url = 'https://' + url
            logger.info(f"Added https:// to URL: {url}")
        
        success = scrape_func(url, output_dir)
        
        if success:
            results['success'] += 1
            results['details'].append({'url': url, 'status': 'success'})
        else:
            results['failed'] += 1
            results['details'].append({'url': url, 'status': 'failed'})
    
    logger.info(f"Scraping complete. Success: {results['success']}, Failed: {results['failed']}")
    return results


def main():
    """
    Main function for command-line usage.
    """
    if len(sys.argv) < 2:
        print("Usage: python scrape_pages.py <URL1> [URL2] [URL3] ...")
        print("Example: python scrape_pages.py https://example.com https://example.org")
        sys.exit(1)
    
    urls = sys.argv[1:]
    print(f"Scraping {len(urls)} URLs...")
    
    results = scrape_pages(urls)
    
    print(f"\nResults:")
    print(f"Successfully scraped: {results['success']}")
    print(f"Failed to scrape: {results['failed']}")
    
    if results['details']:
        print("\nDetails:")
        for detail in results['details']:
            print(f"  {detail['url']}: {detail['status']}")


if __name__ == "__main__":
    main()