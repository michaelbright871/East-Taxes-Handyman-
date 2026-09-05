import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/brochure")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(JSON.stringify({ error: "Brochure unavailable" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
