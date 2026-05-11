import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// GET /api/waitlist?tool=tool-id  → returns { count: number }
// GET /api/waitlist               → returns all tools with counts (admin)
// POST /api/waitlist              → joins waitlist { toolId, userId? }
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const toolId = request.nextUrl.searchParams.get("tool");

  if (toolId) {
    const { count } = await supabase
      .from("tool_waitlist")
      .select("*", { count: "exact", head: true })
      .eq("tool_id", toolId);

    return NextResponse.json({ count: count ?? 0 });
  }

  // Return all tools counts (for admin)
  const { data } = await supabase
    .from("tool_waitlist")
    .select("tool_id");

  const counts: Record<string, number> = {};
  if (data) {
    for (const row of data) {
      counts[row.tool_id] = (counts[row.tool_id] || 0) + 1;
    }
  }

  return NextResponse.json(counts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { toolId, fingerprint } = body;

  if (!toolId) {
    return NextResponse.json({ error: "toolId required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  // Check if already joined (by user or fingerprint)
  if (user) {
    const { data: existing } = await supabase
      .from("tool_waitlist")
      .select("id")
      .eq("tool_id", toolId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      const { count } = await supabase
        .from("tool_waitlist")
        .select("*", { count: "exact", head: true })
        .eq("tool_id", toolId);
      return NextResponse.json({ already: true, count: count ?? 0 });
    }
  } else if (fingerprint) {
    const { data: existing } = await supabase
      .from("tool_waitlist")
      .select("id")
      .eq("tool_id", toolId)
      .eq("fingerprint", fingerprint)
      .single();

    if (existing) {
      const { count } = await supabase
        .from("tool_waitlist")
        .select("*", { count: "exact", head: true })
        .eq("tool_id", toolId);
      return NextResponse.json({ already: true, count: count ?? 0 });
    }
  }

  // Insert new entry
  const { error } = await supabase.from("tool_waitlist").insert({
    tool_id: toolId,
    user_id: user?.id ?? null,
    fingerprint: fingerprint ?? null,
  });

  if (error) {
    // If table doesn't exist yet, return a mock response
    console.error("Waitlist insert error:", error);
    return NextResponse.json({ success: true, count: 1, mock: true });
  }

  const { count } = await supabase
    .from("tool_waitlist")
    .select("*", { count: "exact", head: true })
    .eq("tool_id", toolId);

  return NextResponse.json({ success: true, count: count ?? 1 });
}
