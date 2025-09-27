/**
 * Generate optimized image URL with size parameter
 */
export function getOptimizedImageUrl(imageUrl: string, size: 'small' | 'medium' | 'large' | 'original' = 'medium'): string {
  if (!imageUrl) return ''
  
  // If it's not an uploaded image, return as is
  if (!imageUrl.startsWith('/uploads/')) {
    return imageUrl
  }

  const sizeMap = {
    small: '48x48',
    medium: '150x150', 
    large: '300x300',
    original: 'original'
  }

  const sizeParam = sizeMap[size]
  const filename = imageUrl.replace('/uploads/', '')
  
  return `/api/image/${filename}?size=${sizeParam}`
}

/**
 * Get profile image with fallback
 */
export function getProfileImage(user: any, size: 'small' | 'medium' | 'large' | 'original' = 'medium'): string {
  // Priority: profileImage -> user.image -> fallback to initials
  if (user.profile?.profileImage) {
    return getOptimizedImageUrl(user.profile.profileImage, size)
  }
  
  if (user.image) {
    return getOptimizedImageUrl(user.image, size)
  }
  
  return '' // Will show initials
}
