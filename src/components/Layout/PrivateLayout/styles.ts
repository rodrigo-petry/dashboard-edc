import { createStyles } from "@mantine/styles";

export const NAVBAR_WIDTH = 300;
export const NAVBAR_COLLAPSED_WIDTH = 111;

export const NAVBAR_CLOSED_BREAKPOINT = 760;
export const NAVBAR_COLLAPSED_BREAKPOINT = 1200;

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0],

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      padding: theme.spacing.xs,
    },

    [`@media (min-width: ${theme.breakpoints.md}px) and (max-width: ${theme.breakpoints.lg}px)`]:
      {
        padding: theme.spacing.md,
      },
  },
}));

export default useStyles;
