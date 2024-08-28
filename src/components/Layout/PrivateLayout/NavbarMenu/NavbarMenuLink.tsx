import { Group, Text, ThemeIcon, Tooltip, UnstyledButton } from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const useStyles = createStyles((theme) => ({
  button: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },

    "&.--active": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3],
    },
  },

  linkText: {
    [`@media (min-width: ${theme.breakpoints.md}px) and (max-width: ${theme.breakpoints.lg}px)`]:
      {
        display: "none",
      },
  },
}));

interface NavbarMenuLinkProps {
  label: string;
  pathname: string;
  icon?: ReactNode;
  active?: boolean;
  onLinkClickCallback?: () => void;
}

function NavbarMenuLink({
  label,
  pathname,
  icon,
  active,
  onLinkClickCallback,
}: NavbarMenuLinkProps) {
  const router = useRouter();
  const { classes, cx } = useStyles();

  function handleLinkClick() {
    if (onLinkClickCallback) {
      onLinkClickCallback();
    }

    router.push(pathname);
  }

  const className = cx(classes.button, active ? "--active" : "");

  return (
    <Tooltip label={label} style={{ width: "100%", marginBottom: "4px" }}>
      <UnstyledButton className={className} onClick={handleLinkClick}>
        <Group>
          {icon ? (
            <ThemeIcon
              sx={(theme) => ({
                backgroundColor: "transparent",
                color: theme.colors.brand[4],
              })}
            >
              {icon}
            </ThemeIcon>
          ) : null}

          <Text className={classes.linkText} size="sm">
            {label}
          </Text>
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}

export default NavbarMenuLink;
