# ROI Compass 

A professional marketing dashboard that helps marketers move from spreadsheets to real‑time ROI calculations, campaign storage, and client‑ready reports.

## 🚀 Features
- Real‑time ROI calculations (CPC, CPL, Leads) with instant visual feedback.
- Campaign persistence using `localStorage` – save, view, sort, and delete campaigns.
- Dark mode that respects user preference and persists across sessions.
- PDF export of key metrics (with logo & timestamp) using `jsPDF` + `html2canvas`.
- Google‑style SEO preview tool to test meta titles and descriptions.
- Fully responsive layout with Flexbox sidebar and CSS Grid metric cards.

## 🛠️ Tech Stack
- **HTML5** – semantic structure
- **CSS3** – custom properties (theming), Flexbox, Grid, media queries
- **JavaScript (ES6)** – modular functions, DOM manipulation, `localStorage`
- **Libraries** – [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) for PDF generation

## Project Structure
``` bash 

ROI-Compass-and-Campaign-Tracker-/
├── assets/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ ├── calculations.js
│ │ ├── storage.js
│ │ └── ui.js
│ └── images/
│ └── (placeholder logo)
├── index.html
├── campaigns.html
├── about.html
├── planning.txt
├── .gitignore
└── README.md

```

## 🧪 How to Run
1. Clone or download the repository.
2. Open `index.html` in any modern web browser (no server needed).
3. Start calculating and saving campaigns!

## 📄 Technical Decisions
- **Vanilla JavaScript** was chosen over frameworks to demonstrate deep understanding of core web technologies and to keep the bundle minimal.
- **`localStorage`** provides a lightweight, client‑side persistence layer without requiring a backend – perfect for a prototype.
- **CSS custom properties** enable a maintainable theming system that can be extended easily.
- **Modular JavaScript** separates concerns (calculations, storage, UI) for cleaner code and easier testing.


## 📊 PDF Report Example
When you click the **Generate Professional Report** button after calculating a campaign, you get a clean, branded document that includes:
- Campaign inputs (Budget, Clicks, Conversion Rate)
- Key metrics (CPC, CPL, Leads)
- Lead quality assessment (color‑coded)
- Timestamp and logo placeholder

This report is ready to be shared with clients or stakeholders.

## 🤝 Contributing
This project is a prototype; contributions are welcome. Please open an issue or pull request for any improvements.

## 📝 License
MIT © ROI Compass