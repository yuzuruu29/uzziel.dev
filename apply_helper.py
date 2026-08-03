import os
import sys
import asyncio
import argparse
from playwright.async_api import async_playwright

USER_DATA = {
    "first_name": "Emmanuel Uzziel",
    "last_name": "Malolos",
    "full_name": "Emmanuel Uzziel A. Malolos",
    "email": "uzzielmalolos@gmail.com",
    "phone": "+63 991 387 3723",
    "website": "https://uzziel.dev",
    "github": "https://github.com/yuzuruu29",
    "resume_path": os.path.abspath("Uzziel_Malolos_Portfolio.pdf")
}

async def fill_field(page, selector, value):
    try:
        element = page.locator(selector)
        if await element.count() > 0 and await element.is_visible():
            await element.scroll_into_view_if_needed()
            await element.fill(value)
            return True
    except Exception:
        pass
    return False

async def auto_fill_form(page, cover_letter):
    selectors = {
        "first_name": ["input[name*='first']", "input[name*='fname']", "input[placeholder*='First']", "input[id*='first']"],
        "last_name": ["input[name*='last']", "input[name*='lname']", "input[placeholder*='Last']", "input[id*='last']"],
        "full_name": ["input[name*='name']", "input[placeholder*='Name']", "input[id*='name']", "input[autocomplete='name']"],
        "email": ["input[name*='email']", "input[type='email']", "input[placeholder*='Email']", "input[id*='email']"],
        "phone": ["input[name*='phone']", "input[type='tel']", "input[placeholder*='Phone']", "input[id*='phone']"],
        "website": ["input[name*='website']", "input[name*='portfolio']", "input[placeholder*='Website']", "input[placeholder*='Portfolio']"],
        "github": ["input[name*='github']", "input[placeholder*='GitHub']", "input[name*='git']"],
        "cover_letter": [
            "textarea[name*='cover']",
            "textarea[name*='letter']",
            "textarea[placeholder*='cover']",
            "textarea[placeholder*='Cover']",
            "textarea[name*='message']",
            "textarea[name*='pitch']",
            "textarea[placeholder*='message']",
            "textarea[placeholder*='Pitch']",
            "textarea[id*='cover']",
            "textarea"
        ]
    }

    for key, selector_list in selectors.items():
        value = USER_DATA.get(key) if key != "cover_letter" else cover_letter
        if not value:
            continue
        for selector in selector_list:
            if await fill_field(page, selector, value):
                print(f"[+] Auto-filled {key} using selector: {selector}")
                break

    # Resume upload
    resume_selectors = [
        "input[type='file'][name*='resume']",
        "input[type='file'][id*='resume']",
        "input[type='file'][name*='cv']",
        "input[type='file'][id*='cv']",
        "input[type='file']"
    ]
    if os.path.exists(USER_DATA["resume_path"]):
        for selector in resume_selectors:
            try:
                file_input = page.locator(selector)
                if await file_input.count() > 0:
                    await file_input.set_input_files(USER_DATA["resume_path"])
                    print(f"[+] Attached resume ({USER_DATA['resume_path']}) to selector: {selector}")
                    break
            except Exception:
                pass
    else:
        print(f"[-] Resume not found at {USER_DATA['resume_path']}. Skipping upload.")

async def main():
    parser = argparse.ArgumentParser(description="Job Application Form Auto-Fill Assistant")
    parser.add_argument("--url", required=True, help="URL of the job posting")
    parser.add_argument("--cover-letter-file", help="Path to cover letter text file")
    args = parser.parse_args()

    cover_letter = ""
    if args.cover_letter_file and os.path.exists(args.cover_letter_file):
        with open(args.cover_letter_file, "r", encoding="utf-8") as f:
            cover_letter = f.read()

    profile_path = os.path.join(os.path.expanduser("~"), ".apply_assistant_profile")
    
    async with async_playwright() as p:
        print(f"[+] Launching Chrome with session profile: {profile_path}")
        context = await p.chromium.launch_persistent_context(
            user_data_dir=profile_path,
            headless=False,
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        print(f"[+] Navigating to: {args.url}")
        await page.goto(args.url)
        
        print("[*] Waiting for page to load. Press Enter in the terminal to autofill fields...")
        await asyncio.get_event_loop().run_in_executor(None, input)
        
        print("[*] Auto-filling form fields...")
        await auto_fill_form(page, cover_letter)
        
        print("[*] Form filled. Please review, complete CAPTCHAs/logins, and submit manually in the browser.")
        print("[*] Press Enter in the terminal when you are done to close the browser.")
        await asyncio.get_event_loop().run_in_executor(None, input)
        await context.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nExiting...")
