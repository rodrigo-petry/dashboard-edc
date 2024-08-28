import { ReactNode, useEffect, useState } from "react";
import { AppShell, Navbar } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import NavbarMenu from "./NavbarMenu";
import Header from "./Header";
import Content from "./Content";

import useStyles, {
  NAVBAR_CLOSED_BREAKPOINT,
  NAVBAR_COLLAPSED_WIDTH,
  NAVBAR_WIDTH,
} from "./styles";

interface PrivateLayoutProps {
  children: ReactNode;
}

function PrivateLayout({ children }: PrivateLayoutProps) {
  const { classes } = useStyles();

  const mq = useMediaQuery(`(max-width: ${NAVBAR_CLOSED_BREAKPOINT}px)`);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!mq) {
      setDrawerOpen(true);
    }
  }, [mq]);

  function handleDrawerAction() {
    setDrawerOpen((prev) => !prev);
  }

  function closeNavbar() {
    setDrawerOpen((prev) => (!mq ? prev : !prev));
  }

  return (
    <AppShell
      fixed
      navbarOffsetBreakpoint="sm"
      padding={-30}
      navbar={
        <Navbar
          hiddenBreakpoint="sm"
          hidden={!drawerOpen}
          width={{
            md: NAVBAR_COLLAPSED_WIDTH,
            lg: 100,
          }}
          style={{
            marginLeft: "-30px",
          }}
          styles={{
            root: {
              borderRight: 0,
              transition: "opacity .20s linear",

              "&.mantine-Navbar-hidden": {
                display: "block",
                visibility: "hidden",
                opacity: 0,
              },
            },
          }}
        >
          <NavbarMenu
            isBurgerOpen={drawerOpen}
            onBurgerClick={handleDrawerAction}
            closeNavbar={closeNavbar}
          />
        </Navbar>
      }
    >
      <div className={classes.wrapper}>
        <Header isBurgerOpen={drawerOpen} onBurgerClick={handleDrawerAction} />
        <Content>{children}</Content>
      </div>
    </AppShell>
  );
}

export default PrivateLayout;
