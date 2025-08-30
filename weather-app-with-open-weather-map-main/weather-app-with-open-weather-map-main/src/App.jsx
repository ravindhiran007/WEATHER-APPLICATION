import React, { useEffect, useState } from 'react'
import SearchSection from './components/SearchSection'
import WeatherBox from './components/WeatherBox'
import { WeatherIcons } from './assets/assets'
import BottomData from './components/BottomData'

const App = () => {

  const [city, setCity] = useState("Riyadh")
  const [weatherData, setWeatherData] = useState({})
  const [error, setError] = useState({})

  const allIcons = {
    "01d" : WeatherIcons.ClearDayIcon,
    "01n" : WeatherIcons.ClearNightIcon,
    "02d" : WeatherIcons.FewCloudsDayIcon,
    "02n" : WeatherIcons.FewCloudsNightIcon,
    "03d" : WeatherIcons.ScatteredCloudsIcon,
    "03n" : WeatherIcons.ScatteredCloudsIcon,
    "04d" : WeatherIcons.BrokenCloudsIcon,
    "04n" : WeatherIcons.BrokenCloudsIcon,
    "09d" : WeatherIcons.ShowerRainIcon,
    "09n" : WeatherIcons.ShowerRainIcon,
    "10d" : WeatherIcons.RainDayIcon,
    "10n" : WeatherIcons.RainNightIcon,
    "11d" : WeatherIcons.ThunderstormIcon,
    "11n" : WeatherIcons.ThunderstormIcon,
    "13d" : WeatherIcons.SnowIcon,
    "13n" : WeatherIcons.SnowIcon,
    "50d" : WeatherIcons.MistIcon,
    "50n" : WeatherIcons.MistIcon
  }

  // Weather API Functions
  const API_KEY = import.meta.env.VITE_API_KEY

  const searchWeatherData = () => {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${city}&units=metric`
    getWeatherData(API_URL)
  }

  const fetchWeatherData = () => {
    navigator.geolocation.getCurrentPosition(
      (positon) => {
        const { latitude, longitude } = positon.coords
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&lat=${latitude}&lon=${longitude}&units=metric`
        getWeatherData(API_URL)
      }, () => {
        setWeatherData(false)
        setError({
          msg: "Failed to fetch user geo location"
        })
      }
    )
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const getWeatherData = async (API_URL) => {
    try {
      const response  = await fetch(API_URL)
      const data = await response.json()
      const icons = allIcons[data.weather[0].icon] || WeatherIcons.NoResultIcon
      setWeatherData({
        city: data.name,
        icon: icons,
        temprature: Math.floor(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      })
    } catch (error) {
      setWeatherData(false)
      setError({
        msg: "Failed To Fetch Weather Data"
      })
    }
  }

  return (
    <div className='mx-auto max-w-[310px] sm:max-w-sm bg-[#242526] py-5 px-4 rounded-xl'>
      <SearchSection value={city} onChange={(e)=>setCity(e.target.value)} onClickSearch={searchWeatherData} onClickFetch={fetchWeatherData} />
      {
        weatherData ? 
        <>
        <WeatherBox cityName={weatherData.city} imageName={weatherData.icon} temprature={weatherData.temprature} description={weatherData.description} />
        <BottomData humidity={weatherData.humidity} windSpeed={weatherData.windSpeed} />
        </> :
        <>
        <img src={WeatherIcons.NoResultIcon} alt="" className='h-36 mx-auto' />
        <p className='text-lg sm:text-xl text-center'>{error.msg}</p>
        </>
      }
    </div>
  )
}

export default App