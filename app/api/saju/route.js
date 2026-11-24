import { calcSaju } from "../../../lib/saju";
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const b = await req.json();
    const [year, month, day] = String(b.date || "").split("-").map(Number);
    if (!year || !month || !day) return Response.json({ error: "생년월일을 입력해주세요." }, { status: 400 });
    const hasTime = !!b.time;
    const [hour, minute] = hasTime ? b.time.split(":").map(Number) : [12, 0];
    const calendar = ["solar", "lunar", "leap"].includes(b.calendar) ? b.calendar : "solar";
    return Response.json(calcSaju({ year, month, day, hour, minute, hasTime, calendar }));
  } catch (e) {
    return Response.json({ error: "계산할 수 없는 날짜입니다. 음력/윤달 여부를 확인해주세요." }, { status: 400 });
  }
}
