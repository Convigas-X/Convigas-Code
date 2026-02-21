// Vercel Edge Runtime - Required for renderToReadableStream
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  try {
    // Dynamically import the server build
    const build = await import('../../build/server/index.js');

    // Get the default handler from the build
    const handleRequest = build.default || build.handleRequest;

    if (!handleRequest) {
      throw new Error('No handler found in build');
    }

    // Create a mock load context (required by Cloudflare adapter)
    const loadContext = {
      cloudflare: {
        env: {},
        ctx: {
          waitUntil: () => {},
          passThroughOnException: () => {},
        },
        caches: undefined,
      },
    };

    // Call the handler
    return await handleRequest(request, 200, new Headers(), {}, loadContext);
  } catch (error) {
    console.error('Edge function error:', error);

    // Return a friendly error page
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Convigas-Code - Loading...</title>
          <script type="module" src="/build/client/assets/entry.client-*.js"></script>
        </head>
        <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
          <div>Loading Convigas-Code...</div>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      },
    );
  }
}
