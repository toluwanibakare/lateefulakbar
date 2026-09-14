import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { EVENT_KNOWLEDGE_BASE, getQuickButtonsForIntent } from '@/lib/kb';
import { checkRateLimit, sanitizeString, isValidEmail } from '@/lib/security';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check (15 requests/min per IP)
    const ip = req.headers.get('x-forwarded-for') || 'ip_unknown';
    const rateCheck = checkRateLimit(`chat_${ip}`, 15, 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many chat messages. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawMessage = body.message;

    if (!rawMessage || typeof rawMessage !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const message = sanitizeString(rawMessage, 500);
    const name = sanitizeString(body.name, 100);
    const email = body.email && isValidEmail(body.email) ? body.email.trim() : 'not_provided@lateefulakbar.org';
    const phone = sanitizeString(body.phone, 30);
    const sessionId = sanitizeString(body.sessionId, 100) || 'anon';
    const isSupportRequest = Boolean(body.isSupportRequest);

    const db = await getDb();

    // 1. Handle Human Customer Support Handoff
    if (isSupportRequest || message.toLowerCase().includes('human support') || message.toLowerCase().includes('talk to human')) {
      await db.query(
        `INSERT INTO support_tickets (name, email, phone, query, status) VALUES (?, ?, ?, ?, 'pending')`,
        [name || 'Guest User', email, phone, message]
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
                content: `You are "SmartLateef", the official intelligent AI assistant for Lateeful Akbar 2027 by Nadwat Global Assembly. Answer politely, warmly, and with 100% accuracy based strictly on the Knowledge Base below. Keep answers concise (2-4 sentences max).

CRITICAL ACCURACY RULES:
- DRESS CODE: Strictly ALL WHITE.
- VENUE: Tafawa Balewa Square (Main Bowl) Race Course, Lagos Island, Lagos, Nigeria.
- DATE: Sunday, 24th January 2027 (Gates open at 08:00 WAT).
- PARKING: Vehicle parking is STRICTLY PROHIBITED inside the Main Bowl. Vehicles must be parked in designated parking areas outside.
- FOUNDER: Shaikh Dr. Abdur Rahman Ade Lawal Ph.D Mnipr (Chief Missioner of Nadwat).
- CONTACT: Lateefulakbar@gmail.com | +234 704 700 0765 | Nadwat Mosque, Lagos.

Knowledge Base:
${EVENT_KNOWLEDGE_BASE}`,
              },
              {
                role: 'user',
                content: message,
              },
            ],
            temperature: 0.5,
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
      if (q.includes('dress') || q.includes('wear') || q.includes('cloth') || q.includes('attire') || q.includes('outfit')) {
        reply = 'The dress code for Lateeful Akbar 2027 is STRICTLY ALL WHITE. All attendees are expected to dress modestly and appropriately in white.';
      } else if (q.includes('when') || q.includes('date') || q.includes('time') || q.includes('how long') || q.includes('day')) {
        reply = 'Lateeful Akbar 2027 is a 1-day grand spiritual gathering taking place on Sunday, January 24, 2027 (gates open at 08:00 WAT).';
      } else if (q.includes('where') || q.includes('location') || q.includes('venue') || q.includes('address') || q.includes('tbs') || q.includes('lagos')) {
        reply = 'The gathering will be held at Tafawa Balewa Square (Main Bowl) Race Course, Lagos Island, Lagos, Nigeria.';
      } else if (q.includes('parking') || q.includes('car') || q.includes('drive') || q.includes('vehicle')) {
        reply = 'Vehicle parking is STRICTLY PROHIBITED within the Main Bowl. All vehicles must be parked in designated official parking zones outside the main bowl.';
      } else if (q.includes('founder') || q.includes('missioner') || q.includes('sheikh') || q.includes('ade lawal') || q.includes('lawal')) {
        reply = 'The founder and Chief Missioner of NADWAT is Shaikh Dr. Abdur Rahman Ade Lawal Ph.D Mnipr — an Al-Azhar graduate, IVLP alumnus, media consultant, author, and marriage counselor.';
      } else if (q.includes('theme') || q.includes('about') || q.includes('lateef') || q.includes('meaning')) {
        reply = 'Lateeful Akbar is Nadwat’s annual spiritual gathering focused on Dhikr, Duʿā, and seeking Allah through His beautiful name Al-Lateef (The Most Subtle, The Most Gentle).';
      } else if (q.includes('ticket') || q.includes('register') || q.includes('cost') || q.includes('price') || q.includes('pass')) {
        reply = 'Registration passes are free! You can register for a Guest Pass, Vendor Stall Space, or Media & Blogger Accreditation on our website.';
      } else if (q.includes('vendor') || q.includes('stall') || q.includes('food') || q.includes('booth') || q.includes('sell')) {
        reply = 'Vendors can register for approved Halal food stalls, clothing/adire, Islamic books, or services via the Vendor Registration Portal on the website.';
      } else if (q.includes('media') || q.includes('press') || q.includes('accreditation') || q.includes('journalist') || q.includes('camera')) {
        reply = 'Media personnel, bloggers, photographers, and broadcast journalists can apply for official Media Accreditation via our Media Portal.';
      } else if (q.includes('donate') || q.includes('sadaqah') || q.includes('give') || q.includes('water') || q.includes('mat') || q.includes('fan')) {
        reply = 'You can support the gathering by contributing to Prayer Mats (1,000 pcs), Water (2,000 packs), Cooling Fans (700 pcs), Tents, Internet, or Media Broadcast facilities.';
      } else if (q.includes('prayer book') || q.includes('book') || q.includes('asalatu') || q.includes('dua')) {
        reply = 'The official 208-page Asalatu Nadwat Prayer Book is available to read directly inside our website on the Prayer Book page.';
      } else {
        reply = 'Assalamu Alaikum! I am SmartLateef, your official AI guide for Lateeful Akbar 2027. How may I assist you with event details, dress code (strictly white), venue in TBS Lagos, schedule, registration, or donations?';
      }
    }

    // Get relevant quick action navigation buttons
    const buttons = getQuickButtonsForIntent(message);

    // Save chat log to MySQL
    await db.query(
      `INSERT INTO chat_logs (session_id, user_message, bot_reply) VALUES (?, ?, ?)`,
      [sessionId, message, reply]
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
