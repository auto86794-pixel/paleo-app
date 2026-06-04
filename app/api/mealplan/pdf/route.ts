import { PDFDocument, StandardFonts } from "pdf-lib";

type MealPlanDay = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  calories?: number;
  protein?: number;
};

type MealPlan = {
  days: MealPlanDay[];
  shoppingList: string[];
};

export async function POST(req: Request) {
  try {
    const mealplan = (await req.json()) as MealPlan;

    if (!mealplan?.days?.length) {
      return Response.json(
        {
          error: "Nincs exportálható étrend.",
        },
        {
          status: 400,
        }
      );
    }

    const pdfDoc = await PDFDocument.create();

    let page = pdfDoc.addPage([595, 842]);

    const font = await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

    const boldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

    let y = 800;

    const write = (
  text: string,
  size = 11,
  isBold = false
) => {
  if (y < 60) {
    page = pdfDoc.addPage([595, 842]);
    y = 800;
  }

  const safeText = text
    .replace(/ő/g, "o")
    .replace(/Ő/g, "O")
    .replace(/ű/g, "u")
    .replace(/Ű/g, "U");

  page.drawText(safeText, {
    x: 50,
    y,
    size,
    font: isBold ? boldFont : font,
  });

  y -= size + 8;
};
    

    const totalCalories = mealplan.days.reduce(
      (sum, day) => sum + (day.calories ?? 0),
      0
    );

    const totalProtein = mealplan.days.reduce(
      (sum, day) => sum + (day.protein ?? 0),
      0
    );

    write("PALEOAI", 24, true);
    write("Weekly Paleo Meal Plan", 18, true);

    y -= 10;

    write(`Heti kalória: ${totalCalories} kcal`);
    write(`Heti fehérje: ${totalProtein} g`);
    write(
      `Bevásárlólista tételek: ${mealplan.shoppingList.length}`
    );

    y -= 20;

    for (const day of mealplan.days) {
      write(day.day, 16, true);

      write(`Reggeli: ${day.breakfast}`);
      write(`Ebéd: ${day.lunch}`);
      write(`Vacsora: ${day.dinner}`);

      write(
        `${day.calories ?? 0} kcal | ${
          day.protein ?? 0
        } g protein`
      );

      y -= 10;
    }

    write("Bevásárlólista", 16, true);

    for (const item of mealplan.shoppingList) {
      write(`• ${item}`);
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(new Uint8Array(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="paleoai-mealplan.pdf"',
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "PDF generálási hiba.",
      },
      {
        status: 500,
      }
    );
  }
}