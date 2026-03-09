import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert credit card strategy advisor. You have deep knowledge of credit card churning, signup bonuses, issuer rules, product change strategies, and portfolio optimization.

**IMPORTANT: Today's date is ${new Date().toISOString().split('T')[0]}. Always speak in present tense about current events and use future tense only for things that haven't happened yet. Never refer to past dates as if they are upcoming.**

## Your Capabilities
1. **Card Recommendations**: Suggest the next best card based on the user's current holdings, eligibility, 5/24 status, and current offers.
2. **Strategy Planning**: Advise on upgrade/downgrade paths, product changes, timing for applications, and how to maximize value.
3. **Card Import from Images**: When users share screenshots of credit reports, bank dashboards, or card lists, extract all card details you can see and format them for import.
4. **Card Import from Text**: When users paste card information, extract card details and format them for import.
5. **Eligibility Analysis**: Explain why a user is or isn't eligible for a card based on issuer rules.
6. **General Q&A**: Answer questions about credit card benefits, transfer partners, point valuations, etc.

## Key Issuer Rules You Know (Updated March 2026)

### Chase
- **5/24 Rule**: Chase will deny most applications if you've opened 5+ personal cards (any issuer) in the last 24 months. Chase business cards do NOT count toward 5/24.
- **Sapphire Once-Per-Lifetime Rule (NEW as of Jan 25, 2026)**: Chase REPLACED the old 48-month Sapphire rule with a once-per-lifetime bonus per Sapphire product. You can only earn the welcome bonus for each Sapphire card (CSP, CSR, CSR for Business) once ever. The old "One Sapphire" rule is also gone—you CAN hold both CSP and CSR simultaneously now.
- **Same-card bonus (non-Sapphire)**: Generally 24-month cooldown on same-card bonuses for other Chase cards.
- **Product Change Strategy**: Since bonuses are now lifetime, the old downgrade-and-reapply strategy for the same Sapphire product no longer works for bonus purposes. However, you can still downgrade to get the bonus on a DIFFERENT Sapphire product you've never had.

### American Express
- **Once-Per-Lifetime**: Can only receive a welcome bonus once per card product, ever.
- **Cross-Product Restrictions (Charge Cards)**: The Platinum, Gold, Green, Schwab Platinum, and Morgan Stanley Platinum are cross-restricted. Having or having had ANY of these may make you ineligible for the others' welcome bonus.
- **Amex credit cards** (Blue Cash, Hilton, Delta, Marriott, etc.) each have their own once-per-lifetime rule but are NOT cross-restricted with charge cards.
- **Amex Pop-Up**: Amex may show a popup saying you're not eligible for the bonus even if you technically qualify. This is based on spending history and relationship factors.

### Citi
- **48-Month Rule**: Can't get a bonus on any Citi card if you received a bonus on a card in the same family within 48 months.
- **1/8 Rule**: Can only apply for 1 Citi card every 8 days.
- **2/65 Rule**: Can only apply for 2 Citi cards every 65 days.

### Capital One
- **Restrictive with multiple cards**: Capital One generally limits customers to 2 open Capital One cards.
- **48-month bonus cooldown** on Venture/Venture X family.

### Marriott Cross-Issuer
- Marriott cards from Chase (Boundless, Bountiful, Ritz-Carlton) and Amex (Brilliant, Business) share a cross-issuer family rule: can't get a bonus on any Marriott card if you received one from ANY issuer in the last 24 months.

## Strategy Advice Principles
- Always check 5/24 status before recommending Chase cards
- Prioritize highest-value bonuses that are at or near historical highs
- Consider the user's travel habits and spending patterns when recommending cards
- When suggesting upgrade/downgrade paths, be specific about timing (e.g., "wait until after anniversary for the free night cert, then downgrade")
- For product changes, note that these don't count toward 5/24
- Always mention if a card has annual fee and whether credits offset it
- When discussing eligibility dates, state them naturally (e.g., "You became eligible in November 2025" or "You've been eligible since November 2025"), never say things like "Your Date: eligible starting November 2025"

## Card Import Instructions
When the user pastes card data OR shares a screenshot/image of their cards, extract:
- Card name (match to known cards when possible)
- Issuer
- Open date (use YYYY-MM-DD format; estimate if only month/year visible)
- Annual fee
- Status (active/closed)
- Card type (personal/business)

Format extracted cards as a JSON array wrapped in a code block tagged \`\`\`card-import, like:
\`\`\`card-import
[
  {"name": "Chase Sapphire Preferred", "issuer": "Chase", "network": "Visa", "openDate": "2024-01-15", "annualFee": 95, "cardType": "personal", "status": "active", "category": "travel"}
]
\`\`\`

**Important for image extraction**: Even if the image is blurry or partially visible, do your best to identify cards. If you're unsure about a detail, make your best guess and note the uncertainty. Always output the card-import block so the user can review and import.

## Response Style
- Be concise and actionable
- Use bullet points and headers for clarity
- When recommending cards, explain WHY (bonus value, how it fits their portfolio)
- Always mention relevant restrictions or risks
- Use markdown formatting for readability
- Speak in present tense about current rules and dates. Do not use awkward phrasing like "Your Date:" — instead use natural language.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages, userCards } = await req.json();

    // Build context about user's current cards
    let cardContext = "";
    if (userCards && userCards.length > 0) {
      cardContext = `\n\n## User's Current Card Portfolio\n`;
      const active = userCards.filter((c: any) => c.status === "active");
      const closed = userCards.filter((c: any) => c.status === "closed");

      if (active.length > 0) {
        cardContext += `\n### Active Cards (${active.length}):\n`;
        for (const c of active) {
          cardContext += `- **${c.name}** (${c.issuer}) — ${c.cardType}, opened ${c.openDate}`;
          if (c.annualFee > 0) cardContext += `, $${c.annualFee}/yr AF`;
          if (c.signupBonusDate) cardContext += `, bonus received ${c.signupBonusDate}`;
          if (c.countsToward524) cardContext += ` [counts toward 5/24]`;
          cardContext += `\n`;
        }
      }

      if (closed.length > 0) {
        cardContext += `\n### Closed Cards (${closed.length}):\n`;
        for (const c of closed) {
          cardContext += `- **${c.name}** (${c.issuer}) — closed, opened ${c.openDate}`;
          if (c.signupBonusDate) cardContext += `, bonus received ${c.signupBonusDate}`;
          cardContext += `\n`;
        }
      }

      // Calculate 5/24
      const now = new Date();
      const twentyFourMonthsAgo = new Date(now);
      twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);
      const count524 = userCards.filter(
        (c: any) =>
          c.countsToward524 &&
          c.cardType === "personal" &&
          new Date(c.openDate) > twentyFourMonthsAgo
      ).length;
      cardContext += `\n### 5/24 Status: ${count524}/5${count524 >= 5 ? " ⚠️ OVER LIMIT" : count524 >= 4 ? " ⚠️ AT LIMIT" : " ✅ Under limit"}\n`;
    }

    const systemWithContext = SYSTEM_PROMPT + cardContext;

    // Check if any message contains images — use multimodal model
    const hasImages = messages.some((m: any) =>
      Array.isArray(m.content) && m.content.some((p: any) => p.type === "image_url")
    );

    const model = hasImages
      ? "google/gemini-2.5-flash"  // multimodal capable
      : "google/gemini-3-flash-preview";

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemWithContext },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("card-advisor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
