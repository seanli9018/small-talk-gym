import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getScenario } from "@/lib/scenarios";
import { Message, ChatResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const {
      scenarioId,
      messages,
    }: { scenarioId: string; messages: Message[] } = await req.json();

    const scenario = getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: scenario.systemPrompt },
        ...messages,
      ],
      temperature: 0.8,
    });

    const raw = completion.choices[0].message.content ?? "";

    // Extract JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const parsed: ChatResponse = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
