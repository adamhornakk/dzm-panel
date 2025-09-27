# Community Dash

A modern Progressive Web App (PWA) for community management with user profiles, directory, and admin panel. Built with Next.js 14, TypeScript, Tailwind CSS, and MySQL.

## Features

- 🔐 **User Authentication** - Secure login/signup with NextAuth.js
- 👥 **Community Directory** - Browse and search community members
- 📱 **Progressive Web App** - Install on mobile devices like a native app
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 👤 **User Profiles** - Rich profiles with social media links and skills
- ⚙️ **Admin Panel** - User management and community administration
- 🗄️ **MySQL Database** - Robust data storage with Prisma ORM
- 📱 **Mobile-First** - Optimized for mobile devices with PWA features

## PWA Features

- **Install on Home Screen** - Users can install the app on their phone
- **Full Screen Experience** - Opens without browser UI on mobile
- **Offline Support** - Basic functionality works without internet
- **Fast Loading** - Cached resources for instant access
- **Push Notifications** - Ready for community updates (future feature)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Authentication**: NextAuth.js
- **PWA**: next-pwa
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database (update with your server details)
   DATABASE_URL="mysql://username:password@your-server-host:3306/community_dash"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME="Community Dash"
   NEXT_PUBLIC_APP_DESCRIPTION="Connect with your community members"
   ```

4. **Set up MySQL database**
   
   **Option A: Local MySQL**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE community_dash;
   ```
   
   **Option B: Remote MySQL Server**
   - Use DataGrip or your preferred MySQL client
   - Create database: `CREATE DATABASE community_dash;`
   - Note your server host, username, and password

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Users

1. **Sign Up** - Create a new account
2. **Complete Profile** - Add your bio, skills, social media links
3. **Browse Community** - View other members in the directory
4. **Install PWA** - Add to home screen on mobile devices

### For Admins

1. **Admin Access** - Users with ADMIN role can access admin panel
2. **User Management** - View and manage community members
3. **Community Settings** - Configure community-wide settings

### PWA Installation

**On Android:**
1. Open the website in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Confirm installation

**On iOS:**
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

## Project Structure

```
dash/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── profile/        # User profile pages
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript type definitions
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   ├── icons/             # PWA icons
│   └── manifest.json      # PWA manifest
└── scripts/               # Utility scripts
```

## Database Schema

The app uses the following main models:

- **User** - User accounts and authentication
- **Profile** - Extended user profile information
- **Account** - OAuth account connections
- **Session** - User sessions

## API Endpoints

- `POST /api/auth/register` - User registration
- `GET /api/users` - Get all users
- `PUT /api/profile` - Update user profile
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

## Deployment

### Environment Setup

1. **Production Database** - Set up MySQL on your server
2. **Environment Variables** - Configure production values
3. **Build** - Run `npm run build`
4. **Start** - Run `npm start`

### PWA Deployment

- Ensure HTTPS is enabled (required for PWA)
- Update `NEXTAUTH_URL` to your production domain
- Test PWA installation on mobile devices

## Customization

### Branding

1. **App Name** - Update `NEXT_PUBLIC_APP_NAME` in environment
2. **Colors** - Modify Tailwind colors in `tailwind.config.js`
3. **Icons** - Replace icons in `public/icons/` directory
4. **Logo** - Update the logo in the header component

### Features

- **Chat System** - Add real-time chat functionality
- **Events** - Add community events calendar
- **Groups** - Add user groups and categories
- **Notifications** - Implement push notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## Roadmap

- [ ] Real-time chat system
- [ ] Community events
- [ ] User groups and categories
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Integration with external services

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.