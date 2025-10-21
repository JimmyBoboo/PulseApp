import Navigationbar from "@/layouts/Navigationbar";
import styles from "./styles.css?url";
export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Pulse - Fitness Tracker</title>
      <link rel="modulepreload" href="/src/client.tsx" />
      <link rel="stylesheet" href={styles} />
    </head>

    <body>
      <Navigationbar />
      <div id="root">{children}</div>
    </body>
  </html>
);
