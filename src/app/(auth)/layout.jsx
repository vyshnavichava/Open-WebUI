// import { ClerkProvider } from "@clerk/nextjs";
// import { ReactNode } from "react";

// export const metadata = {
//   title: "ObsidianGPT - Auth",
// };

// export default function AuthLayout({ children }) {
//   return (
//     <ClerkProvider>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
//           {children}
//         </div>
//       </div>
//     </ClerkProvider>
//   );
// }

import { ClerkProvider } from "@clerk/nextjs/app-beta";

export const metadata = {
  title: "ObsidianGPT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}

