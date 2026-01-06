import { ReactNode, useEffect } from "react";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { MotionConfig } from "@/components/motion/MotionConfig";
import { useUIStore } from "@/stores/ui.store";
import { useMounted } from "@/hooks/useMounted";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const { theme } = useUIStore();
  const mounted = useMounted();

  useEffect(() => {
    // Update favicon on mount and theme change
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (favicon && mounted) {
      favicon.href = theme === 'dark' ? '/logo_light.jpeg' : '/logo_dark.jpeg';
    }
  }, [theme, mounted]);

  return (
    <>
      <CustomCursor />
      <MotionConfig>
        {children}
      </MotionConfig>
    </>
  );
}

