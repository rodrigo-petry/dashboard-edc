import { ActionIcon, Divider, Menu, ThemeIcon } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/styles";
import {
  ExitIcon,
  GearIcon,
  MoonIcon,
  PersonIcon,
  SunIcon,
} from "@modulz/radix-icons";

import { useLogout } from "@core/domain/Auth/Auth.hooks";
import { useEffect, useState } from "react";
import { useUser } from "@core/domain/Dashboards/Dashboards.hooks";
import { User } from "@core/domain/Dashboards/Dashboards.types";

const UserMenu: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { data } = useUser();

  const logout = useLogout();

  const handleLogoutClick = () => {
    logout();
  };

  // const [user, setUser] = useState<User>()

  // console.log(data)

  return (
    <Menu
      position="bottom"
      placement="end"
      gutter={19}
      control={
        <ActionIcon radius="xl" size="lg" variant="filled">
          <PersonIcon />
        </ActionIcon>
      }
    >
      <Menu.Label mt="xs">
        <ThemeIcon radius={24} size="xl" color="gray">
          <PersonIcon />
        </ThemeIcon>
      </Menu.Label>
      <Menu.Label style={{ margin: "auto" }}>{data?.email}</Menu.Label>
      <Divider />
      
      <Divider />
      <Menu.Item icon={<ExitIcon />} color="red" onClick={handleLogoutClick}>
        Sair
      </Menu.Item>
    </Menu>
  );
};

export default UserMenu;
