const API_KEY = "b5d20329d39b4bd08af2e9b68151a3a0"; // Replace with your OpenWeatherMap API key
let lastAQI = null;
let currentLocation = null;

function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const overlay = document.getElementById("overlay");
    const body = document.body;
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
        overlay.classList.remove("active");
        body.style.marginLeft = "0px";
    } else {
        sidebar.style.left = "0px";
        overlay.classList.add("active");
        body.style.marginLeft = "250px";
    }
}

async function getAQI(city) {
    try {
        showNotification(`Fetching data for ${city}...`);
        
        // First get coordinates for the city
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const geoData = await geoResponse.json();
        console.log("Geo Data Response:", geoData);
        
        // Check if geoData is an array and has at least one element
        if (!Array.isArray(geoData) || geoData.length === 0) {
            throw new Error("City not found. Please check the spelling or try a different city.");
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // Get weather data
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const weatherData = await weatherResponse.json();

        // Get AQI data
        const aqiResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const aqiData = await aqiResponse.json();

        const components = aqiData.list[0].components;
        const aqi = calculateAQIFromPollutants(components);
        const temp = weatherData.main.temp;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;

        lastAQI = aqi;
        currentLocation = weatherData.name;
        updateAQIUI(city, aqi, temp, windSpeed, humidity);
        updateCityTable(city, aqi, temp, windSpeed, humidity);
    } catch (error) {
        console.error("Error fetching AQI:", error);
        alert("Error fetching data for " + city + ": " + error.message);
    }
}

function updateAQIUI(city, aqi, temp, windSpeed, humidity) {
    const aqiBox = document.getElementById("aqiBox");
    const tempBox = document.getElementById("tempBox");
    const precautionBox = document.getElementById("precautionBox");

    aqiBox.textContent = `City: ${city} | AQI: ${aqi}`;
    aqiBox.className = "box " + getAQIColorClass(aqi);

    tempBox.textContent = `Temperature: ${temp}°C`;
    precautionBox.textContent = `Precautions: ${getPrecautionMessage(aqi)}`;

    document.body.style.backgroundColor = getAQIBackgroundColor(aqi);
}

function updateCityTable(city, aqi, temp, windSpeed, humidity) {
    const table = document.getElementById("citiesTable");
    const row = document.createElement("tr");
    row.classList.add("city-row");
    row.innerHTML = `
      <td>${city}</td>
      <td>${aqi}</td>
      <td>${temp}°C</td>
      <td>${windSpeed.toFixed(1)} m/s</td>
      <td>${humidity}%</td>
    `;
    table.appendChild(row);
}

function getAQIColorClass(aqi) {
    if (aqi <= 50) return "aqi-box"; // Good
    if (aqi <= 100) return "moderate"; // Moderate
    if (aqi <= 150) return "unhealthy"; // Unhealthy for sensitive groups
    if (aqi <= 200) return "unhealthy"; // Unhealthy
    if (aqi <= 300) return "hazardous"; // Very unhealthy
    return "hazardous"; // Hazardous
}

function getPrecautionMessage(aqi) {
    if (aqi <= 50) return "Air quality is good. Enjoy your day!";
    if (aqi <= 100) return "Air quality is moderate. Sensitive groups should reduce prolonged outdoor activity.";
    if (aqi <= 150) return "Unhealthy for sensitive groups. Consider limiting outdoor time.";
    if (aqi <= 200) return "Unhealthy air quality. Everyone should reduce outdoor activity.";
    if (aqi <= 300) return "Very unhealthy. Avoid going outside.";
    return "Hazardous! Remain indoors and use air purifiers.";
}

function getAQIBackgroundColor(aqi) {
    if (aqi <= 50) return "#d4edda";
    if (aqi <= 100) return "#fff3cd";
    if (aqi <= 150) return "#f8d7da";
    return "#f5c6cb";
}

function toggleChatbot() {
    const chatbox = document.getElementById("chatbox");
    chatbox.classList.toggle("show");
}

function sendMessage(message) {
    const userMessage = message || document.getElementById("user-input").value.trim();
    if (!userMessage) return;

    const chatboxBody = document.getElementById("chatbox-body");
    const userDiv = document.createElement("div");
    userDiv.classList.add("chat-message", "user-message");
    userDiv.textContent = userMessage;
    chatboxBody.appendChild(userDiv);

    document.getElementById("user-input").value = "";

    setTimeout(() => {
        const botResponse = getBotResponse(userMessage);
        const botDiv = document.createElement("div");
        botDiv.classList.add("chat-message", "bot-message");
        botDiv.textContent = botResponse;
        chatboxBody.appendChild(botDiv);
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
        speakText(botResponse);
    }, 1000);
    function getBotResponse(message) {
        const lowerCaseMessage = message.toLowerCase().replace(/[^\w\s]/gi, '').trim();

    
        const aqiAvailable = typeof lastAQI !== "undefined" && lastAQI !== null;
        const locationAvailable = typeof currentLocation !== "undefined" && currentLocation;
    
        const includes = (keywords) => keywords.some(kw => lowerCaseMessage.includes(kw));
    
        if (includes(["precaution", "what are the precautions"])) {
            return "🌬 To reduce exposure to poor air quality, limit outdoor activities, stay indoors, and use air purifiers.";
        } else if (includes(["effect", "health", "health effects", "how does air quality affect health"])) {
            return "⚠ High AQI levels can cause respiratory problems, eye irritation, and increase the risk of heart disease.";
        } else if (includes(["location", "where am i", "current location"])) {
            return locationAvailable
                ? `📍 You are in ${currentLocation}. The latest AQI here is ${aqiAvailable ? lastAQI : "not fetched yet"}.`
                : "❌ I don't have your location yet. Please allow location access or search for a city.";
        } else if (includes(["aqi", "air quality", "what is the aqi"])) {
            return aqiAvailable
                ? `📊 The last fetched AQI is ${lastAQI}.`
                : "❌ AQI data is not available yet. Please try again after data is fetched.";
        } else if (includes(["reduce carbon footprint", "how can i reduce my carbon footprint", "cut emissions"])) {
            return "🌱 You can reduce your carbon footprint by using public transport, cycling, reducing meat consumption, and conserving energy at home.";
        } else if (includes(["sources of pollution", "main sources of air pollution", "pollution sources"])) {
            return "🚗 Major sources of air pollution include vehicle emissions, industrial discharges, and burning fossil fuels.";
        } else if (includes(["health impact", "how does air quality affect health", "health issues"])) {
            return "💔 Poor air quality can lead to serious health issues, including asthma, lung cancer, and cardiovascular diseases.";
        } else if (includes(["help the environment", "what can i do to help", "eco friendly"])) {
            return "🌍 You can help the environment by planting trees, reducing waste, recycling, and supporting clean energy initiatives.";
        }  else if (includes(["commute", "daily commute", "commute impact", "how does my daily commute affect air quality"])) {
            return "🚗 Daily commutes contribute significantly to air pollution. Using public transport, carpooling, or cycling can help reduce emissions.";
        }
        
         else if (includes(["benefits of clean air", "why clean air", "advantages of clean air"])) {
            return "🌱 Clean air improves health, enhances quality of life, and supports a sustainable environment. It reduces respiratory diseases and promotes overall well-being.";
        } else if (includes(["track carbon footprint", "how can i track my carbon footprint", "carbon calculator"])) {
            return "📊 You can track your carbon footprint using various online calculators that consider your lifestyle, travel, and energy consumption.";
        } else {
            return"🤔 I'm not sure about that. Try asking about precautions, AQI, health effects, or ways to reduce pollution!";
    }
}
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Sorry, your browser doesn't support speech recognition.");
        return;
    }

    const recognition = new webkitSpeechRecognition(); // Chrome-specific
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.start();

    recognition.onstart = () => {
        showNotification("Listening... Speak now!", "info");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        sendMessage(transcript); // Send recognized text to chatbot
    };

    recognition.onerror = (event) => {
        showNotification("Voice recognition error: " + event.error, "danger");
    };

    recognition.onend = () => {
        showNotification("Stopped listening.", "secondary");
    };
}


    


function handleInput(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}


function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.className = `notification alert alert-${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.opacity = '1';
        }, 500);
    }, 3000);
}

function searchCity(event) {
    event.preventDefault();
    const city = document.getElementById("searchInput").value.trim();
    if (city) {
        getAQI(city);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                    const weatherData = await weatherResponse.json();

                    const aqiResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
                    const aqiData = await aqiResponse.json();

                    const components = aqiData.list[0].components;
                    const aqi = calculateAQIFromPollutants(components);
                    const temp = weatherData.main.temp;
                    const windSpeed = weatherData.wind.speed;
                    const humidity = weatherData.main.humidity;

                    currentLocation = weatherData.name;
                    lastAQI = aqi;
                    updateAQIUI(currentLocation, aqi, temp, windSpeed, humidity);
                    updateCityTable(currentLocation, aqi, temp, windSpeed, humidity);
                    loadNearbyCities(lat, lon);
                } catch (error) {
                    console.error("Error fetching location data:", error);
                    alert("Error fetching data for your location");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Location access denied. Using default cities.");
                getAQI("Mumbai");
                getAQI("Delhi");
            }
        );
    } else {
        alert("Geolocation not supported. Using default cities.");
        getAQI("Mumbai");
        getAQI("Delhi");
    }
}

async function loadNearbyCities(lat, lon) {
    const nearbyOffsets = [
        { name: "Nearby 1", lat: lat + 0.1, lon: lon + 0.1 },
        { name: "Nearby 2", lat: lat - 0.1, lon: lon - 0.1 },
        { name: "Nearby 3", lat: lat + 0.1, lon: lon - 0.1 },
        { name: "Nearby 4", lat: lat - 0.1, lon: lon + 0.1 }
    ];

    for (const city of nearbyOffsets) {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`);
        const weatherData = await weatherResponse.json();
        const aqiResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`);
        const aqiData = await aqiResponse.json();

        const aqi = aqiData.list[0].main.aqi * 50;
        updateCityTable(weatherData.name || city.name, aqi, weatherData.main.temp, weatherData.wind.speed, weatherData.main.humidity);
    }
}

function calculateAQIFromPollutants(components) {
    const breakpoints = {
        pm25: [
            { cLow: 0.0, cHigh: 12.0, aqiLow: 0, aqiHigh: 50 },
            { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
            { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
            { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
            { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
            { cLow: 250.5, cHigh: 350.4, aqiLow: 301, aqiHigh: 400 },
            { cLow: 350.5, cHigh: 500.4, aqiLow: 401, aqiHigh: 500 }
        ],
        pm10: [
            { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
            { cLow: 55, cHigh: 154, aqiLow: 51, aqiHigh: 100 },
            { cLow: 155, cHigh: 254, aqiLow: 101, aqiHigh: 150 },
            { cLow: 255, cHigh: 354, aqiLow: 151, aqiHigh: 200 },
            { cLow: 355, cHigh: 424, aqiLow: 201, aqiHigh: 300 },
            { cLow: 425, cHigh: 504, aqiLow: 301, aqiHigh: 400 },
            { cLow: 505, cHigh: 604, aqiLow: 401, aqiHigh: 500 }
        ]
    };
    
    function computeAQI(c, bps) {
        for (let bp of bps) {
            if (c >= bp.cLow && c <= bp.cHigh) {
                return Math.round(((bp.aqiHigh - bp.aqiLow) / (bp.cHigh - bp.cLow)) * (c - bp.cLow) + bp.aqiLow);
            }
        }
        return -1; // Return -1 if AQI cannot be computed
    }

    const aqiValues = [];

    if (components.pm2_5 !== undefined) {
        const aqi = computeAQI(components.pm2_5, breakpoints.pm25);
        if (aqi !== -1) aqiValues.push(aqi);
    }

    if (components.pm10 !== undefined) {
        const aqi = computeAQI(components.pm10, breakpoints.pm10);
        if (aqi !== -1) aqiValues.push(aqi);
    }

    if (aqiValues.length === 0) {
        console.error("Unable to calculate AQI: No valid pollutant data");
        return -1; // Return -1 if no valid AQI values could be computed
    }

    return Math.max(...aqiValues);
}




// Initialize the application when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    getCurrentLocation();
    setInterval(() => {
        if (currentLocation) {
            getAQI(currentLocation);
        }
    }, 300000); // Update every 5 minutes
});




