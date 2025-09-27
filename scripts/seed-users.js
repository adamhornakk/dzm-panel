const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const sampleUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "password123",
    profile: {
      bio: "Full-stack developer passionate about creating user-friendly applications. Love working with React, Node.js, and modern web technologies.",
      skills: "React, Node.js, TypeScript, PostgreSQL, AWS",
      location: "San Francisco, CA",
      website: "https://sarahjohnson.dev",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahcodes",
      github: "https://github.com/sarahjohnson",
      phone: "+1 (555) 123-4567",
      isPublic: true
    }
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    password: "password123",
    profile: {
      bio: "UX/UI Designer with 5+ years of experience creating beautiful and functional digital experiences. Specialized in mobile app design.",
      skills: "Figma, Adobe Creative Suite, User Research, Prototyping, Design Systems",
      location: "New York, NY",
      website: "https://michaelchen.design",
      linkedin: "https://linkedin.com/in/michaelchen",
      instagram: "https://instagram.com/michaeldesigns",
      phone: "+1 (555) 234-5678",
      isPublic: true
    }
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    password: "password123",
    profile: {
      bio: "Data Scientist and Machine Learning Engineer. I help companies make data-driven decisions and build intelligent systems.",
      skills: "Python, Machine Learning, TensorFlow, SQL, Data Visualization",
      location: "Austin, TX",
      website: "https://emilyrodriguez.ai",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      github: "https://github.com/emilyrodriguez",
      phone: "+1 (555) 345-6789",
      isPublic: true
    }
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    password: "password123",
    profile: {
      bio: "DevOps Engineer and Cloud Architect. I automate infrastructure and help teams deploy applications at scale.",
      skills: "Docker, Kubernetes, AWS, Terraform, CI/CD, Linux",
      location: "Seattle, WA",
      website: "https://davidkim.dev",
      linkedin: "https://linkedin.com/in/davidkim",
      github: "https://github.com/davidkim",
      phone: "+1 (555) 456-7890",
      isPublic: true
    }
  },
  {
    name: "Lisa Thompson",
    email: "lisa.thompson@example.com",
    password: "password123",
    profile: {
      bio: "Product Manager with a background in psychology. I bridge the gap between users and technology to create meaningful products.",
      skills: "Product Strategy, User Research, Agile, Analytics, Stakeholder Management",
      location: "Chicago, IL",
      website: "https://lisathompson.pm",
      linkedin: "https://linkedin.com/in/lisathompson",
      twitter: "https://twitter.com/lisaproducts",
      phone: "+1 (555) 567-8901",
      isPublic: true
    }
  },
  {
    name: "Alex Martinez",
    email: "alex.martinez@example.com",
    password: "password123",
    profile: {
      bio: "Mobile App Developer specializing in React Native and Flutter. I create cross-platform apps that users love.",
      skills: "React Native, Flutter, JavaScript, iOS, Android, Firebase",
      location: "Miami, FL",
      website: "https://alexmartinez.app",
      linkedin: "https://linkedin.com/in/alexmartinez",
      github: "https://github.com/alexmartinez",
      instagram: "https://instagram.com/alexmobile",
      phone: "+1 (555) 678-9012",
      isPublic: true
    }
  },
  {
    name: "Jessica Wang",
    email: "jessica.wang@example.com",
    password: "password123",
    profile: {
      bio: "Cybersecurity Specialist and Ethical Hacker. I help organizations protect their digital assets and train teams on security best practices.",
      skills: "Penetration Testing, Security Auditing, Network Security, Incident Response, Compliance",
      location: "Denver, CO",
      website: "https://jessicawang.security",
      linkedin: "https://linkedin.com/in/jessicawang",
      github: "https://github.com/jessicawang",
      phone: "+1 (555) 789-0123",
      isPublic: true
    }
  },
  {
    name: "Ryan O'Connor",
    email: "ryan.oconnor@example.com",
    password: "password123",
    profile: {
      bio: "Blockchain Developer and Smart Contract Auditor. I build decentralized applications and ensure smart contract security.",
      skills: "Solidity, Web3, Ethereum, Smart Contracts, DeFi, Rust",
      location: "Boston, MA",
      website: "https://ryanoconnor.eth",
      linkedin: "https://linkedin.com/in/ryanoconnor",
      github: "https://github.com/ryanoconnor",
      twitter: "https://twitter.com/ryanblockchain",
      phone: "+1 (555) 890-1234",
      isPublic: true
    }
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    password: "password123",
    profile: {
      bio: "Content Creator and Digital Marketing Specialist. I help brands tell their stories and connect with their audiences through compelling content.",
      skills: "Content Strategy, Social Media Marketing, SEO, Copywriting, Brand Management",
      location: "Los Angeles, CA",
      website: "https://mariagarcia.content",
      linkedin: "https://linkedin.com/in/mariagarcia",
      instagram: "https://instagram.com/mariacontent",
      twitter: "https://twitter.com/mariamarketing",
      phone: "+1 (555) 901-2345",
      isPublic: true
    }
  },
  {
    name: "James Wilson",
    email: "james.wilson@example.com",
    password: "password123",
    profile: {
      bio: "Game Developer and 3D Artist. I create immersive gaming experiences and bring virtual worlds to life.",
      skills: "Unity, Unreal Engine, C#, 3D Modeling, Animation, Game Design",
      location: "Portland, OR",
      website: "https://jameswilson.games",
      linkedin: "https://linkedin.com/in/jameswilson",
      github: "https://github.com/jameswilson",
      phone: "+1 (555) 012-3456",
      isPublic: true
    }
  },
  {
    name: "Amanda Foster",
    email: "amanda.foster@example.com",
    password: "password123",
    profile: {
      bio: "QA Engineer and Test Automation Specialist. I ensure software quality and help teams deliver bug-free applications.",
      skills: "Test Automation, Selenium, Cypress, API Testing, Performance Testing, Agile",
      location: "Phoenix, AZ",
      website: "https://amandafoster.qa",
      linkedin: "https://linkedin.com/in/amandafoster",
      github: "https://github.com/amandafoster",
      phone: "+1 (555) 123-4567",
      isPublic: true
    }
  },
  {
    name: "Kevin Lee",
    email: "kevin.lee@example.com",
    password: "password123",
    profile: {
      bio: "Technical Writer and Developer Advocate. I make complex technical concepts accessible and help developers succeed.",
      skills: "Technical Writing, Documentation, Developer Relations, API Documentation, Content Strategy",
      location: "San Diego, CA",
      website: "https://kevinlee.tech",
      linkedin: "https://linkedin.com/in/kevinlee",
      twitter: "https://twitter.com/kevinwrites",
      github: "https://github.com/kevinlee",
      phone: "+1 (555) 234-5678",
      isPublic: true
    }
  },
  {
    name: "Rachel Brown",
    email: "rachel.brown@example.com",
    password: "password123",
    profile: {
      bio: "Frontend Developer with a passion for creating beautiful, accessible web experiences. Love working with modern CSS and JavaScript frameworks.",
      skills: "Vue.js, CSS, JavaScript, Accessibility, Web Performance, Design Systems",
      location: "Nashville, TN",
      website: "https://rachelbrown.frontend",
      linkedin: "https://linkedin.com/in/rachelbrown",
      github: "https://github.com/rachelbrown",
      twitter: "https://twitter.com/rachelfrontend",
      phone: "+1 (555) 345-6789",
      isPublic: true
    }
  },
  {
    name: "Tom Anderson",
    email: "tom.anderson@example.com",
    password: "password123",
    profile: {
      bio: "Backend Developer and Database Administrator. I build scalable server-side applications and optimize database performance.",
      skills: "Java, Spring Boot, PostgreSQL, Redis, Microservices, System Design",
      location: "Minneapolis, MN",
      website: "https://tomanderson.backend",
      linkedin: "https://linkedin.com/in/tomanderson",
      github: "https://github.com/tomanderson",
      phone: "+1 (555) 456-7890",
      isPublic: true
    }
  },
  {
    name: "Sophie Taylor",
    email: "sophie.taylor@example.com",
    password: "password123",
    profile: {
      bio: "AI/ML Engineer and Research Scientist. I develop cutting-edge machine learning models and contribute to open-source AI projects.",
      skills: "PyTorch, Computer Vision, Natural Language Processing, Research, Open Source",
      location: "Cambridge, MA",
      website: "https://sophietaylor.ai",
      linkedin: "https://linkedin.com/in/sophietaylor",
      github: "https://github.com/sophietaylor",
      twitter: "https://twitter.com/sophieai",
      phone: "+1 (555) 567-8901",
      isPublic: true
    }
  }
]

async function seedUsers() {
  try {
    console.log('🌱 Starting to seed users...')
    
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })
      
      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`)
        continue
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        }
      })
      
      // Create profile
      await prisma.profile.create({
        data: {
          userId: user.id,
          ...userData.profile
        }
      })
      
      console.log(`✅ Created user: ${userData.name} (${userData.email})`)
    }
    
    console.log('🎉 Successfully seeded all users!')
    
    // Show summary
    const totalUsers = await prisma.user.count()
    const publicProfiles = await prisma.profile.count({
      where: { isPublic: true }
    })
    
    console.log(`\n📊 Summary:`)
    console.log(`- Total users: ${totalUsers}`)
    console.log(`- Public profiles: ${publicProfiles}`)
    
  } catch (error) {
    console.error('❌ Error seeding users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedUsers()
