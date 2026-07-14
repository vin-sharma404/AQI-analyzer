# 🌍 AI-Assisted Air Quality Index Analyzer (BreatheEasy)

A modern web application that provides **real-time Air Quality Index (AQI) monitoring**, weather information, health recommendations, and an AI-powered chatbot to help users understand air pollution and stay informed.

---

## 📌 Features

- 🌎 Real-time AQI monitoring
- 🌡️ Live temperature display
- 💨 Wind speed & humidity
- 🤖 AI-powered chatbot for AQI queries
- 🎤 Voice input support
- 🔍 Search AQI by city
- 📊 AQI comparison table for major cities
- 🚨 Health precautions based on AQI level
- 📱 Fully responsive UI
- 🎨 Dynamic AQI color indicators
- 🔔 Notification system

---

## 📷 Preview

> Add screenshots of your homepage here.

Example:

```
<img width="891" height="766" alt="image" src="https://github.com/user-attachments/assets/a7a7921e-d45b-4b6c-a18e-d4d49656f5c5" />
<img width="822" height="552" alt="image" src="https://github.com/user-attachments/assets/ea09bd75-799b-4d8d-b0ef-731254bacce2" />
<img width="834" height="550" alt="image" src="https://github.com/user-attachments/assets/5261f804-32ab-4aa0-b6a2-9fcdab92b5bd" />


```

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6)

### APIs
- OpenWeatherMap Geocoding API
- OpenWeatherMap Weather API
- OpenWeatherMap Air Pollution API

### Libraries
- Bootstrap 5
- Bootstrap Icons
- Google Fonts (Poppins)

---

## 📂 Project Structure

```
AI-Assisted-AQI-Analyzer/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
      ├── images/
      └── screenshots/
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/AI-Assisted-AQI-Analyzer.git
```

Go inside the project

```bash
cd AI-Assisted-AQI-Analyzer
```

Open

```
index.html
```

using any browser.

---

## 🔑 API Setup

This project uses the **OpenWeatherMap API**.

1. Create a free account on OpenWeatherMap.
2. Generate an API key.
3. Open `script.js`


```javascript
const API_KEY = "b5d20329d39b4bd08af2e9b68151a3a0";
```

---

## 🚀 How It Works

1. User searches for a city.
2. Geocoding API fetches latitude and longitude.
3. Weather API retrieves:
   - Temperature
   - Humidity
   - Wind Speed
4. Air Pollution API retrieves pollutant data.
5. AQI is calculated and displayed.
6. Health recommendations are shown.
7. AI chatbot answers user queries related to AQI and pollution.

---

## 🤖 Chatbot Features

The chatbot can answer questions like:

- What is AQI?
- Health effects of pollution
- Precautions during poor air quality
- Current AQI
- Carbon footprint
- Pollution sources
- Clean air benefits
- Environmental awareness

It also supports:

- Voice Input
- Text-to-Speech Responses

---

## 📊 AQI Categories

| AQI | Category |
|------|----------|
| 0–50 | Good 🟢 |
| 51–100 | Moderate 🟡 |
| 101–150 | Unhealthy for Sensitive Groups 🟠 |
| 151–200 | Unhealthy 🔴 |
| 201–300 | Very Unhealthy 🟣 |
| 301+ | Hazardous ⚫ |

---

## 🎯 Future Improvements

- User Authentication
- AQI Prediction using Machine Learning
- Historical AQI Graphs
- Favorite Cities
- Email Notifications
- GPS Location Detection
- Multi-language Support
- Dark Mode
- PWA Support
- Interactive Charts

---

## 👨‍💻 Contributors

- Vinayak Sharma
- Varun Singh
- Tanush Luthra
- Trijal Wadhwa

---


## 📄 License

This project is developed for educational purposes.

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
