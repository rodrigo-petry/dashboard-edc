import Image from "next/image";
import { Burger, MediaQuery } from "@mantine/core";

import logoFull from "@images/logo_full.png";
import logoIcon from "@images/logo_icon.png";
import trioTecLogo from "@images/triotec_logo.png";

import useStyles from "./styles";
import { FullLogo, LogoIcon } from "@components/Layout/LogoLayout";

interface NavbarMenuTitleProps {
  isBurgerOpen: boolean;
  onBurgerClick: () => void;
}

function NavbarMenuTitle({
  isBurgerOpen,
  onBurgerClick,
}: NavbarMenuTitleProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.header}>
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Burger opened={isBurgerOpen} onClick={onBurgerClick} />
      </MediaQuery>
      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        <div className={classes.spacer} />
      </MediaQuery>

      <MediaQuery
        largerThan={992}
        smallerThan={1200}
        styles={{ display: "none" }}
      >
        <div className={classes.logo}>
          <FullLogo />
        </div>
      </MediaQuery>

      <MediaQuery
        query="(max-width: 992px), (min-width: 1200px)"
        styles={{ display: "none" }}
      >
        <div className={classes.logo}>
          <LogoIcon />
        </div>
      </MediaQuery>

      <div className={classes.spacer} />
    </div>
  );
}

export default NavbarMenuTitle;
