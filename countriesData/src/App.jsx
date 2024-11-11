import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const api_key = import.meta.env.VITE_SOME_KEY;

const api_url = 'https://api.openweathermap.org/data/2.5/weather?units=metric';

const CountryList = ({ filteredCountries, setSelectedCountry, selectedCountry }) => {
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    if (selectedCountry) {
      const capitalCity = selectedCountry.capital[0];

      // Fetch weather data for the selected country's capital
      axios
        .get(`${api_url}&q=${capitalCity}&appid=${api_key}`)
        .then((response) => {
          setWeatherInfo(response.data);
        })
        .catch((error) => {
          console.log('Error fetching weather data:', error);
        });
    }
  }, [selectedCountry]);

  const handleShowDetails = (country) => {
    setSelectedCountry(country); // Set the selected country to display its details
    setWeatherInfo(null); // Reset weather info to prevent displaying the previous country's weather
  };

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  // Show details if a country is selected
  if (selectedCountry) {
    const languages = Object.entries(selectedCountry.languages).map(([code, language]) => (
      <li key={code}>{language}</li>
    ));

    return (
      <div>
        <h2>{selectedCountry.name.common}</h2>
        <p>Capital: {selectedCountry.capital[0]}</p>
        <p>Area: {selectedCountry.area}</p>
        <h3>Languages:</h3>
        <ul>{languages}</ul>
        <img className="countryFlag" src={selectedCountry.flags.svg} alt={`Flag of ${selectedCountry.name.common}`} />

        {/* Conditionally render weather info */}
        {weatherInfo ? (
          <div>
            <h3>Weather in {selectedCountry.capital[0]}</h3>
            <p>
              Temperature: {weatherInfo.main.temp}°C

             
            </p>

            <p>
             {weatherInfo.weather && weatherInfo.weather[0] && (
               <img
                src={`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`}
                alt={weatherInfo.weather[0].description}
               />
              )}
            </p>
            <p>Wind Speed: {weatherInfo.wind.speed} m/s</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    );
  }

  return (
    <ul>
      {filteredCountries.map((country) => (
        <li key={country.cca2}>
          {country.name.common}{' '}
          <button onClick={() => handleShowDetails(country)}>Show Details</button>
        </li>
      ))}
    </ul>
  );
};

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const handleRequest = async () => {
      const url = 'https://studies.cs.helsinki.fi/restcountries/api/all';
      try {
        const response = await axios.get(url);
        console.log(response.data)
        setCountries(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleRequest();
  }, []);

  const filteredCountries = countries.filter((country) => {
    return (
      typeof country.name?.common === 'string' &&
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    // Reset selected country if the filter is changed
    setSelectedCountry(null);
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="searchDiv">
        <p>Find countries</p>
        <input value={searchTerm} onChange={handleChange} className="searchInput" type="text" />
      </div>

      {/* Country List with Show Details Button */}
      <CountryList
        filteredCountries={filteredCountries}
        setSelectedCountry={setSelectedCountry}
        selectedCountry={selectedCountry}
      />
    </>
  );
}

export default App;
