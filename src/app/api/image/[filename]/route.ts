import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = await params
    const { searchParams } = new URL(request.url)
    const size = searchParams.get('size') || 'original'
    
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 })
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const originalPath = join(uploadsDir, filename)

    if (!existsSync(originalPath)) {
      return new NextResponse('Image not found', { status: 404 })
    }

    // If requesting original size, serve directly
    if (size === 'original') {
      const fileBuffer = await readFile(originalPath)
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Parse size parameter (e.g., "150x150", "300x300")
    const [width, height] = size.split('x').map(Number)
    
    if (!width || !height || width > 500 || height > 500) {
      return new NextResponse('Invalid size', { status: 400 })
    }

    // Create cache directory for resized images
    const cacheDir = join(uploadsDir, 'cache')
    if (!existsSync(cacheDir)) {
      await import('fs/promises').then(fs => fs.mkdir(cacheDir, { recursive: true }))
    }

    const cacheFilename = `${size}_${filename}`
    const cachePath = join(cacheDir, cacheFilename)

    // Check if cached version exists
    if (existsSync(cachePath)) {
      const cachedBuffer = await readFile(cachePath)
      return new NextResponse(cachedBuffer, {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Resize and cache the image
    const originalBuffer = await readFile(originalPath)
    const resizedBuffer = await sharp(originalBuffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer()

    // Save to cache
    await import('fs/promises').then(fs => fs.writeFile(cachePath, resizedBuffer))

    return new NextResponse(resizedBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Image processing error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
