import { createStyles } from "@mantine/styles";

import { HEADER_HEIGHT } from "../Header/styles";

const useStyles = createStyles((theme) => ({
  navbarMenuWrapper: {
    height: "100vh",
    padding: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[9]
        : theme.colors.gray[2],

    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      padding: theme.spacing.xs,
    },

    [`@media (min-width: ${theme.breakpoints.md}px) and (max-width: ${theme.breakpoints.lg}px)`]:
      {
        padding: theme.spacing.md,
      },
  },

  navbarMenu: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    height: `${HEADER_HEIGHT}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: "126px",
    display: "flex",
  },

  spacer: {
    height: "34px",
    width: "34px",
  },
}));

export default useStyles;
