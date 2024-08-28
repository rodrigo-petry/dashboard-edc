import { useContext } from "react";
import { Title } from "@mantine/core";

import { PageTitleContext } from "@contexts/PageTitleContextProvider";

import useStyles from "./styles";

function PageTitle() {
  const { classes } = useStyles();

  const { pageTitle } = useContext(PageTitleContext);

  return <Title className={classes.title}>{pageTitle}</Title>;
}

export default PageTitle;
