import Image from "next/image";
import { Burger, MediaQuery } from "@mantine/core";

import logoFull from "@images/logo_full.png";
import logoIcon from "@images/logo_icon.png";

import useStyles from "./styles";

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
    <div>
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        <Burger opened={isBurgerOpen} onClick={onBurgerClick} />
      </MediaQuery>

    </div>
  );
}

export default NavbarMenuTitle;
