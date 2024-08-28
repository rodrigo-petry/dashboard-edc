import {
  Burger,
  Container,
  MantineNumberSize,
  MediaQuery,
  Space,
  Title,
} from "@mantine/core";

import PageTitle from "./PageTitle";
import NotificationDropdown from "./NotificationDropdown";
import UserMenu from "./UserMenu";

import useStyles from "./styles";
import { useMediaQuery } from "@mantine/hooks";

interface HeaderProps {
  isBurgerOpen: boolean;
  onBurgerClick: () => void;
}

function Header({ isBurgerOpen, onBurgerClick }: HeaderProps) {
  const { classes } = useStyles();
  const matches = useMediaQuery("(min-width: 1400px");

  const containerProps = matches
    ? { size: "xl" as MantineNumberSize }
    : { fluid: true };

  return (
    <div className={classes.header}>
      <Container {...containerProps} className={classes.mainSection}>
        <MediaQuery largerThan="md" styles={{ display: "none" }}>
          <Burger opened={isBurgerOpen} onClick={onBurgerClick} mr="xl" />
        </MediaQuery>
        <PageTitle />
        <div className={classes.actions}>
          <NotificationDropdown />
          <Space w="md" />
          <UserMenu />
        </div>
      </Container>
    </div>
  );
}

export default Header;
