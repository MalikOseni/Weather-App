// Get DOM elements for later use
const containerEl = document.getElementById('container');
const inputSectionEl = document.getElementById('inputsection');
const infotxtEl = document.getElementById('infotxt');
const inputFieldEl = document.getElementById('inputcity');
const btnEl = document.getElementById('btn');
const wIcons = document.getElementById('wicons')
const arrowEl =document.getElementById('arrow')

// Set up API key and URL
const apiKey = 'd280faa7ca496e7081d31f0c0ed99207';
let api;

// Function to format weather info details and update UI"
const weatherDetails = (info) => {
  infotxtEl.classList.replace('pending','error');
  if (info.cod === '404') {
    // Handle case where city is invalid
    infotxtEl.innerText = `${inputFieldEl.value} isn't a valid city`;
    clearTimeout(errorTime); // Prevent multiple timers from running at once
    errorTime = setTimeout(() => {
      infotxtEl.innerText = '';
      infotxtEl.classList.remove('pending','error');
      inputFieldEl.value = '';
    }, 2500); // Hide error message after set time, reset input field
  } else {
    // Update data for valid city
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id >= 801 && id<=804) { // Cloudy weather icon
        wIcons.src=`./assets/icons8-cloudy-100.png`
    } else if (id ==800) { // Sunny weather icon
        wIcons.src=`./assets/icons8-sunny-100.png`
    } else if (id >= 600 && id <= 622) { // Snowy weather icon
        wIcons.src=`./assets/icons8-snow-100.png`
    } else if (id >= 500 && id <= 531) { // Rainy weather icon
        wIcons.src=`./assets/icons8-rain-100.png`
    } else if (id == 721) { // Hazy weather icon
        wIcons.src='./assets/icons8-haze-100.png'
    } else if (id >= 200 && id <= 232) { // Stormy weather icon
        wIcons.src=`./assets/icons8-storm-100.png`
    }

    // Update elements with new data, remove pending class from info element, and show container
        // Select relevant elements and update their info based on response data
    const locationEl = document.getElementById('location');
    locationEl.innerText = `${city},${country}`;
    containerEl.querySelector('.temp .numb').innerText = Math.floor(temp);
    containerEl.querySelector('.weather').innerText = description;
    containerEl.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
    containerEl.querySelector('.humidity span').innerText = `${humidity}%`;
    infotxtEl.classList.remove('pending', 'error');
    containerEl.classList.add('active');
  }
}

// Function to fetch data from API using URL
const fetchData = async () => {
  infotxtEl.innerText = 'Getting weather details...';
  infotxtEl.classList.add('pending');
  const response = await fetch(api);
  const data = await response.json();
  weatherDetails(data);
}

// Function to set up URL based on inputted city and call fetchData()
const returnApi = (city) => {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${apiKey}`;
  fetchData();
}

// Function to get user's geolocation and call fetchData()
const updateData = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert('Device does not support geolocation api');
  }
}

// Function to set up URL based on geolocation coords and call fetchData()
const onSuccess = (position) => {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

// Function to handle errors in updating weather info
const onError = (error) => {
  infotxtEl.innerText = error.message;
  infotxtEl.classList.add('error');
}

// Listen for Enter key press on input field and call returnApi() with value
inputFieldEl.addEventListener('keyup', (event) => {
  if (event.key == "Enter" && inputFieldEl.value != '') {
    returnApi(inputFieldEl.value);
  }
});

// Listen for click of "Get Current Location" button and call updateData()
btnEl.addEventListener('click', updateData);

// Listen for click of "Back" arrow icon and remove active class from container element
arrowEl.addEventListener('click', () => {
  containerEl.classList.remove('active')
})
