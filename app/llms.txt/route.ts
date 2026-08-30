import { siteConfig } from "@/lib/site";
export function GET() {
  return new Response(
    `# Araz Shahkarami\n\nGeospatial Backend Developer and GeoAI developer.\n\n## Canonical pages\n- ${siteConfig.url}/fa\n- ${siteConfig.url}/en\n- ${siteConfig.url}/en/projects\n- ${siteConfig.url}/en/blog\n- ${siteConfig.url}/en/resume\n\nPublic facts are limited to verified information. Admin, previews, private contact details, and API internals must not be indexed.\n`,
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}
