#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Configuration - Update these values
const BRANDING = {
  appName: 'Your App Name',
  shortName: 'YourApp',
  description: 'Your app description',
  themeColor: '#3b82f6', // Change to your brand color
  logoPath: '/your-logo.png' // Path to your logo file
}

console.log('🎨 Customizing app branding...')

// Update layout.tsx
const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx')
let layoutContent = fs.readFileSync(layoutPath, 'utf8')

layoutContent = layoutContent.replace(/title: 'Community Dash'/g, `title: '${BRANDING.appName}'`)
layoutContent = layoutContent.replace(/description: 'Connect with your community members'/g, `description: '${BRANDING.description}'`)
layoutContent = layoutContent.replace(/title: 'Community Dash'/g, `title: '${BRANDING.appName}'`)

fs.writeFileSync(layoutPath, layoutContent)
console.log('✅ Updated layout.tsx')

// Update Header.tsx
const headerPath = path.join(__dirname, '..', 'src', 'components', 'Header.tsx')
let headerContent = fs.readFileSync(headerPath, 'utf8')

headerContent = headerContent.replace(/Community Dash/g, BRANDING.appName)

fs.writeFileSync(headerPath, headerContent)
console.log('✅ Updated Header.tsx')

// Update manifest.json
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json')
let manifestContent = fs.readFileSync(manifestPath, 'utf8')

manifestContent = manifestContent.replace(/"name": "Community Dash"/g, `"name": "${BRANDING.appName}"`)
manifestContent = manifestContent.replace(/"short_name": "CommunityDash"/g, `"short_name": "${BRANDING.shortName}"`)
manifestContent = manifestContent.replace(/"description": "Connect with your community members"/g, `"description": "${BRANDING.description}"`)
manifestContent = manifestContent.replace(/"theme_color": "#3b82f6"/g, `"theme_color": "${BRANDING.themeColor}"`)

fs.writeFileSync(manifestPath, manifestContent)
console.log('✅ Updated manifest.json')

// Update .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  envContent = envContent.replace(/NEXT_PUBLIC_APP_NAME=".*"/g, `NEXT_PUBLIC_APP_NAME="${BRANDING.appName}"`)
  envContent = envContent.replace(/NEXT_PUBLIC_APP_DESCRIPTION=".*"/g, `NEXT_PUBLIC_APP_DESCRIPTION="${BRANDING.description}"`)
  
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Updated .env.local')
}

console.log('🎉 Branding customization complete!')
console.log('\n📝 Next steps:')
console.log('1. Add your logo file to public/your-logo.png')
console.log('2. Update the logo in src/components/Header.tsx')
console.log('3. Replace icons in public/icons/ with your own')
console.log('4. Restart your development server')
