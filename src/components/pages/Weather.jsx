import { motion } from 'framer-motion'
import WeatherWidget from '@/components/organisms/WeatherWidget'

const Weather = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Weather Forecast</h1>
        <p className="text-gray-600 mt-1">
          Stay informed about weather conditions for better farm planning
        </p>
      </div>

      {/* Weather Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <WeatherWidget />
      </motion.div>
    </div>
  )
}

export default Weather