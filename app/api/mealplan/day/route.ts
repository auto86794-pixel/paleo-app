import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { day } = body;

    if (!day) {
      return Response.json(
        {
          error: "Hiányzó nap.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
Készíts egy új paleo napi étrendet.

Nap: ${day}

KIZÁRÓLAG JSON:

{
  "day": "${day}",
  "breakfast": "",
  "lunch": "",
  "dinner": "",
  "calories": 2200,
  "protein": 180
}

Magyar nyelv.
Paleo étrend.
`;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
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

    const result = JSON.parse(
      completion.choices[0].message.content ?? "{}"
    );

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Generálási hiba.",
      },
      {
        status: 500,
      }
    );
  }
}