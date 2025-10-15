## dom-manipulation
This project contains a Dynamic Quote Generator built with vanilla JavaScript, showcasing advanced DOM manipulation, web storage, and JSON handling.
 Features
- Display random quotes by category
- Add new quotes and categories dynamically
- Persist quotes using localStorage
- Track last viewed quote using sessionStorage
- Export quotes to a downloadable JSON file
- Import quotes from a user-uploaded JSON file
 Files
- index.html – Basic structure and UI elements
- script.js – Core logic for DOM updates, storage, and JSON handling
## How to Run
Open index.html in any modern browser. All functionality is client-side and requires no server setup.

## Server Sync & Conflict Resolution
- Simulates server sync using JSONPlaceholder
- Periodically fetches new quotes and merges with local data
- Resolves conflicts by prioritizing server quotes
- Notifies users of updates and allows manual sync