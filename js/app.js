/*
 * =========================================================
 * Modern Weather Dashboard - Core JavaScript Logic
 * Project: SUT 2026
 * Author: Ahmed Aldmrdash (Team Leader & AI Engineer)
 * =========================================================
 */

// =========================================================
// 1. Configuration & Global Variables
// =========================================================
const API_KEY = 'dc6995fce2cbfe9781f339cb5d7a2288';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

let map;
let marker;
let forecastChartInstance = null; // ضيف السطر ده مع الـ Global Variables فوق


// =========================================================
// 2. UI & Theming Helper Functions
// =========================================================

function getWeatherIcon(condition) {
    const desc = condition.toLowerCase();
    const path = "images/"; 

    if (desc.includes("clear")) return `${path}clear.png`;
    if (desc.includes("few clouds")) return `${path}Few-clouds.png`;
    if (desc.includes("scattered clouds")) return `${path}Scattered-clouds.png`;
    if (desc.includes("broken clouds")) return `${path}Broken-clouds.png`;
    if (desc.includes("overcast clouds")) return `${path}Overcast-clouds.png`;
    if (desc.includes("light rain")) return `${path}Light-rain.png`;
    if (desc.includes("moderate rain")) return `${path}Moderate-rain.png`;
    if (desc.includes("heavy intensity rain")) return `${path}Heavy-intensity-rain.png`;
    if (desc.includes("thunderstorm with rain")) return `${path}Thunderstorm-with-rain.png`;
    if (desc.includes("thunderstorm")) return `${path}Thunderstorm.png`;
    if (desc.includes("light snow")) return `${path}Light-snow.png`;
    if (desc.includes("heavy snow")) return `${path}Heavy-snow.png`;
    if (desc.includes("drizzle")) return `${path}Drizzle.png`;
    if (desc.includes("mist")) return `${path}Mist.png`;
    if (desc.includes("fog")) return `${path}Fog.png`;
    if (desc.includes("haze")) return `${path}haze.png`;
    if (desc.includes("dust")) return `${path}Dust.png`;
    if (desc.includes("sand")) return `${path}Sand.png`;
    if (desc.includes("smoke")) return `${path}Smoke.png`;

    return `${path}icon.png`; // Fallback icon
}

// =========================================================
// نظام إدارة الأصوات (Audio Management System)
// =========================================================

const weatherSounds = {
    'storm-heavy': new Audio('Audios/storm-heavy.mp3'),
    'storm-light': new Audio('Audios/storm-light.mp3'),
    'thunder-only': new Audio('Audios/thunder-only.mp3'),
    
    'rain-heavy': new Audio('Audios/rain-heavy.mp3'),
    'rain-medium': new Audio('Audios/rain-medium.mp3'),
    'rain-light': new Audio('Audios/rain-light.mp3'),
    'rain-shower': new Audio('Audios/rain-shower.mp3'),
    
    'snow': new Audio('Audios/snow.mp3'),
    'sand': new Audio('Audios/sand.mp3'),
    'wind-strong': new Audio('Audios/wind-strong.mp3'),
    'wind-light': new Audio('Audios/wind-light.mp3'),
    'clear-day': new Audio('Audios/clear-day.mp3'),
    'clear-night': new Audio('Audios/clear-night.mp3'),
    
    'click': new Audio('Audios/click.mp3'),
    'success': new Audio('Audios/success.mp3'),
    'error': new Audio('Audios/error.mp3') 
};

const loopSounds = ['storm-heavy', 'storm-light', 'thunder-only', 'rain-heavy', 'rain-medium', 'rain-light', 'rain-shower', 'snow', 'sand', 'wind-strong', 'wind-light', 'clear-day', 'clear-night'];
loopSounds.forEach(key => {
    if(weatherSounds[key]) weatherSounds[key].loop = true;
});

let currentPlayingSound = null;

// 🟢 [تعديل جديد: دالة موحدة لتشغيل صوت الكليك لسهولة استدعائها من أي مكان] 🟢
function playClickSound() {
    if (weatherSounds && weatherSounds['click']) {
        weatherSounds['click'].currentTime = 0;
        weatherSounds['click'].play().catch(err => {
            console.log("تنبيه: المتصفح يمنع التشغيل التلقائي حتى يتفاعل المستخدم.", err);
        });
    }
}

function playWeatherSound(data) {
    if (currentPlayingSound) {
        currentPlayingSound.pause();
        currentPlayingSound.currentTime = 0;
    }

    const code = data.weather[0].id;
    let soundKey = '';

    if (code >= 200 && code <= 202) soundKey = 'storm-heavy';
    else if (code >= 210 && code <= 232) soundKey = 'storm-light';
    else if (code >= 300 && code <= 321) soundKey = 'rain-light';
    else if (code >= 500 && code <= 501) soundKey = 'rain-light';
    else if (code >= 502 && code <= 504) soundKey = 'rain-heavy';
    else if (code >= 511 && code <= 531) soundKey = 'rain-shower';
    else if (code >= 600 && code <= 622) soundKey = 'snow';
    else if (code >= 701 && code <= 781) soundKey = 'sand';
    else if (code === 800) {
        soundKey = data.weather[0].icon.includes('n') ? 'clear-night' : 'clear-day';
    }
    else if (code === 801 || code === 802) soundKey = 'wind-light';
    else if (code === 803 || code === 804) soundKey = 'wind-strong';

    if (soundKey && weatherSounds[soundKey]) {
        currentPlayingSound = weatherSounds[soundKey];
        currentPlayingSound.play().catch(err => {
            console.log("تنبيه: المتصفح يمنع التشغيل التلقائي حتى يتفاعل المستخدم.");
        });
    }
}

/*
 * 🟢 دالة تغيير فيديو الخلفية بناءً على الطقس والأسماء الجديدة 🟢
 */
const updateBackground = (data) => {
    const desc = data.weather[0].description.toLowerCase();
    const icon = data.weather[0].icon; // بناخد الأيقونة عشان نعرف هو نهار (d) ولا ليل (n)
    const bgVideo = document.getElementById('bg-video');
    
    let videoSrc = 'videos/clear-day.mp4'; // المسار الافتراضي

    // تحديد الفيديو المناسب بناءً على الأسماء اللي في الصورة
    if (desc.includes("clear")) {
        videoSrc = icon.includes('n') ? 'videos/clear-night.mp4' : 'videos/clear-day.mp4';
    } 
    else if (desc.includes("few clouds") || desc.includes("scattered clouds")) {
        videoSrc = 'videos/clouds-light.mp4';
    } 
    else if (desc.includes("cloud") || desc.includes("overcast")) {
        videoSrc = 'videos/clouds-heavy.mp4';
    } 
    else if (desc.includes("light rain") || desc.includes("drizzle")) {
        videoSrc = 'videos/rain-light.mp4';
    } 
    else if (desc.includes("rain") || desc.includes("squall")) {
        videoSrc = 'videos/rain-heavy.mp4';
    } 
    else if (desc.includes("thunderstorm") || desc.includes("tornado")) {
        videoSrc = 'videos/storm.mp4';
    } 
    else if (desc.includes("snow") || desc.includes("sleet")) {
        videoSrc = 'videos/snow.mp4';
    } 
    else if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze") || desc.includes("dust") || desc.includes("sand") || desc.includes("smoke") || desc.includes("ash")) {
        videoSrc = 'videos/fog.mp4';
    } 
    else {
        videoSrc = 'videos/clouds-light.mp4';
    }

    // تشغيل الفيديو لو المسار اتغير
    if (!bgVideo.src.includes(videoSrc)) {
        bgVideo.src = videoSrc;
        bgVideo.play().catch(e => console.log("تنبيه: خطأ في تشغيل فيديو الخلفية", e));
    }
};


// =========================================================
// 3. Map & Geolocation Features
// =========================================================

// =========================================================
// 3. Premium Free Map & Geolocation Features
// =========================================================

const updateMap = (lat, lon, temp, city) => {
    if (!map) {
        // تهيئة الخريطة
        map = L.map('map').setView([lat, lon], 10);
        
        // 🟢 استخدام خريطة CartoDB Voyager (مجانية، سريعة، وشكلها زي Google Maps) 🟢
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors, © CARTO'
        }).addTo(map);

        // الاستماع للضغط على الخريطة
        map.on('click', async (e) => {
            playClickSound(); // تشغيل صوت الكليك
            
            const { lat, lng } = e.latlng;
            if(typeof Swal !== 'undefined') Swal.showLoading();

            try {
                // 🟢 استخدام OpenWeather Geocoding API (أدق ومربوط بحالة الطقس) 🟢
                const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`);
                const geoData = await geoRes.json();

                // استخراج الاسم (الأولوية للاسم بالعربي لو متاح، وبعدين الإنجليزي)
                let preciseLocation = "منطقة غير معروفة";
                if (geoData && geoData.length > 0) {
                    preciseLocation = (geoData[0].local_names && geoData[0].local_names.ar) 
                                      ? geoData[0].local_names.ar 
                                      : geoData[0].name;
                }

                // جلب بيانات الطقس والتوقعات
                const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`);
                const weatherData = await weatherRes.json();
                
                const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`);
                const forecastData = await forecastRes.json();

                if (weatherData && forecastData) {
                    weatherData.name = preciseLocation; // تحديث اسم المكان باللي جبناه
                    displayCurrentWeather(weatherData); // هتحدث الطقس والصوت والخلفية
                    displayForecast(forecastData);
                    saveCityToHistory(preciseLocation);
                }
                
                if(typeof Swal !== 'undefined') Swal.close();
            } catch (err) {
                console.error("Map Click Event Error: ", err);
                if(typeof Swal !== 'undefined') Swal.fire({ icon: 'error', title: 'Oops...', text: 'Could not fetch weather for this specific spot.' });
            }
        });
    } else {
        // أنيميشن طيران سلس للمكان الجديد
        map.flyTo([lat, lon], 10, {
            animate: true,
            duration: 1.5 
        });
    }

    if (marker) {
        map.removeLayer(marker);
    }

    // إضافة الماركر ونافذة المعلومات
    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<strong style="color:#0284c7;">${city}</strong><br>Temp: ${Math.round(temp)}°C`)
        .openPopup();
};

// =========================================================
// تحديث دالة جلب الموقع التلقائي (لجلب كل البيانات فوراً)
// =========================================================

const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                if(typeof Swal !== 'undefined') Swal.showLoading();

                // 1. جلب اسم المنطقة الدقيق
                const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
                const geoData = await geoRes.json();
                
                let preciseLocation = "موقعي الحالي";
                if (geoData && geoData.length > 0) {
                    preciseLocation = (geoData[0].local_names && geoData[0].local_names.ar) 
                                      ? geoData[0].local_names.ar 
                                      : geoData[0].name;
                }

                // 🟢 2. جلب الطقس الحالي والتوقعات مع بعض (زي نظام البحث) 🟢
                const [currentRes, forecastRes] = await Promise.all([
                    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
                    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
                ]);

                const currentData = await currentRes.json();
                const forecastData = await forecastRes.json();
                
                if (currentData && forecastData) {
                    currentData.name = preciseLocation; 
                    
                    // تحديث الواجهة بالكامل
                    displayCurrentWeather(currentData); // بتشغل الصوت والخلفية والكارت الرئيسي
                    displayForecast(forecastData);     // 👈 دي اللي كانت ناقصة (بتشغل الكروت والجدول والشارت)
                    
                    saveCityToHistory(preciseLocation); 
                }

                if(typeof Swal !== 'undefined') Swal.close();

            } catch (error) {
                console.warn("Could not fetch local data on load:", error);
                if(typeof Swal !== 'undefined') Swal.close();
            }
        });
    }
};


// =========================================================
// 4. Core Weather Fetching Logic
// =========================================================

// =========================================================
// 4. Core Weather Fetching Logic (Smart Search Edition)
// =========================================================

// =========================================================
// 4. Core Weather Fetching Logic (Smart Search & Offline Support)
// =========================================================

const fetchWeatherData = async (cityInputStr) => {
    try {
        // إظهار علامة التحميل لتحسين تجربة المستخدم
        if(typeof Swal !== 'undefined') Swal.showLoading();

        // 1. تنظيف النص: إزالة الكلمات الزائدة التي قد يضيفها البحث الصوتي
        let cleanedCity = cityInputStr.replace(/^(مدينة|محافظة|ولاية)\s/g, '').trim();

        // 2. البحث الذكي عن المدينة (تحويل الاسم إلى إحداثيات)
        // نستخدم Nominatim لأنه يفهم الأخطاء الإملائية والأسماء بالعربي بدقة
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanedCity)}&format=json&limit=1&accept-language=ar`);
        const geoData = await geoRes.json();

        // التحقق من وجود المدينة
        if (!geoData || geoData.length === 0) {
            throw new Error("City not found");
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        const preciseLocation = geoData[0].name || cleanedCity;

        // 3. جلب بيانات الطقس والتوقعات معاً لسرعة الأداء
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error("Weather API failed");
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        // تحديث اسم المدينة بالاسم المنمق الذي وجده محرك البحث
        currentData.name = preciseLocation;

        // 4. حفظ البيانات في localStorage لدعم وضع "عدم الاتصال" (Offline Mode)
        localStorage.setItem('lastWeatherData', JSON.stringify(currentData));
        localStorage.setItem('lastForecastData', JSON.stringify(forecastData));

        // 5. تحديث الواجهة والرسوم البيانية والأصوات
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        if(typeof Swal !== 'undefined') Swal.close();
        return true; 
        
    } catch (error) {
        if(typeof Swal !== 'undefined') Swal.close();

        // تشغيل صوت الخطأ
        if (weatherSounds && weatherSounds['error']) {
            weatherSounds['error'].currentTime = 0;
            weatherSounds['error'].play().catch(e => console.log(e));
        }

        // محاولة جلب آخر بيانات مخزنة لو كان المستخدم أوفلاين
        const lastData = localStorage.getItem('lastWeatherData');
        const lastForecast = localStorage.getItem('lastForecastData');

        if (lastData && lastForecast) {
            displayCurrentWeather(JSON.parse(lastData));
            displayForecast(JSON.parse(lastForecast));
            
            Swal.fire({
                icon: 'warning',
                title: 'أنت تعمل في وضع عدم الاتصال',
                text: 'لم نتمكن من جلب بيانات جديدة، يتم عرض آخر بيانات محفوظة.',
                background: document.body.classList.contains('light-mode') ? '#fff' : '#1e293b',
                color: document.body.classList.contains('light-mode') ? '#0f172a' : '#f8fafc'
            });
            return true;
        }

        // في حال فشل كل شيء وعدم وجود بيانات مخزنة
        console.error("Search Error:", error);
        if(typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'عذراً',
                text: 'لم نتمكن من العثور على المدينة، يرجى التأكد من الاسم والاتصال بالإنترنت.',
                confirmButtonColor: '#38bdf8',
                background: document.body.classList.contains('light-mode') ? '#fff' : '#1e293b',
                color: document.body.classList.contains('light-mode') ? '#0f172a' : '#f8fafc'
            });
        }
        return false;
    }
};

// =========================================================
// 5. DOM Manipulation & Display Methods
// =========================================================

// =========================================================
// استبدل دالة displayCurrentWeather القديمة بالكامل بالدالة دي
// =========================================================

const displayCurrentWeather = (data) => {
    // 1. تشغيل صوت النجاح
    if (weatherSounds && weatherSounds['success']) {
        weatherSounds['success'].currentTime = 0;
        weatherSounds['success'].play().catch(e=>console.log(e));
    }
    
    // 2. تشغيل صوت الطقس
    playWeatherSound(data);

    // 🟢 3. التعديل اللي كان عامل المشكلة: تمرير (data) كاملة مش مجرد النص 🟢
    updateBackground(data);
    
    // 4. عرض الداتا في الشاشة
    const weatherSection = document.getElementById('current-weather');
    const iconUrl = getWeatherIcon(data.weather[0]?.description || '');
    
    let fullCountryName = data.sys.country;
    try {
        const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
        fullCountryName = regionNames.of(data.sys.country);
    } catch (e) {
        console.warn("Could not translate country code.");
    }
    
    weatherSection.innerHTML = `
        <div class="current-weather-card">
            <h2>${data.name}, ${fullCountryName}</h2>
            <div class="weather-info">
                <img src="${iconUrl}" alt="${data.weather[0]?.description || 'weather'}">
                <div class="details">
                    <p class="temp">${Math.round(data.main.temp)}°C</p>
                    <p class="desc" style="text-transform: capitalize;">${data.weather[0]?.description || ''}</p>
                </div>
            </div>
        </div>
    `;

    // 5. تحديث الخريطة
    updateMap(data.coord.lat, data.coord.lon, data.main.temp, data.name);

    // 6. عرض نصيحة الطقس
    let advice = "";
    let adviceIcon = "info";

    if (data.weather[0].main.toLowerCase() === "rain" || data.weather[0].main.toLowerCase() === "drizzle") {
        advice = "It's raining! Don't forget your umbrella ☂️";
        adviceIcon = "warning";
    } else if (data.main.temp > 30) {
        advice = "It's quite hot! Stay hydrated and drink plenty of water 💧";
        adviceIcon = "warning";
    } else if (data.main.temp < 15) {
        advice = "It's cold out there! Wear something heavy 🧥";
        adviceIcon = "info";
    } else {
        advice = "The weather is great! Have a wonderful day 🌟";
        adviceIcon = "success";
    }

    if(typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            background: document.body.classList.contains('light-mode') ? '#fff' : '#1e293b',
            color: document.body.classList.contains('light-mode') ? '#0f172a' : '#f8fafc'
        });

        Toast.fire({
            icon: adviceIcon,
            title: `${data.name} Weather`,
            text: advice
        });
    }
};

const displayForecast = (data) => {
    const forecastContainer = document.getElementById('forecast-cards');
    const forecastSection = document.querySelector('.forecast-section');
    if (!forecastContainer) return; 

    forecastContainer.innerHTML = ''; 

    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const dateStr = item.dt_txt.split(' ')[0]; 
        
        if (!dailyForecasts[dateStr]) {
            dailyForecasts[dateStr] = {
                dt: item.dt,
                weather: item.weather, 
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min
            };
        } else {
            if (item.main.temp_max > dailyForecasts[dateStr].temp_max) {
                dailyForecasts[dateStr].temp_max = item.main.temp_max;
            }
            if (item.main.temp_min < dailyForecasts[dateStr].temp_min) {
                dailyForecasts[dateStr].temp_min = item.main.temp_min;
            }
            if (item.dt_txt.includes("12:00:00")) {
                dailyForecasts[dateStr].weather = item.weather;
            }
        }
    });

    const dailyData = Object.values(dailyForecasts).slice(0, 5);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const iconUrl = getWeatherIcon(day.weather[0]?.description || '');
        
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `
            <h4>${date}</h4>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 15px 0;">
                <img src="${iconUrl}" alt="Weather Icon" style="width: 50px; height: auto;">
                <span style="font-size: 0.9rem; text-transform: capitalize; color: var(--text-dim); text-align: left;">
                    ${day.weather[0]?.description || 'Unknown'}
                </span>
            </div>
            <p><strong>${Math.round(day.temp_max)}°</strong> / ${Math.round(day.temp_min)}°</p>
        `;
        forecastContainer.appendChild(card);
    });

    renderForecastTable(dailyData, forecastSection || forecastContainer.parentElement);
    renderChart(dailyData);
};

const renderForecastTable = (dailyData, container) => {
    if (!container) return; 

    const oldTable = container.querySelector('.forecast-table');
    if (oldTable) oldTable.remove();

    const table = document.createElement('table');
    table.className = 'forecast-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Day</th>
                <th>Date</th>
                <th>Icon</th>
                <th>Condition</th>
                <th>High</th>
                <th>Low</th>
            </tr>
        </thead>
        <tbody>
            ${dailyData.map(day => {
                const iconUrl = getWeatherIcon(day.weather[0]?.description || '');
                const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                const fullDate = new Date(day.dt * 1000).toLocaleDateString();

                return `
                <tr>
                    <td style="font-weight: bold; color: var(--accent-color);">${dayName}</td>
                    <td>${fullDate}</td>
                    <td>
                        <img src="${iconUrl}" alt="Icon" style="width: 40px; height: auto; filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.4));">
                    </td>
                    <td style="text-transform: capitalize;">${day.weather[0]?.description || 'N/A'}</td>
                    <td>${Math.round(day.temp_max)}°C</td>
                    <td>${Math.round(day.temp_min)}°C</td>
                </tr>
                `;
            }).join('')}
        </tbody>
    `;
    container.appendChild(table);
};

// =========================================================
// 🟢 Interactive Chart (الرسم البياني) 🟢
// =========================================================
const renderChart = (dailyData) => {
    const ctx = document.getElementById('forecast-chart').getContext('2d');
    
    // لو في رسمة قديمة، امسحها الأول
    if (forecastChartInstance) {
        forecastChartInstance.destroy();
    }

    // تجهيز البيانات
    const labels = dailyData.map(day => new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
    const maxTemps = dailyData.map(day => Math.round(day.temp_max));
    const minTemps = dailyData.map(day => Math.round(day.temp_min));

    // تحديد الألوان بناءً على الوضع (Light/Dark)
    const isLightMode = document.body.classList.contains('light-mode');
    const textColor = isLightMode ? '#64748b' : '#94a3b8';
    const gridColor = isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';

    forecastChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Max Temp (°C)',
                    data: maxTemps,
                    borderColor: '#38bdf8', // Accent Color
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    borderWidth: 3,
                    tension: 0.4, // بيخلي الخط منحني وشيك
                    fill: true
                },
                {
                    label: 'Min Temp (°C)',
                    data: minTemps,
                    borderColor: '#94a3b8',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5], // خط متقطع
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor, font: { family: 'Poppins' } } }
            },
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Poppins' } }
                },
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Poppins' } }
                }
            }
        }
    });
};


// =========================================================
// 6. Backend Integration & Database Sync
// =========================================================

const saveCityToHistory = async (city) => {
    try {
        const response = await fetch('api/save_city.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `city=${encodeURIComponent(city)}`
        });
        
        if (response.ok) {
            await updateSidebar(); 
        }
    } catch (err) {
        console.warn("Database Error: Could not save to history.");
    }
};

const updateSidebar = async () => {
    try {
        const response = await fetch('api/get_history.php');
        if (!response.ok) return;
        
        const history = await response.json();
        const sidebarContainer = document.getElementById('saved-cities');
        
        if (sidebarContainer) {
            if (history.length === 0) {
                sidebarContainer.innerHTML = '<p style="color: var(--text-dim); font-size: 0.8rem; padding: 10px;">No recent searches</p>';
                return;
            }

            // 🟢 [تعديل جديد: إضافة playClickSound() عند الضغط على مدينة في السايد بار] 🟢
            sidebarContainer.innerHTML = history.map(item => `
                <div class="saved-city" onclick="playClickSound(); fetchWeatherData('${item.city_name}'); saveCityToHistory('${item.city_name}');">
                    ${item.city_name}
                </div>
            `).join('');
        }
    } catch (error) {
        console.warn("UI Error: Could not refresh sidebar. Check PHP connection.");
    }
};


// =========================================================
// 7. Event Listeners & Application Initialization
// =========================================================

document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    // 🟢 [تعديل جديد: تشغيل الكليك لما تعمل سيرش] 🟢
    playClickSound();

    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    
    if (city) {
        const isSuccess = await fetchWeatherData(city);
        if (isSuccess) {
            await saveCityToHistory(city); 
        }
        cityInput.value = ''; 
    }
});

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.innerHTML = '🌙 Dark Mode';
}

themeToggle.addEventListener('click', () => {
    // 🟢 [تعديل جديد: تشغيل الكليك لما تغير الثيم] 🟢
    playClickSound();

    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '🌙 Dark Mode';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '☀️ Light Mode';
    }
});

// =========================================================
// خدعة لتخطي حظر التشغيل التلقائي (Autoplay Policy) للمتصفح
// =========================================================

let isAudioUnlocked = false;

// هنسمع لأول ضغطة من المستخدم في أي مكان في الصفحة
document.addEventListener('click', () => {
    if (!isAudioUnlocked) {
        isAudioUnlocked = true; // كده فكينا الحظر
        
        // لو في صوت طقس جاهز بس المتصفح كان موقفه (paused)، هنشغله فوراً
        if (currentPlayingSound && currentPlayingSound.paused) {
            currentPlayingSound.play().catch(e => console.log("خطأ في تشغيل الصوت:", e));
        }
    }
}, { once: true }); // { once: true } بتخلي الإيفنت ده يشتغل مرة واحدة بس عشان مياكلش من الـ Performance

// =========================================================
// 🟢 Voice Search (البحث الصوتي الذكي مع معالجة الأخطاء) 🟢
// =========================================================
const voiceBtn = document.getElementById('voice-search-btn');
const cityInput = document.getElementById('city-input');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ar-EG'; 

    recognition.onstart = () => {
        voiceBtn.classList.add('listening');
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true, position: 'top', icon: 'info',
                title: 'تحدث الآن، أنا أسمعك...', showConfirmButton: false, timer: 3000
            });
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        cityInput.value = transcript; 
        
        playClickSound();
        document.getElementById('search-form').dispatchEvent(new Event('submit'));
    };

    // 🟢 معالجة الأخطاء عشان نعرف المشكلة فين بالظبط 🟢
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        voiceBtn.classList.remove('listening');
        
        let errorMsg = 'حدث خطأ غير معروف.';
        if (event.error === 'not-allowed') errorMsg = 'يرجى السماح للمتصفح باستخدام المايكروفون أولاً.';
        if (event.error === 'network') errorMsg = 'يجب تشغيل المشروع عبر Localhost أو اتصال إنترنت قوي.';
        if (event.error === 'no-speech') errorMsg = 'لم أتمكن من سماع شيء، حاول التحدث بوضوح أكر.';

        if(typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true, position: 'top', icon: 'error',
                title: errorMsg, showConfirmButton: false, timer: 4000
            });
        }
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
    };

    voiceBtn.addEventListener('click', () => {
        playClickSound();
        recognition.start();
    });
} else {
    voiceBtn.style.display = 'none';
    console.warn("Speech Recognition API is not supported in this browser.");
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.log('Service Worker Error', err));
  });
}
window.onload = () => {
    updateSidebar();
    getUserLocation(); 
};