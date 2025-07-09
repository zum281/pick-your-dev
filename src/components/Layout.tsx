import type { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="h-screen">
      <section className="gap-16 p-4 mx-auto max-w-xl grid place-content-center h-full">
        {children}
      </section>
    </main>
  );
};
