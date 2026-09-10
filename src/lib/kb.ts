export interface QuickButton {
  label: string;
  action: 'link' | 'support' | 'query';
  target: string;
}

export interface BotResponse {
  reply: string;
  buttons?: QuickButton[];
  isSupportHandoff?: boolean;
}

export const EVENT_KNOWLEDGE_BASE = `
Lateeful Akbar 2027 Knowledge Base:
- Theme: "Walking in the Footsteps of Light"
- Dates: December 24 - 27, 2027 (4 Days Event)
- Location / Venue: National Mosque Auditorium, Central Business District, Abuja, Nigeria.
- Keynote Speakers & Scholars: Sheikh Al-Fazi (Spiritual Wisdom & Sufi Thought), Dr. Amina Yusuf (Islamic Finance & Ethical Leadership), Ustadh Umar Farooq (Youth Empowerment & Contemporary Faith).
- Features on Website:
  1. Event Registration: Reserve seats for Main Hall, VIP Delegate Pass, or Online Live Stream Access.
  2. Digital Tasbīh Counter: Participate in global dhikr counter (Subhanallah, Alhamdulillah, Allahu Akbar, Astaghfirullah, Salawat).
  3. Donations & Sadaqah Jariyah: Support event facilities (Prayer Mats N5,000, Water Supply N2,000, Cooling Systems N15,000, Media Broadcast N25,000, Tents N50,000, Broadcast Internet N10,000).
  4. Program Schedule: Morning Dhikr, Keynote Lectures, Youth Symposium, Sister's Forum, Grand Mawlid & Closing Dua.
  5. Blog & Media: Articles on spiritual growth, event updates, video highlights.
  6. Customer Support: Option to connect directly with human support representatives.
`;

export function getQuickButtonsForIntent(query: string): QuickButton[] {
  const q = query.toLowerCase();

  const buttons: QuickButton[] = [];

  if (q.includes('register') || q.includes('ticket') || q.includes('pass') || q.includes('seat') || q.includes('attend')) {
    buttons.push({ label: '🎟️ Register Now', action: 'link', target: '/register' });
  }

  if (q.includes('donate') || q.includes('sadaqah') || q.includes('support') || q.includes('give') || q.includes('money')) {
    buttons.push({ label: '💚 Donate & Sadaqah', action: 'link', target: '/donate' });
  }

  if (q.includes('tasbih') || q.includes('dhikr') || q.includes('count') || q.includes('prayer')) {
    buttons.push({ label: '📿 Digital Tasbīh', action: 'link', target: '/tasbih' });
  }

  if (q.includes('schedule') || q.includes('program') || q.includes('time') || q.includes('speaker')) {
    buttons.push({ label: '📅 View Schedule', action: 'link', target: '/schedule' });
  }

  if (q.includes('blog') || q.includes('article') || q.includes('news')) {
    buttons.push({ label: '📰 Read Articles', action: 'link', target: '/blog' });
  }

  // Always offer customer support option if relevant or requested
  if (q.includes('human') || q.includes('agent') || q.includes('support') || q.includes('contact') || q.includes('help') || q.includes('admin') || buttons.length === 0) {
    buttons.push({ label: '💬 Talk to Support Agent', action: 'support', target: 'support_handoff' });
  }

  // Always include standard quick links if buttons list is short
  if (buttons.length < 3) {
    buttons.push({ label: '🎟️ Event Passes', action: 'link', target: '/register' });
    buttons.push({ label: '📿 Tasbīh Counter', action: 'link', target: '/tasbih' });
  }

  return buttons;
}
