import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const { data, error } = await supabase
      .from("glucose_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(14);

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const prompt = `
Elemezd az alábbi vércukor adatokat:

${JSON.stringify(data, null, 2)}

Írj magyar nyelvű elemzést.

Térj ki:
- javuló vagy romló trend
- éhgyomri vércukor értékelése
- étkezések utáni értékek értékelése
- rövid étrendi javaslat
- rövid életmódbeli javaslat

Maximum 250 szó.
`;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    return Response.json({
      analysis:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Elemzési hiba.",
      },
      {
        status: 500,
      }
    );
  }
}