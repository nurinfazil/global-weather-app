import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

const api_key = process.env.REACT_APP_API_KEY


const WeatherData = ({ weatherData }) => {
  if (weatherData.length === 0) {
    return null
  }
  else {
    return (
      <div>
        <div>Temperature: {weatherData.current.temperature} celsius</div>
        <img style={{ height: '110px' }} src={weatherData.current.weather_icons[0]} alt="weather"></img>
        <div>Wind: {weatherData.current.wind_speed} mph direction {weatherData.current.wind_dir}</div>
      </div>
    )
  }
}


const CountryResult = ({ country }) => {
  console.log('in CountryResult comp')

  const [weatherData, setWeatherData] = useState([])

  let apiCall = 'http://api.weatherstack.com/current?access_key=' + api_key + '&query=' + country.name

  useEffect(() => {
    // console.log('effect')
    axios
      .get(apiCall)
      .then(response => {
        // console.log('promise fulfilled')
        setWeatherData(response.data)
      })
  }, [])

  return (
    <div>
      <h1>{country.name}</h1>
      <div>Capital: {country.capital}</div>
      <div>Population: {country.population}</div>
      <h3>Languages</h3>
      <ul>
        {(country.languages).map(language => {
          return (
            <li>
              {language.name}
            </li>
          )
        })}
      </ul>
      <img style={{ height: '110px' }} src={country.flag} alt="flag"></img>
      <h3>Weather Data for {country.name}</h3>
      <WeatherData weatherData={weatherData} />

    </div>
  )
}


const SearchResult = ({ results }) => {

  console.log('in SearchResult comp')
  const [countryToShow, setCountryToShow] = useState([])
  const [countryFound, setCountryFound] = useState([])

  if (results.length >= 10) {
    if (countryToShow.length != 0) {
      setCountryToShow([])
    }

    if (countryFound.length != 0) {
      setCountryFound([])
    }

    return (
      <div>
        {results.length} results. Specify another filter
      </div>
    )
  }

  else if (results.length === 1) {
    if (countryToShow.length != 0) {
      setCountryToShow([])
    }

    if (countryFound.length == 0) {
      setCountryFound(results[0])
    }

    console.log(countryFound)

    return (
      <div>
        <CountryResult country={countryFound} />
      </div>
    )
  }

  else if (results.length < 10 & results.length > 0) {

    if (countryFound.length != 0) {
      setCountryFound([])
    }

    return (
      <div>
        {
          results.map((country, i) => {
            return (
              <div key={i}>
                {country.name}
                <button onClick={() => { setCountryToShow(country) }}>show</button>
              </div>
            )
          })
        }
        <br></br>
        {countryToShow.length == 0 ?
          null :
          (<CountryResult country={countryToShow} />)
        }
      </div>
    )
  }

  else {
    return (
      <div>
        Search a country.
      </div>
    )
  }
}

function App() {
  console.log('in App comp')
  const [currentCountry, setCurrentCountry] = useState('')
  const [countriesData, setcountriesData] = useState([])

  const [result, setResult] = useState([])


  useEffect(() => {
    // console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        // console.log('promise fulfilled')
        setcountriesData(response.data)
        // console.log(countriesData)
      })
  }, [])

  const handleInputChange = (event) => {
    setCurrentCountry(event.target.value)
    setResult([])

    if (event.target.value == '') {
      return;
    }

    countriesData.forEach(country => {
      if (((country.name).toLowerCase()).includes((event.target.value).toLowerCase())) {
        setResult(result => [...result, country])
      }
    })
  }

  return (
    <div>

      <form>
        find countries
        <input
          value={currentCountry}
          onChange={handleInputChange}>
        </input>
      </form>

      <SearchResult results={result} />
    </div>
  );
}

export default App;
