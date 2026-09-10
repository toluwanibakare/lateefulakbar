import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { EVENT_KNOWLEDGE_BASE, getQuickButtonsForIntent } from '@/lib/kb';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    const { message, sessionId, isSupportRequest, name, email, phone } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const db = await getDb();

    // 1. Handle Human Customer Support Handoff
    if (isSupportRequest || message.toLowerCase().includes('human support') || message.toLowerCase().includes('talk to human')) {
      await db.query(
        `INSERT INTO support_tickets (name, email, phone, query, status) VALUES (?, ?, ?, ?, 'pending')`,
        [name || 'Guest User', email || 'not_provided@lateefulakbar.org', phone || '', message]
      );

      return NextResponse.json({
        reply: `Assalamu Alaikum! Your request has been handed off to our customer support team. An admin representative will review your message ("${message.slice(0, 60)}...") and contact you shortly.`,
        isSupportHandoff: true,
        buttons: [
          { label: '🎟️ Return to Registration', action: 'link', target: '/register' },
          { label: '📿 Digital Tasbīh', action: 'link', target: '/tasbih' },
          { label: '🏠 Go to Home', action: 'link', target: '/' },
        ],
      });
    }

    // 2. Query Groq AI API
    let reply = '';

    if (GROQ_API_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-20b',
            messages: [
              {
                role: 'system',
                content: `You are "Noor AI", the official intelligent assistant for Lateeful Akbar 2027. Answer politely, warmly, and accurately using the Knowledge Base below. Keep answers concise (2-4 sentences maximum). If the user asks for human customer support, inform them to click the "Talk to Support Agent" button.

Knowledge Base:
${EVENT_KNOWLEDGE_BASE}`,
              },
              {
                role: 'user',
                content: message,
              },
            ],
            temperature: 0.6,
            max_tokens: 300,
          }),
        });

        const groqData = await groqRes.json();
        if (groqData?.choices?.[0]?.message?.content) {
          reply = groqData.choices[0].message.content.trim();
        }
      } catch (err) {
        console.error('Groq AI API call error, using Knowledge Base fallback:', err);
      }
    }

    // Fallback matcher if Groq API call is unreachable or unconfigured
    if (!reply) {
      const q = message.toLowerCase();
      if (q.includes('when') || q.includes('date') || q.includes('time') || q.includes('how long') || q.includes('day')) {
        reply = 'Lateeful Akbar 2027 is a 1-day grand spiritual gathering taking place on Sunday, January 24, 2027 (gates open at 08:00 WAT).';
      } else if (q.includes('where') || q.includes('location') || q.includes('venue')) {
        reply = 'The gathering will be held at the prestigious National Mosque Auditorium, Central Business District, Abuja, Nigeria.';
      } else if (q.includes('theme') || q.includes('about')) {
        reply = 'The theme for Lateeful Akbar 2027 is "Walking in the Footsteps of Light", focusing on spiritual revitalization and unity.';
      } else if (q.includes('speaker') || q.includes('scholar')) {
        reply = 'Honored speakers include Sheikh Al-Fazi (Spiritual Wisdom), Dr. Amina Yusuf (Islamic Finance), and Ustadh Umar Farooq (Youth Leadership).';
      } else if (q.includes('ticket') || q.includes('register') || q.includes('cost') || q.includes('price')) {
        reply = 'Registration passes are free! You can choose between Standard Pass, VIP Delegate Pass, or Virtual Streaming Access.';
      } else if (q.includes('donate') || q.includes('sadaqah')) {
        reply = 'You can support the gathering by contributing to water supply, prayer mats, cooling fans, tents, or media broadcast setup.';
      } else {
        reply = 'Assalamu Alaikum! I am Noor AI, your guide for Lateeful Akbar 2027. How may I assist you with event registration, schedule, or donations?';
      }
    }

    // Get relevant quick action navigation buttons
    const buttons = getQuickButtonsForIntent(message);

    // Save chat log to MySQL
    await db.query(
      `INSERT INTO chat_logs (session_id, user_message, bot_reply) VALUES (?, ?, ?)`,
      [sessionId || 'anon', message, reply]
    );

    return NextResponse.json({
      reply,
      buttons,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
