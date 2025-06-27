import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { validateImageFile, convertToBase64 } from '@/services/utils'

const PhotoUpload = ({ photos = [], onChange, maxFiles = 5, label = "Photos" }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = async (files) => {
    if (files.length === 0) return
    
    const currentCount = photos.length
    const remainingSlots = maxFiles - currentCount
    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    
    if (filesToProcess.length === 0) {
      return
    }

    setUploading(true)
    
    try {
      const newPhotos = []
      
      for (const file of filesToProcess) {
        const validation = validateImageFile(file)
        if (!validation.valid) {
          console.warn(`Skipping file ${file.name}: ${validation.error}`)
          continue
        }

        const base64 = await convertToBase64(file)
        newPhotos.push({
          id: Date.now() + Math.random(),
          filename: file.name,
          size: file.size,
          type: file.type,
          data: base64,
          uploadedAt: new Date().toISOString()
        })
      }

      if (newPhotos.length > 0) {
        onChange([...photos, ...newPhotos])
      }
    } catch (error) {
      console.error('Error processing files:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    handleFiles(files)
    e.target.value = ''
  }

  const removePhoto = (photoId) => {
    onChange(photos.filter(photo => photo.id !== photoId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} {photos.length > 0 && `(${photos.length}/${maxFiles})`}
      </label>
      
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-surface-300 hover:border-surface-400'}
          ${photos.length >= maxFiles ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => photos.length < maxFiles && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={photos.length >= maxFiles}
        />
        
        <div className="space-y-2">
          <ApperIcon 
            name={uploading ? "Loader2" : "Camera"} 
            size={32} 
            className={`mx-auto text-gray-400 ${uploading ? 'animate-spin' : ''}`} 
          />
          <div>
            <p className="text-sm text-gray-600">
              {uploading ? 'Processing photos...' : 'Drop photos here or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG up to 5MB each • {maxFiles - photos.length} remaining
            </p>
          </div>
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group bg-surface-50 rounded-lg overflow-hidden border border-surface-200"
            >
              <div className="aspect-square">
                <img
                  src={photo.data}
                  alt={photo.filename}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removePhoto(photo.id)
                  }}
                  className="absolute top-1 right-1 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/90"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </div>
              
              {/* Info */}
              <div className="p-2 bg-white">
                <p className="text-xs text-gray-600 truncate" title={photo.filename}>
                  {photo.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(photo.size)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PhotoUpload