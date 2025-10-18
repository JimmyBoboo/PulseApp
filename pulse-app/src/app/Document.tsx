import Navigationbar from "@/layouts/Navigationbar";
import "@/index.css";

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Pulse - Fitness Tracker</title>
      <link rel="modulepreload" href="/src/client.tsx" />
    </head>
    <body className="m-0 p-0">
      <nav>
        <Navigationbar />
      </nav>
      <div id="root">{children}</div>
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);
