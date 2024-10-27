// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Intercepter les requêtes vers /api/
  if (request.nextUrl.pathname.startsWith('/')) {
    // Ajouter un token JWT dans les headers de la requête vers votre backend
    const authToken = request.cookies.get('auth_token') || '';

    const url = request.nextUrl.clone();
    url.hostname = process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost';
    url.port = process.env.NEXT_PUBLIC_BACKEND_PORT || '8080'; 
    url.protocol = process.env.NEXT_PUBLIC_BACKEND_PROTOCOL || 'http';

    // Copier la requête originale, ajouter l'en-tête Authorization
    const headers = new Headers(request.headers);
    headers.set('Authorization', `Bearer ${authToken}`);

    const response = await fetch(url.toString(), {
      method: request.method,
      headers,
      body: request.body,
    });

    // Retourner la réponse de l'API backend
    return new NextResponse(response.body, {
      headers: response.headers,
      status: response.status,
    });
  }

  return NextResponse.next(); // Continuer normalement pour les autres requêtes
}
