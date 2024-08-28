import { createStyles } from "@mantine/styles";

import { HEADER_HEIGHT } from "../Header/styles";

const useStyles = createStyles((theme) => ({
  wrapper: {
    // fontFamily: 'DM-Sans',
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px - (24px * 2))`,
    padding: "16px 0",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
  },
}));

export default useStyles;
