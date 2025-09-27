import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Jméno a email jsou povinné' },
        { status: 400 }
      )
    }

    // Check if email already exists in users or requests
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    const existingRequest = await prisma.userRequest.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Uživatel s tímto emailem již existuje' },
        { status: 400 }
      )
    }

    if (existingRequest) {
      return NextResponse.json(
        { message: 'Žádost s tímto emailem již byla odeslána' },
        { status: 400 }
      )
    }

    // Create new request
    const userRequest = await prisma.userRequest.create({
      data: {
        name,
        email,
        message: message || null,
        status: 'PENDING'
      }
    })

    // Send Discord notification
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL is not set. Skipping Discord notification.');
    } else {
      try {
        const embed = {
          title: 'New User Request',
          description: `A new user request has been submitted:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message || 'No message provided'}`,
          color: 5814783, // Discord embed color (optional)
        };

        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ embeds: [embed] }),
        });
      } catch (discordError) {
        console.error('Failed to send Discord notification:', discordError);
      }
    }

    return NextResponse.json({
      message: 'Žádost byla úspěšně odeslána',
      request: userRequest
    })

  } catch (error) {
    console.error('Request creation error:', error)
    return NextResponse.json(
      { message: 'Něco se pokazilo. Zkuste to prosím znovu.' },
      { status: 500 }
    )
  }
}
