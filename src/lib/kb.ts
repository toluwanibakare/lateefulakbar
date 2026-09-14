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
Lateeful Akbar 2027 Comprehensive Knowledge Base & Client Guidelines:

1. ORGANISATION & BRAND:
- Organisation Name: NADWAT GLOBAL ASSEMBLY / LATEEF-UL-AKBAR-LI-A’AZAM
- Description: NADWAT GLOBAL ASSEMBLY is an Islamic society dedicated to promoting spiritual growth, moral excellence, and community unity guided by the Glorious Quran and the Sunnah of Prophet Muhammad (ﷺ). NADWAT conducts regular prayers, educational programs, Zakat/Sadaqah drives, and major spiritual events like Ramadan, Eid, and Lateeful Akbar.
- Official Colors: White (Dominant & Primary), Deep Emerald / Islamic Green (Secondary/Accent), Red (Accent).
- Contact Email: Lateefulakbar@gmail.com
- Contact Address: Nadwat Mosque, Lagos State, Nigeria.
- Contact Phone / WhatsApp: +234 704 700 0765
- Social Handles: TikTok (@lateefulakbar), Instagram (@lateefulakbar), Facebook (The Lateeful Akbar Li A’azam).

2. FOUNDER & LEADERSHIP:
- Chief Missioner: Shaikh Dr. Abdur Rahman Ade Lawal Ph.D Mnipr
- Profile: Esteemed Chief Missioner of NADWAT combining deep religious wisdom with high academic achievement. Holds a Ph.D. in Mass Communication, graduate of the world-renowned Al-Azhar University, and an alumnus of the U.S. International Visitor Leadership Program (IVLP). He is an author, teacher, media consultant, and respected marriage counselor.

3. EVENT DETAILS:
- Event Title: Lateeful Akbar 2027
- Date & Time: Sunday, 24th January, 2027 (Gates open at 08:00 WAT).
- Official Venue: TAFAWA BALEWA SQUARE (MAIN BOWL) RACE COURSE, LAGOS ISLAND, LAGOS, NIGERIA.
- Meaning & Theme: Centered on invoking Allah by His beautiful name "Yā Lateef" (‫يَا لَطِيف‬) — Al-Lateef: The Most Subtle, The Most Gentle. It is a grand spiritual gathering for collective Duʿā, Dhikr, Qur'anic reflection, and seeking divine intervention for life challenges (financial hardship, family, health, career, marriage, education, migration, protection, and prosperity).
- Programme Highlights: Daily Fortification, Welcome & Introduction, Thanksgiving, Islamic Lecture / Spiritual Exhortation, Collective Dhikr & Istighfār, Salawāt upon Prophet Muhammad (ﷺ), Special Yā Lateef Dhikr, Guided Duʿā for personal and family needs, Special Prayer for the Ummah, and Closing Duʿā.
- Official Livestream: https://www.youtube.com/watch?v=0x1LqBHjWWE&list=PLJsrEKjc7MxyNwPx5xjQa4OrPJNQlWJmd
- Photos Archive: https://nadwatmedia.pixieset.com/lateefulakbar20226/

4. EVENT RULES & GUIDELINES:
- DRESS CODE: STRICTLY ALL WHITE! All attendees must dress modestly, decently, and in all-white attire.
- PARKING POLICY: Vehicle parking is STRICTLY PROHIBITED within the Main Bowl. All vehicles must be parked in officially designated parking lots outside the main bowl.
- Seating Policy: Seating is strictly on a first-come, first-served occupancy basis. Reserving or holding seats for absent persons is not allowed.
- Restricted Areas: Stage, media zone, VIP area, technical control zone, and vendor spaces are restricted to authorized personnel displaying accreditation.
- Security & Prohibited Items: All attendees undergo security checks at entry gates. Weapons, alcohol, intoxicants, and dangerous substances are strictly forbidden.
- Etiquette & Sanitation: Maintain Islamic etiquette, follow ushers' instructions, dispose of trash in designated bins, and keep emergency exits clear.

5. REGISTRATION & ACCREDITATION PORTALS:
- Guest Registration: Free attendance passes (Standard Pass, VIP Delegate Pass, Virtual Streaming Access). Fields required: Full Name, Gender, Phone/WhatsApp, Email, Country of Residence, State/City, Age Range, Nadwat Member Status, How you heard, Prayer Request/Intention, Attendance Type (Physical/Online).
- Vendor Portal: Application for vendors (Food & Drinks, Clothing & Adire, Islamic Books & Materials, Accessories, Services). Vendors pay online and agree to Halal compliance and safety rules.
- Media & Blogger Accreditation: Registration for press, content creators, photographers, videographers, and broadcast journalists requiring Media Zone access.

6. SADAQAH & DONATIONS (FACILITIES TO BE FUNDED):
- Prayer Mats: 1,000 pcs (₦5,000 / unit)
- Packs of Water: 2,000 pcs (₦2,000 / unit)
- Cooling Equipment / Fans: 700 pcs (₦15,000 / unit)
- Internet Infrastructure
- Media & Broadcast Facility
- Tent & Canopy Setup

7. DIGITAL PRAYER BOOK & TASBĪH:
- Official Nadwat Asalatu Prayer Book: A digital 208-page publication containing authentic Arabic supplications, transliterations, translations, Salawāt, and Yā Lateef Dhikr. Read-only scrolling format inside the website.
- Digital Tasbīh Counter: Live global Dhikr counter on the website enabling attendees and online participants to contribute to the collective count.
`;

export function getQuickButtonsForIntent(query: string): QuickButton[] {
  const q = query.toLowerCase();
  const buttons: QuickButton[] = [];

  if (q.includes('register') || q.includes('ticket') || q.includes('pass') || q.includes('seat') || q.includes('attend') || q.includes('guest')) {
    buttons.push({ label: '🎟️ Guest Registration', action: 'link', target: '/register' });
  }

  if (q.includes('vendor') || q.includes('stall') || q.includes('food') || q.includes('booth') || q.includes('seller')) {
    buttons.push({ label: '🛍️ Vendor Registration', action: 'link', target: '/vendors' });
  }

  if (q.includes('media') || q.includes('press') || q.includes('blog') || q.includes('accreditation') || q.includes('camera')) {
    buttons.push({ label: '🎥 Media Accreditation', action: 'link', target: '/media-accreditation' });
  }

  if (q.includes('donate') || q.includes('sadaqah') || q.includes('support') || q.includes('give') || q.includes('money') || q.includes('water') || q.includes('mat')) {
    buttons.push({ label: '💚 Donate & Sadaqah', action: 'link', target: '/donate' });
  }

  if (q.includes('tasbih') || q.includes('dhikr') || q.includes('count') || q.includes('ya lateef')) {
    buttons.push({ label: '📿 Digital Tasbīh', action: 'link', target: '/tasbih' });
  }

  if (q.includes('prayer book') || q.includes('asalatu') || q.includes('dua') || q.includes('book')) {
    buttons.push({ label: '📖 Open Prayer Book', action: 'link', target: '/prayer-book' });
  }

  if (q.includes('venue') || q.includes('location') || q.includes('where') || q.includes('map') || q.includes('parking') || q.includes('tbs') || q.includes('lagos')) {
    buttons.push({ label: '📍 Venue & Map Guidelines', action: 'link', target: '/venue' });
  }

  // Always offer customer support option if relevant or requested
  if (q.includes('human') || q.includes('agent') || q.includes('support') || q.includes('contact') || q.includes('help') || q.includes('admin') || buttons.length === 0) {
    buttons.push({ label: '💬 Talk to Support Agent', action: 'support', target: 'support_handoff' });
  }

  // Always include standard quick links if buttons list is short
  if (buttons.length < 3) {
    buttons.push({ label: '🎟️ Event Passes', action: 'link', target: '/register' });
    buttons.push({ label: '📖 Prayer Book', action: 'link', target: '/prayer-book' });
  }

  return buttons;
}
