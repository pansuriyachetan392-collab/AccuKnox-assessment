# CNAPP Dashboard

A React dashboard for the frontend trainee assignment. Categories and widgets are loaded from JSON, and adding or removing a widget is stored in the browser with Zustand.

## Run locally

1. Install [Node.js](https://nodejs.org/) 18 or newer.
2. Open a terminal in this folder.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm run dev
```

5. Open the URL printed in the terminal, usually http://localhost:5173.

To build a production copy:

```bash
npm run build
npm run preview
```

## How the dashboard works

- Widget layout comes from `src/data/dashboard.json`. Each category (CSPM, CWPP, Image, Ticket) holds its own widgets.
- **Add Widget** in the header, or **+ Add Widget** on a category, opens the side panel.
- Check or uncheck widgets, then press **Confirm**. Cancel leaves the dashboard unchanged.
- In that same panel, enter a widget name and widget text to create a widget in the selected category.
- The **×** on a widget removes it from the dashboard. It stays in the category list so it can be checked again.
- **Search anything...** filters the dashboard. The panel search looks through every widget, including hidden ones.
- Choices are saved in this browser. **More options → Reset dashboard** restores the original JSON.

## Stack

React, Vite, and Zustand.
