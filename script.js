// script.js
document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('city-select');
    const yearSelect = document.getElementById('year-select');
    const prayerTableBody = document.querySelector('#prayer-times tbody');
    const errorMessage = document.getElementById('error-message');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const currentDateDisplay = document.getElementById('current-date');
    const currentTimeDisplay = document.getElementById('current-time');
    const defaultCity = 'pontianak';
    const currentYear = new Date().getFullYear();
    const yearsAvailable = [currentYear, currentYear -1, currentYear -2, currentYear -3, currentYear -4];

    // Display current date and time
    displayCurrentDate();
    displayCurrentTime();

    // Update time every second
    setInterval(displayCurrentTime, 1000);

    // Load dark mode preference
    const darkMode = getCookie('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
            setCookie('darkMode', 'enabled', 30);
        } else {
            document.body.classList.remove('dark-mode');
            setCookie('darkMode', 'disabled', 30);
        }
        updateSelectStyles();
    });

    // Function to update select box styles based on theme
    function updateSelectStyles() {
        if (document.body.classList.contains('dark-mode')) {
            citySelect.classList.add('dark-mode-select');
            yearSelect.classList.add('dark-mode-select');
        } else {
            citySelect.classList.remove('dark-mode-select');
            yearSelect.classList.remove('dark-mode-select');
        }
    }

    // Initialize select box styles
    updateSelectStyles();

    // Load cities from GitHub repository
    fetch('https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/kota.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load kota.json');
            }
            return response.json();
        })
        .then(cities => {
            const savedCity = localStorage.getItem('selectedCity') || defaultCity;
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = capitalizeFirstLetter(city);
                if(city.toLowerCase() === savedCity.toLowerCase()) {
                    option.selected = true;
                }
                citySelect.appendChild(option);
            });
            loadPrayerTimes(savedCity, currentYear);
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            console.error('Error loading cities:', error);
        });

    // Populate year select
    yearsAvailable.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if(year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    });

    // Event listeners for selection changes
    citySelect.addEventListener('change', () => {
        const selectedCity = citySelect.value;
        const selectedYear = parseInt(yearSelect.value);
        localStorage.setItem('selectedCity', selectedCity); // Save to localStorage
        loadPrayerTimes(selectedCity, selectedYear);
    });

    yearSelect.addEventListener('change', () => {
        const selectedCity = citySelect.value;
        const selectedYear = parseInt(yearSelect.value);
        loadPrayerTimes(selectedCity, selectedYear);
    });

    function loadPrayerTimes(city, year) {
        errorMessage.textContent = '';
        const now = new Date();
        const month = now.getMonth() + 1; // Current month
        const monthStr = month.toString().padStart(2, '0');
        const url = `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${city}/${year}/${monthStr}.json`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load prayer times from ${url}`);
                }
                return response.json();
            })
            .then(data => {
                prayerTableBody.innerHTML = '';
                data.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${entry.tanggal}</td>
                        <td>${entry.imsyak}</td>
                        <td>${entry.shubuh}</td>
                        <td>${entry.terbit}</td>
                        <td>${entry.dhuha}</td>
                        <td>${entry.dzuhur}</td>
                        <td>${entry.ashr}</td>
                        <td>${entry.magrib}</td>
                        <td>${entry.isya}</td>
                    `;
                    // Highlight today's row
                    if (isToday(entry.tanggal)) {
                        row.classList.add('highlight-today');
                    }
                    prayerTableBody.appendChild(row);
                });
            })
            .catch(error => {
                errorMessage.textContent = error.message;
                console.error('Error fetching prayer times:', error);
            });
    }

    // Display current date in a readable format
    function displayCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString(undefined, options);
        currentDateDisplay.textContent = `Today is ${formattedDate}`;
    }

    // Display current time in real-time
    function displayCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        currentTimeDisplay.textContent = `Current Time: ${hours}:${minutes}:${seconds}`;
    }

    // Check if the given date is today
    function isToday(dateString) {
        const today = new Date();
        const date = new Date(dateString);
        return today.getFullYear() === date.getFullYear() &&
               today.getMonth() === date.getMonth() &&
               today.getDate() === date.getDate();
    }

    // Cookie functions
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        const expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(cname) === 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    // Utility function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});