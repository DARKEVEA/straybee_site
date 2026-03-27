const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#101115"/>
  <rect x="8" y="8" width="48" height="48" fill="#f3f0e8"/>
  <rect x="28" y="8" width="8" height="48" fill="#e53122"/>
  <rect x="8" y="28" width="48" height="8" fill="#e53122"/>
  <circle cx="46" cy="18" r="6" fill="#f3c932"/>
</svg>
`;

export async function GET() {
  return new Response(faviconSvg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
