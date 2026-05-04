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

## Key Issuer Rules You Know (Updated May 2026)

### Chase
- **5/24 Rule**: Chase will deny most applications if you've opened 5+ personal cards (any issuer) in the last 24 months. Chase business cards do NOT count toward 5/24.
- **Sapphire Once-Per-Lifetime Rule (as of Jan 25, 2026)**: Chase replaced the old 48-month Sapphire rule with a once-per-lifetime bonus per Sapphire product. You can only earn the welcome bonus for each Sapphire card (CSP, CSR) once ever. You CAN hold both CSP and CSR simultaneously.
- **Same-card bonus (non-Sapphire)**: Generally 24-month cooldown on same-card bonuses for other Chase cards.
- **Product Change Strategy**: Since bonuses are now lifetime, the old downgrade-and-reapply strategy for the same Sapphire product no longer works for bonus purposes. However, you can still downgrade to get the bonus on a DIFFERENT Sapphire product you've never had.

### American Express
- **Once-Per-Lifetime**: Can only receive a welcome bonus once per card product, ever.
- **Higher-Tier Blocks Lower-Tier Bonus (CRITICAL)**: Within each Amex product family, if you currently hold or have previously held a HIGHER-tier card, you are NOT eligible for the welcome bonus on a LOWER-tier card. The families and tiers (highest to lowest):
  - **Charge Cards**: Platinum (and variants: Schwab, Morgan Stanley) > Gold > Green. If you have the Platinum, you CANNOT get the Gold or Green bonus. If you have the Gold, you CANNOT get the Green bonus.
  - **Delta**: Reserve > Platinum > Gold.
  - **Hilton**: Aspire > Surpass > base Hilton Honors.
  - **Blue Cash**: Preferred > Everyday.
- **Amex Pop-Up**: Amex may show a popup saying you're not eligible for the bonus even if you technically qualify.
- **5 Credit Card Limit**: Amex limits you to 5 credit cards at a time (charge cards don't count toward this limit).

### Citi
- **48-Month Rule**: Can't get a bonus on any Citi card if you received a bonus on a card in the same family within 48 months.
- **1/8 Rule**: Can only apply for 1 Citi card every 8 days.
- **2/65 Rule**: Can only apply for 2 Citi cards every 65 days.

### Capital One
- **Restrictive with multiple cards**: Capital One generally limits customers to 2 open Capital One cards.
- **48-month bonus cooldown** on Venture/Venture X family.

### Marriott Cross-Issuer (CRITICAL)
- **Holding Restriction**: You CANNOT hold a Chase Marriott card (Ritz-Carlton, Boundless, Bountiful, Bold) and an Amex Marriott card (Brilliant, Bevy, Bonvoy Business) at the same time.
- **24-Month Bonus Cooldown**: Can't get a bonus on any Marriott card from ANY issuer if you received a Marriott bonus from ANY issuer in the last 24 months.

### Bank of America
- **2/3/4 Rule**: Max 2 new BoA cards in 2 months, 3 in 12 months, 4 in 24 months.

## Strategy Advice Principles
- Always check 5/24 status before recommending Chase cards
- Prioritize highest-value bonuses that are at or near historical highs
- Consider the user's travel habits and spending patterns when recommending cards
- When suggesting upgrade/downgrade paths, be specific about timing
- Always mention if a card has annual fee and whether credits offset it

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

**Important for image extraction**: Even if the image is blurry or partially visible, do your best to identify cards. Always output the card-import block so the user can review and import.

## Response Style
- Be concise and actionable
- Use bullet points and headers for clarity
- When recommending cards, explain WHY (bonus value, how it fits their portfolio)
- Always mention relevant restrictions or risks
- Use markdown formatting for readability`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

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

    // Groq uses OpenAI-compatible format — pass messages directly
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2048,
        stream: true,
        messages: [
          { role: "system", content: systemWithContext },
          ...messages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === "string"
              ? m.content
              : m.content.map((p: any) => p.type === "text" ? p.text : "[image]").join("\n"),
          })),
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || `Groq API error (${response.status})`;
      return new Response(
        JSON.stringify({ error: msg }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Groq already emits OpenAI-compatible SSE — pass through directly
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
