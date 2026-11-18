// POST /api/revalidate — o WordPress chama isto quando publicas, atualizas ou apagas um artigo/página.
// Faz o Next.js esquecer a cache e ir buscar o conteúdo novo logo no próximo pedido
// (em vez de esperar até 60 s pelo "revalidate" normal).
//
// O WordPress envia o cabeçalho "x-revalidate-secret" com o mesmo valor que REVALIDATE_SECRET.

import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  // O site é pequeno: em vez de adivinhar que páginas mudaram (arquivo, categorias, menu…),
  // invalida-se tudo o que está por baixo do layout raiz.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
