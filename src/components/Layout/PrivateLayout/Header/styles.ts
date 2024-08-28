import { createStyles } from "@mantine/styles";

export const HEADER_HEIGHT = 60;
export const HEADER_BREAKPOINT = 860;

const useStyles = createStyles((theme) => ({
  header: {
    height: HEADER_HEIGHT,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
  },

  mainSection: {
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    flex: 1,
    color: theme.colors.brand[5],

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: 20,
    },
  },

  actions: {
    display: "flex",
  },
}));

export default useStyles;
