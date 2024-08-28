import { NextPage } from "next";
import Image from "next/image";
import { Col, Grid } from "@mantine/core";
import { createStyles } from "@mantine/styles";

import LoginForm from "@components/Login/Form";
import Footer from "@components/Login/Footer";

import logo from "@images/logo_full.png";

const useStyles = createStyles((theme) => {
  const dark = theme.colorScheme === "dark";

  return {
    wrapper: {
      minHeight: "100vh",
      backgroundColor: dark ? theme.colors.dark[7] : theme.white,
    },

    grid: {
      minHeight: "100vh",
    },

    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    banner: {
      backgroundColor: dark ? theme.colors.dark[8] : theme.colors.gray[2],
    },

    image: {
      width: "280px",

      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        width: "360px",
      },
    },

    login: {
      display: "flex",
      flexDirection: "column",
    },
  };
});

const LoginPage: NextPage = () => {
  const { classes, cx } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Grid gutter={0} className={classes.grid}>
        <Col span={12} sm={6} className={cx(classes.center, classes.banner)}>
          <div className={classes.image}>
            <Image src={logo} alt="Energia das Coisas" />
          </div>
        </Col>
        <Col span={12} sm={6} className={cx(classes.center, classes.login)}>
          <LoginForm />
          <Footer />
        </Col>
      </Grid>
    </div>
  );
};

export default LoginPage;
