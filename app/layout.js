import localFont from "next/font/local";
import './globals.css'
import Provider from "@/component/Provider";
import LayoutWrapper from "@/component/LayoutWrapper";

export const metadata = {
  title: "IntelliLearn Studios",
  description: "IntelliLearn Studios Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Provider>
      </body>
    </html>
  );
}
