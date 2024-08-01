"use client"
import React from 'react'
import { useState,useEffect } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { fetchWeather,fetchWeatherByCoords,fetchForecast } from '@/lib/api';
import { PinContainer } from './ui/3d-pin';
import { FlipWords } from './ui/flip-words';
const WeatherApp = () => {

  const words = ["Weather", "Погодаe", "Tempo", "天气"];

    const { toast } = useToast();
    const [city,setCity] = useState('');
    const [weather,setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCelsius, setIsCelsius] = useState(true);
    const [location, setLocation] = useState({ name: 'Loading...', coords: null });

    useEffect(()=>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
          (position)=>{
            fetchWeatherByCoords(position.coords.latitude,position.coords.longitude);
          },
          (error)=>{
            console.error("Error getting location:", error);
          }
        )
      }
    },[])

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
          const { latitude, longitude } = position.coords;
          console.log(latitude,longitude)
          // 23.1756 72.7477
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=23.1756&lon=72.7477`);
            const data = await response.json();
            setLocation({
              name: data.address.county || data.address.state_district || data.address.state|| 'Unknown location',
              coords: { latitude, longitude }
            });
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocation({ name: 'Unknown location', coords: { latitude, longitude } });
          }
        }, function(error) {
          console.error("Error getting location:", error);
          setLocation({ name: 'Location unavailable', coords: null });
        });
      } else {
        setLocation({ name: 'Geolocation not supported', coords: null });
      }
    }, []);
    
    const handleSearch = async()=>{
      if(!city) return;
          setLoading(true);
          try{
            const data = await fetchWeather(city);
            if(data.cod ==='404'){
              toast({
                title: "City not found",
                description: "Please check the city name and try again.",
                // action: <ToastAction altText="Try again">Try again</ToastAction>,
                variant: "destructive",
              });
            }else{
              setWeather(data);
              const forecastData = await fetchForecast(data.coord.lat, data.coord.lon);
              const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0).slice(1, 4);
              setForecast(dailyForecast);
            }
          }catch(error){
            toast({
              title: "Error",
              description: "An error occurred while fetching weather data.",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }

    }

    const convertTemp = (temp) => {
      return isCelsius ? temp : (temp * 9/5) + 32;
    };
  
  return (
    <div className='container mx-auto p-4'>
      {/* <h1 className='text-3xl font-bold mb-4'>WeatherApp</h1> */}
      {/* <div className="h-[40rem] flex justify-center items-center px-4"> */}
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 mb-4">
        Hi, I am your's
        <FlipWords words={words} /> <br />
        App
      {/* </div> */}
    </div>
      <div className='flex gap-2 mb-2'>
        <Input 
          type="text"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
          placeholder = "Enter your city"
          className="flex-grow"
        />
        <Button onClick={handleSearch} disabled={loading}>
            {loading?'Searching...':'Search'}
        </Button>
      </div>
      <div className='flex items-center gap-2 mb-4'> 
        <span>°C</span>
        <Switch checked={!isCelsius}
          onCheckedChange={()=>setIsCelsius(!isCelsius)}
        />
        <span>°F</span>
      </div>
      {weather && (
        <Card className="p-4 mb-4">
          <h2 className="text-2xl font-semibold">
          {weather.name}
          </h2>
          <div className="flex items-center">
            <img
               src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
               alt={weather.weather[0].description}
               className="w-16 h-16"
            />
            <p className="text-4xl ml-4">
                {Math.round(convertTemp(weather.main.temp))}°{isCelsius ? 'C' : 'F'}
            </p>
          </div>
          <p className="capitalize">{weather.weather[0].description}</p>
        </Card>
      )}
      {forecast && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">  
            {forecast.map((day,index)=>(
              <Card key={index} className="p-4">
                  <h3 className='font-semibold'>
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                  </h3>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    className="w-12 h-12"
                  />
                  <p>{Math.round(convertTemp(day.main.temp))}°{isCelsius ? 'C' : 'F'}</p>
                  <p className="capitalize text-sm">{day.weather[0].description}</p>
              </Card>
            ))}
        </div>
      )}
      <div className='mt-10'>

      <a>
      <h1 className='text-3xl font-bold mb-4 text-center'>Your current location</h1>
      <PinContainer
    title={`Weather in ${location.name}`}
    href={`https://www.google.com/search?q=weather+in+${encodeURIComponent(location.name)}`}
  >
    <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
      <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
        Current Weather
      </h3>
      <div className="text-base !m-0 !p-0 font-normal">
        <span className="text-slate-500 ">
          Check the weather conditions in {location.name}.
        </span>
      </div>
      <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
    </div>
  </PinContainer>
      </a>
    
  </div>
    </div> 

  )
}

export default WeatherApp