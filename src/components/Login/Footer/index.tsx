import { Anchor, Divider, Text } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/styles";

import useStyles from "./styles";

const Footer: React.FC = () => {
  const { classes } = useStyles();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const dark = colorScheme === "dark";

  return (
    <div className={classes.wrapper}>
      <Text size="sm" color="gray">
        Energia das Coisas&reg;
      </Text>
      <Divider orientation="vertical" mx="sm" />
      <Anchor
        onClick={() => {
          toggleColorScheme();
        }}
      >
        {dark ? (
          <Text size="sm" variant="link">
            Modo Claro
          </Text>
        ) : (
          <Text size="sm" variant="link">
            Modo Escuro
          </Text>
        )}
      </Anchor>
    </div>
  );
};

export default Footer;
