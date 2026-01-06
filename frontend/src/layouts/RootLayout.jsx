import { useEffect } from "react";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { MotionConfig } from "@/components/motion/MotionConfig";
import { useUIStore } from "@/stores/ui.store";
import { useMounted } from "@/hooks/useMounted";
function RootLayout({ children }) {
  const { theme } = useUIStore();
  const mounted = useMounted();
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon && mounted) {
      favicon.href = theme === "dark" ? "/logo_light.jpeg" : "/logo_dark.jpeg";
    }
  }, [theme, mounted]);
  return <><CustomCursor /><MotionConfig>{children}</MotionConfig></>;
}
export {
  RootLayout
};
