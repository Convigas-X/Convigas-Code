// Vercel Edge Function
export const config = {
  runtime: 'edge',
};

import { RemixServer } from '@remix-run/react';
import { renderToReadableStream } from 'react-dom/server';

export default async function handler(request: Request) {
  try {
    // Import the server build
    const build = await import('../build/server/index.js');
    
    // Create a Remix request handler
    const context = {
      url: request.url,
      request,
    };
    
    // Render the app
    const stream = await renderToReadableStream(
      <RemixServer context={context} url={request.url} />,
      {
        signal: request.signal,
        onError(error) {
          console.error('Render error:', error);
        },
      }
    );
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Handler error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}