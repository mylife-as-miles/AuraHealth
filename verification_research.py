import time
import json
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a desktop viewport to avoid the mobile warning overlay
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()

        # Bypass authentication
        page.add_init_script("localStorage.setItem('aura_auth', 'true');")

        # Inject CSS to force hide the mobile warning if it appears even on desktop
        page.add_init_script("""
            const style = document.createElement('style');
            style.innerHTML = `
                #mobile-warning { display: none !important; }
                #root { display: block !important; }
            `;
            document.head.appendChild(style);
        """)

        print("Navigating to http://localhost:3000/research...")
        try:
            page.goto("http://localhost:3000/research")
            page.wait_for_load_state("networkidle")

            # Verify the "Evidence Synthesis" header
            if page.get_by_role("heading", name="Evidence Synthesis").is_visible():
                print("SUCCESS: 'Evidence Synthesis' header found.")
            else:
                print("FAIL: 'Evidence Synthesis' header not found.")
                print(page.content())
                return

            # Mock API Response
            mock_data = {
                "synthesis": "This is a MOCKED response verifying the API integration works.",
                "confidence": 0.99,
                "sources": [
                    {"id": "1", "title": "Mock Source", "journal": "Test Journal", "year": "2024", "url": "#"}
                ],
                "charts": [] # Using empty charts for simplicity in mock
            }

            # Intercept the API call
            page.route("**/api/gemini/research", lambda route: route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps(mock_data)
            ))

            # Test search functionality
            print("Testing search functionality...")

            textarea = page.get_by_placeholder("Ask a follow-up question or refine criteria...")
            if textarea.is_visible():
                textarea.fill("Test Query")

                # Find submit button (inside the input area, usually an icon button)
                # The button has an 'ArrowUp' icon
                submit_button = page.locator("button:has(svg.lucide-arrow-up)")
                if submit_button.is_visible():
                    submit_button.click()
                    print("Search submitted. Waiting for response...")

                    try:
                        # Wait for the mocked synthesis text to appear
                        page.wait_for_selector("text=This is a MOCKED response", timeout=5000)
                        print("SUCCESS: Mocked API response rendered correctly.")
                    except Exception as e:
                        print(f"FAIL: Mocked API response not found. Error: {e}")
                else:
                    print("FAIL: Submit button not found.")
            else:
                print("FAIL: Textarea not found.")

            # Take a screenshot
            page.screenshot(path="verification_result.png")
            print("Screenshot saved to verification_result.png")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
