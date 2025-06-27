import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/molecules/Card'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import { weatherService } from '@/services/api/weatherService'

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [currentWeather, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast()
      ])
      
      setWeather(currentWeather)
      setForecast(forecastData)
    } catch (err) {
      setError(err.message || 'Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: 'Sun',
      'partly-cloudy': 'CloudSun',
      cloudy: 'Cloud',
      rainy: 'CloudRain',
      thunderstorm: 'Zap'
    }
    return icons[condition] || 'Sun'
  }

  const getWeatherColor = (condition) => {
    const colors = {
      sunny: 'text-yellow-500',
      'partly-cloudy': 'text-blue-400',
      cloudy: 'text-gray-500',
      rainy: 'text-blue-600',
      thunderstorm: 'text-purple-600'
    }
    return colors[condition] || 'text-gray-500'
  }

  const formatCondition = (condition) => {
    return condition.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return <SkeletonLoader count={1} type="card" />
  }

  if (error) {
    return (
      <ErrorState
        title="Weather Unavailable"
        message="Unable to load weather data"
        onRetry={loadWeatherData}
        icon="CloudOff"
      />
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
        <button
          onClick={loadWeatherData}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-surface-100 transition-colors"
        >
          <ApperIcon name="RefreshCw" size={16} />
        </button>
      </div>

      {/* Current Weather */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-50 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Today</h4>
              <div className="flex items-center gap-3">
                <ApperIcon 
                  name={getWeatherIcon(weather.condition)} 
                  size={32} 
                  className={getWeatherColor(weather.condition)} 
                />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {weather.high}°
                  </div>
                  <div className="text-sm text-gray-600">
                    Low {weather.low}°
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 mb-2">
                {formatCondition(weather.condition)}
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Droplets" size={12} />
                  {weather.precipitation}%
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Wind" size={12} />
                  {weather.windSpeed} mph
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 5-Day Forecast */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">5-Day Forecast</h4>
        <div className="space-y-3">
          {forecast.slice(0, 5).map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 text-xs text-gray-600 font-medium">
                  {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  size={20} 
                  className={getWeatherColor(day.condition)} 
                />
                <span className="text-sm text-gray-600 min-w-0 flex-1">
                  {formatCondition(day.condition)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <ApperIcon name="Droplets" size={12} />
                  {day.precipitation}%
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">{day.high}°</span>
                  <span className="text-gray-500 ml-1">{day.low}°</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default WeatherWidget