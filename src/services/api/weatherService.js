import { delay } from '@/services/utils'

// Mock weather data service
const generateWeatherData = () => {
  const conditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy', 'thunderstorm']
  const baseTemp = 72
  
  return Array.from({ length: 5 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    high: baseTemp + Math.floor(Math.random() * 20) - 10,
    low: baseTemp - 10 + Math.floor(Math.random() * 15),
    precipitation: Math.floor(Math.random() * 100),
    humidity: 45 + Math.floor(Math.random() * 35),
    windSpeed: Math.floor(Math.random() * 25) + 5
  }))
}

export const weatherService = {
  async getForecast() {
    await delay(500)
    return generateWeatherData()
  },

  async getCurrentWeather() {
    await delay(300)
    const forecast = generateWeatherData()
    return forecast[0]
  }
}