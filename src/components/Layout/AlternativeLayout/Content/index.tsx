import { ReactNode } from "react";
import { Container, MantineNumberSize } from "@mantine/core";

import useStyles from "./styles";
import { useMediaQuery } from "@mantine/hooks";

interface ContentProps {
  children: ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 1400px");

  const containerProps = matches
    ? { size: "xl" as MantineNumberSize }
    : { fluid: true };

  return (
    <div className={classes.wrapper}>
      <Container {...containerProps}>{children}</Container>
    </div>
  );
};

export default Content;
