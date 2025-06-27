import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const shimmerVariants = {
    loading: {
      x: [-1000, 1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 2,
          ease: 'linear'
        }
      }
    }
  }

  const CardSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 p-6 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        variants={shimmerVariants}
        animate="loading"
      />
      <div className="space-y-3">
        <div className="h-4 bg-surface-200 rounded w-3/4"></div>
        <div className="h-4 bg-surface-200 rounded w-1/2"></div>
        <div className="h-4 bg-surface-200 rounded w-2/3"></div>
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 p-4 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        variants={shimmerVariants}
        animate="loading"
      />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-surface-200 rounded w-1/2"></div>
          <div className="h-3 bg-surface-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )

  const TableSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        variants={shimmerVariants}
        animate="loading"
      />
      <div className="p-4 space-y-3">
        <div className="flex gap-4">
          <div className="h-4 bg-surface-200 rounded flex-1"></div>
          <div className="h-4 bg-surface-200 rounded flex-1"></div>
          <div className="h-4 bg-surface-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  )

  const skeletonTypes = {
    card: CardSkeleton,
    list: ListSkeleton,
    table: TableSkeleton
  }

  const SkeletonComponent = skeletonTypes[type] || CardSkeleton

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <SkeletonComponent />
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader