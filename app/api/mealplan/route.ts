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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (profileError || !profile) {
      return Response.json(
        { error: "Nincs mentett profil." },
        { status: 400 }
      );
    }

    const prompt = `
A felhasználó adatai:

Életkor: ${profile.age ?? "nincs megadva"}
Testsúly: ${profile.weight ?? "nincs megadva"} kg
Magasság: ${profile.height ?? "nincs megadva"} cm
Cél: ${profile.goal ?? "nincs megadva"}
Aktivitás: ${profile.activity ?? "nincs megadva"}

Készíts személyre szabott 7 napos paleo étrendet.

KIZÁRÓLAG érvényes JSON-t adj vissza.
Ne használj markdown-t.
Ne írj magyarázatot.

A JSON formátuma pontosan:

{
  "days": [
    {
      "day": "Hétfő",
      "breakfast": "szöveg",
      "lunch": "szöveg",
      "dinner": "szöveg",
      "calories": 2200,
      "protein": 180
    }
  ],
  "shoppingList": [
    "tojás",
    "csirkemell"
  ]
}

Szabályok:
- pontosan 7 nap legyen
- magyar nyelv
- paleo étrend
- természetes alapanyagok
- minden naphoz legyen reggeli, ebéd, vacsora
- calories szám legyen
- protein szám legyen
- shoppingList tömb legyen
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return Response.json(
        { error: "Az AI nem adott vissza választ." },
        { status: 500 }
      );
    }

    let mealplan;

    try {
      mealplan = JSON.parse(content);
    } catch (error) {
      console.error("JSON parse error:", error);

      return Response.json(
        { error: "Az AI érvénytelen JSON választ adott." },
        { status: 500 }
      );
    }

    if (
      !mealplan.days ||
      !Array.isArray(mealplan.days) ||
      !mealplan.shoppingList ||
      !Array.isArray(mealplan.shoppingList)
    ) {
      return Response.json(
        { error: "Az AI válasza hibás szerkezetű." },
        { status: 500 }
      );
    }

    return Response.json({
      mealplan,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Hiba történt az étrend generálása közben." },
      { status: 500 }
    );
  }
}