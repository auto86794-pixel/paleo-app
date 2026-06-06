import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const meal = body.meal;

    if (!meal || typeof meal !== "string") {
      return Response.json(
        { error: "Hiányzó ételnév." },
        { status: 400 }
      );
    }

    const prompt = `
Készíts rövid, könnyen követhető paleo receptet ehhez az ételhez:

${meal}

KIZÁRÓLAG érvényes JSON-t adj vissza.
Ne használj markdown-t.
Ne írj magyarázatot.

A JSON formátuma pontosan:

{
  "title": "${meal}",
  "ingredients": [
    "hozzávaló 1",
    "hozzávaló 2"
  ],
  "instructions": [
    "lépés 1",
    "lépés 2"
  ]
}

Szabályok:
- magyar nyelv
- paleo alapanyagok
- egyszerű elkészítés
- maximum 8 hozzávaló
- maximum 6 elkészítési lépés
- ne használj glutént
- ne használj finomított cukrot
- ne használj ultra-feldolgozott alapanyagokat
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
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
        { error: "Az AI nem adott vissza receptet." },
        { status: 500 }
      );
    }

    let recipe;

    try {
      recipe = JSON.parse(content);
    } catch (error) {
      console.error("Recipe JSON parse error:", error);

      return Response.json(
        { error: "Az AI érvénytelen JSON receptet adott." },
        { status: 500 }
      );
    }

    if (
      !recipe.title ||
      !Array.isArray(recipe.ingredients) ||
      !Array.isArray(recipe.instructions)
    ) {
      return Response.json(
        { error: "Az AI recept válasza hibás szerkezetű." },
        { status: 500 }
      );
    }

    return Response.json({
      recipe,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Hiba történt a recept generálása közben." },
      { status: 500 }
    );
  }
}