import { ReactNode } from "react";
import { useHotkeys, useLocalStorageValue } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/styles";
import { ModalsProvider } from "@mantine/modals";
import '@fontsource/dm-sans';
interface MantineWrapperProps {
  children: ReactNode;
}

function MantineWrapper({ children }: MantineWrapperProps) {
  const [colorScheme, setColorScheme] = useLocalStorageValue<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: 'DM Sans, sans-serif',
          colorScheme: colorScheme,
          primaryColor: "brand",
          colors: {
            brand: [
              "#00BA7A",
              "#00A96F",
              "#009A65",
              "#008C5B",
              "#007F53",
              "#B9B9B9",
              "#00AEA3",
              "#005F3E",
              "#005538",
              "#004D32",
            ],
          },
        }}
      >
        <ModalsProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default MantineWrapper;
