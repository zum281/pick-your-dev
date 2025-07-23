import { useEffect, useState } from "react";
import { run as axe } from "axe-core";
import type { AxeResults } from "axe-core";

export const DevA11yChecker = () => {
  const [violations, setViolations] = useState<AxeResults["violations"]>([]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const checkA11y = async () => {
        try {
          const results = await axe({
            include: [document.body],
            exclude: ["[data-dev-a11y-checker]"],
          });
          setViolations(results.violations);
          if (results.violations.length > 0) {
            console.group("🚨 Accessibility Violations Found");
            results.violations.forEach((violation) => {
              console.error(`${violation.id}: ${violation.description}`);
              violation.nodes.forEach((node) => console.log(node.html));
            });
            console.groupEnd();
          }
        } catch (error) {
          console.error("A11y check failed:", error);
        }
      };

      // Check on mount and when DOM changes
      checkA11y();
      const observer = new MutationObserver(checkA11y);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, []);

  if (!import.meta.env.DEV || violations.length === 0) return null;

  return (
    <div
      data-dev-a11y-checker
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        background: "#dc2626",
        color: "white",
        padding: "10px",
        zIndex: 9999,
        borderRadius: "4px 0 0 0",
      }}>
      ⚠️ {violations.length} A11y violations - Check console
    </div>
  );
};
