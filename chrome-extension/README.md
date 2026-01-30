# Adaptive Learner Chrome Extension

This folder contains a minimal Chrome side panel extension for Adaptive Learner. It lets a learner drag or paste content into a side panel, generate a summary, and ask questions (similar to Edge Copilot behavior).

## Load the extension
1. Open Chrome and visit `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this `chrome-extension` folder.
4. Click the Adaptive Learner toolbar icon to open the side panel.

## Backend configuration
- The panel calls the local backend at `http://localhost:3000` by default.
- Update the **API base URL** field in the panel if your backend runs elsewhere.
- If you change the backend host, also update `host_permissions` in `manifest.json` to match.

## Usage
- Highlight text on a page, then click **Use selection**.
- Or drag highlighted text into the content area, or paste it.
- Click **Summarize** or enter a question and click **Ask**.

## Notes
- The side panel uses the `/chatgpt` endpoint on the backend.
- Keep snippets short for better responses.
