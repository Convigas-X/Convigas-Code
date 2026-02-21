// Vercel Edge Runtime
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  try {
    // Try to serve static files first
    const url = new URL(request.url);
    const pathname = url.pathname;

    // For API routes or dynamic content, you'd handle them here
    // For now, we'll return a simple HTML that loads the client app

    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <title>Convigas-Code</title>
          <meta name="description" content="AI-powered web development platform">
          <script>
            // Client-side redirect to handle routing
            window.__remixContext = {};
          </script>
        </head>
        <body style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;margin:0;">
          <div id="root" style="width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;">
            <div style="text-align:center;">
              <h1 style="color:#ef4444;font-size:2rem;margin-bottom:1rem;">Convigas-Code</h1>
              <p>Loading... Please ensure JavaScript is enabled.</p>
            </div>
          </div>
          <script>
            // Attempt to load the client bundle
            const script = document.createElement('script');
            script.type = 'module';
            script.src = '/build/client/assets/entry.client-*.js';
            script.onerror = () => {
              document.getElementById('root').innerHTML = '<div style="padding:2rem;"><h1>Unable to load application</h1><p>Please check your connection and try again.</p></div>';
            };
            document.body.appendChild(script);
          </script>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-cache',
        },
      },
    );
  } catch (error) {
    console.error('Edge function error:', error);

    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Error</title></head>
        <body><h1>Server Error</h1></body>
      </html>`,
      {
        status: 500,
        headers: { 'content-type': 'text/html' },
      },
    );
  }
}
