import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { EVENT_KNOWLEDGE_BASE, getQuickButtonsForIntent } from '@/lib/kb';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { message, sessionId, isSupportRequest, name, email, phone } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const db = await getDb();

    // 1. Handle Human Support Handoff
    if (isSupportRequest || message.toLowerCase().includes('human support') || message.toLowerCase().includes('talk to human')) {
      await db.query(
        `INSERT INTO support_tickets (name, email, phone, query, status) VALUES (?, ?, ?, ?, 'pending')`,
        [name || 'Guest User', email || 'not_provided@lateefulakbar.org', phone || '', message]
      );

      return NextResponse.json({
        reply: `Assalamu Alaikum! Your request has been handed off to our customer support team. An admin representative will review your message ("${message.slice(0, 60)}...") and get back to you shortly.`,
        isSupportHandoff: true,
        buttons: [
          { label: '🎟️ Return to Registration', action: 'link', target: '/register' },
          { label: '📿 Digital Tasbīh', action: 'link', target: '/tasbih' },
          { label: '🏠 Go to Home', action: 'link', target: '/' },
        ],
      });
    }

    // 2. Process query with Gemini API or Intelligent Knowledge Base Fallback
    let reply = '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are "Noor AI", the official intelligent assistant for Lateeful Akbar 2027. Answer politely, warmly, and accurately using the Knowledge Base below. Keep answers concise (2-4 sentences maximum). If the user asks for human customer support, inform them to click the "Talk to Support Agent" button.

Knowledge Base:
${EVENT_KNOWLEDGE_BASE}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemInstruction}\n\nUser Question: ${message}`,
        });

        reply = response.text || '';
      } catch (err) {
        console.error('Gemini API call failed, falling back to Knowledge Base matcher:', err);
      }
    }

    // Fallback if no API key or call failed
    if (!reply) {
      const q = message.toLowerCase();
      if (q.includes('when') || q.includes('date') || q.includes('time')) {
        reply = 'Lateeful Akbar 2027 will take place from December 24 to December 27, 2027.';
      } else if (q.includes('where') || q.includes('location') || q.includes('venue')) {
        reply = 'The gathering will be held at the prestigious National Mosque Auditorium, Central Business District, Abuja, Nigeria.';
      } else if (q.includes('theme') || q.includes('about')) {
        reply = 'The theme for Lateeful Akbar 2027 is "Walking in the Footsteps of Light", focusing on spiritual revitalization and unity.';
      } else if (q.includes('speaker') || q.includes('scholar')) {
        reply = 'Honored speakers include Sheikh Al-Fazi (Spiritual Wisdom), Dr. Amina Yusuf (Islamic Finance), and Ustadh Umar Farooq (Youth Leadership).';
      } else if (q.includes('ticket') || q.includes('register') || q.includes('cost') || q.includes('price')) {
        reply = 'Registration passes are available! You can choose between Standard Pass (Free), VIP Delegate Pass, or Virtual Streaming Access.';
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
