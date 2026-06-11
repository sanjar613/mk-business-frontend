# MK Business Corp — Frontend

Official website for MK Business Corp, a consulting firm in Karakalpakstan, Uzbekistan.

🌐 **Live site:** [mkbusiness.uz](https://mkbusiness.uz)

## Tech Stack

- Vanilla HTML5, CSS3, JavaScript (no framework)
- 4 languages: Russian, English, Uzbek, Karakalpak
- Responsive / mobile-first design
- Connects to REST API backend

## Pages

| File | Description |
|---|---|
| `index.html` | Main landing page |
| `articles.html` | Articles list |
| `article-detail.html` | Article detail view |
| `templates.html` | Business plan templates |
| `login.html` | Admin login |
| `admin.html` | Admin dashboard (protected) |

## Configuration

Edit `script.js` line 1 to change the backend API URL:

```js
const API_BASE = 'https://api.mkbusiness.uz';
```

## Local Development

Open with Live Server in VS Code: `http://127.0.0.1:5500/index.html`

Make sure backend is running on `http://localhost:8080`.

## Deployment

Deployed via GitHub Pages automatically on push to `main`.
