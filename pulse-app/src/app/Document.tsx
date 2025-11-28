import Navigationbar from "@/layouts/Navigationbar";
import styles from "./styles.css?url";
import client from "/src/client.tsx?url";

export const Document: React.FC<{
  children: React.ReactNode;
  showNavbar?: boolean;
}> = ({ children, showNavbar = true }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Pulse - Fitness Tracker</title>
      <link rel="stylesheet" href={styles} />
      <script type="module" src={client} defer></script>
    </head>

    <body>
      {showNavbar && <Navigationbar />}
      <div id="root">{children}</div>
    </body>
  </html>
);
