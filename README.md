# 🌦️ Modern Weather Dashboard - SUT Project 2026

## 📌 Project Overview
The **Modern Weather Dashboard** is an advanced, fully integrated web application developed as an enterprise-grade university project at Elsewedy University of Technology (SUT). Built completely from scratch, this application seamlessly bridges cutting-edge UI/UX design (Glassmorphism) with intelligent natural language processing, dynamic geolocation mapping, responsive data visualization, a secure backend architecture, and robust Progressive Web App (PWA) offline capabilities.

---

## 👨‍💻 Developer
* **Ahmed Aldmrdash** - *AI Engineer & Software Developer* (Sole Creator & Developer)

---

## 🚀 Comprehensive Features

### 🎨 1. UI/UX & Visual Experience
* **Glassmorphic Design:** Elegant, modern interfaces utilizing backdrop blur filters, high-fidelity transparency, and glowing borders.
* **Seamless Theme Toggling:** Smooth transition between Dark and Light modes, caching user preferences locally via `localStorage`.
* **Live Cinematic Video Backgrounds:** Replaced traditional static imagery with loop-enabled HTML5 video layers that dynamically adjust to the current weather condition (e.g., light/heavy rain, overcast clouds, clear day, clear night, thunderstorms, snow, or mist).
* **Smart Weather Assistant:** Integrated customized, reactive `SweetAlert2` toasts providing context-aware human recommendations based on temperature and climate criteria (e.g., "It's raining! Don't forget your umbrella ☂️").

### 🔊 2. Sensory & Micro-Interactions
* **Responsive Feedback Audio:** Crisp audio cues triggered natively upon interactive clicks (searching, clicking the map, selecting sidebar items, or toggling themes).
* **Ambient Soundscapes:** Atmospheric weather audio playing smoothly on an automated loop matching the specific meteorologic profile of the searched location (e.g., sound of rain, rolling thunder, or wind gusts), utilizing clever browser policy workarounds to bypass autoplay blocks.

### 🧠 3. Natural Language Processing & Intelligent Search
* **Smart Voice Search:** Integrated hands-free vocal city searching using the `Web Speech API`, localized natively for Arabic and English spoken commands.
* **Text Normalization Algorithm:** Implemented a robust pre-processing script that sanitizes text inputs by automatically stripping unnecessary prefixes/suffixes (like "مدينة" or "محافظة") and rectifying common character ambiguities (such as Arabic Taa Marbuta vs. Haa) to maximize external API query success rates.
* **Geocoding Validation Layer:** Couples raw user entries with the `Nominatim OpenStreetMap Geocoding API` to resolve typos, ambiguous names, and regional accents into precise coordinates prior to fetching weather payloads.

### 🗺️ 4. Advanced Mapping & Geolocation
* **Hyper-Local Automated Detection:** Prompts for native browser geolocation coordinates upon application load, running a reverse geocoding script to display real-time hyper-local conditions immediately.
* **Interactive Leaflet.js Grid:** High-performance, fully localized map rendering custom tile coordinates with clean, responsive pop-up markers summarizing pinpoint regional temperatures upon click.

### 📊 5. Predictive Analytics & Visualizations
* **Aggregated 5-Day Extended Forecast:** Custom data-parsing engine that samples 40 separate three-hour data intervals from the server and clusters them into distinct, structured daily maximum/minimum temperature blocks.
* **Interactive Charting Engines:** Harnesses `Chart.js` to draw clean, curved vector line plots comparing multi-day temperature shifts, styled adaptively to remain fully legible across Dark and Light mode background variations.

### 💾 6. Database Synchronization & Backend Architecture
* **Relational History Tracking:** Keeps full persistent server records via an object-oriented `MySQLi` PHP layer (`save_city.php`, `get_history.php`).
* **"Latest on Top" Caching Logic:** Custom SQL query execution that avoids heavy index restructuring by instantly deleting older duplicated names and pushing incoming city entries as fresh, auto-incremented primary keys.

### 📴 7. Progressive Web App (PWA) & Offline Resiliency
* **Native Desktop/Mobile Installation:** Explicit configuration of a web app `manifest.json` asset bundle allowing users to install the system natively on Windows, macOS, Android, or iOS devices.
* **Asynchronous Service Worker Caching:** Employs a standalone `sw.js` pipeline to intercept fetch events and cache critical styling scripts, fonts, and structures. In the event of network disruption, the script gracefully serves cached snapshots from the `localStorage` data store along with an informative warning banner.

---

## 🛠️ Technical Stack
* **Frontend Core:** HTML5, CSS3 (Custom Variables, Flexbox, CSS Grid, Advanced Keyframe Animations), JavaScript (ES6+, Async/Await, concurrent `Promise.all` networking).
* **Backend Core:** PHP 8, MySQL Relational Database (XAMPP Sandbox Architecture).
* **External API Gateways:** OpenWeatherMap API, Nominatim OpenStreetMap Reverse Geocoding engine.
* **Frameworks & Utilities:** Leaflet.js maps, Chart.js, SweetAlert2.
* **PWA Assets:** Service Workers (`sw.js`), Web App Manifest schemas (`manifest.json`).

---

## ⚙️ Installation & Deployment Sandbox
1. Clone or download this repository directly into your local server directory (e.g., XAMPP's `htdocs`).
2. Import the provided database structure `sql_code.sql` using a manager like `phpMyAdmin`.
3. Open `db.php` and update the database link credentials (host, user, password, database name, and port).
4. Run your local server and open the directory on a secure, modern browser (Google Chrome or Microsoft Edge highly recommended for full Speech-to-Text API compatibility).
