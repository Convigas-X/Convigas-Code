import type { EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server.node';
import { renderHeadToString } from 'remix-island';
import { Head } from './root';
import { PassThrough } from 'stream';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(<RemixServer context={remixContext} url={request.url} />, {
      onShellReady() {
        const head = renderHeadToString({ request, remixContext, Head });

        const stream = new PassThrough();
        const readable = new ReadableStream({
          start(controller) {
            // Write the HTML head
            controller.enqueue(
              new Uint8Array(
                new TextEncoder().encode(
                  `<!DOCTYPE html><html lang="en"><head>${head}</head><body><div id="root" class="w-full h-full">`,
                ),
              ),
            );

            // Pipe the React stream
            stream.on('data', (chunk) => {
              controller.enqueue(chunk);
            });

            stream.on('end', () => {
              controller.enqueue(new Uint8Array(new TextEncoder().encode('</div></body></html>')));
              controller.close();
            });

            stream.on('error', (error) => {
              controller.error(error);
            });

            pipe(stream);
          },
          cancel() {
            abort();
          },
        });

        responseHeaders.set('Content-Type', 'text/html');

        resolve(
          new Response(readable, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode,
          }),
        );
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        didError = true;
        console.error(error);
      },
    });

    if (isbot(request.headers.get('user-agent') || '')) {
      // For bots, wait for the full content
      setTimeout(() => {
        // Bot handling - let it stream naturally
      }, 0);
    }
  });
}
