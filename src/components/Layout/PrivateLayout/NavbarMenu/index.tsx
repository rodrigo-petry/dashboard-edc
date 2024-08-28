import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Container, Navbar, Text } from '@mantine/core';
import {
  FaChartLine,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaChartPie,
} from 'react-icons/fa';

import NavbarMenuTitle from './NavbarMenuTitle';
import NavbarMenuLink from './NavbarMenuLink';

import useStyles from './styles';

interface NavMenuRoute {
  name: string;
  pathname: string;
  icon?: ReactNode;
}

const routes: NavMenuRoute[] = [
  {
    name: 'Dashboard',
    pathname: '/dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 9H13.5L11.25 15.75L6.75 2.25L4.5 9H1.5" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    
  },
  {
    name: 'Visão Geral',
    pathname: '/geral',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2879 6.75H4.125C3.08947 6.75 2.25 5.91053 2.25 4.875C2.25 3.83947 3.08947 3 4.125 3H11.2879M6.71212 15H13.875C14.9105 15 15.75 14.1605 15.75 13.125C15.75 12.0895 14.9105 11.25 13.875 11.25H6.71212M2.25 13.125C2.25 14.5747 3.42525 15.75 4.875 15.75C6.32475 15.75 7.5 14.5747 7.5 13.125C7.5 11.6753 6.32475 10.5 4.875 10.5C3.42525 10.5 2.25 11.6753 2.25 13.125ZM15.75 4.875C15.75 6.32475 14.5747 7.5 13.125 7.5C11.6753 7.5 10.5 6.32475 10.5 4.875C10.5 3.42525 11.6753 2.25 13.125 2.25C14.5747 2.25 15.75 3.42525 15.75 4.875Z" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
  },
  {
    name: 'Análise de Contrato',
    pathname: '/analise-de-contrato',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_199_187)">
    <path d="M9 1.5V3.375M9 1.5C4.85786 1.5 1.5 4.85786 1.5 9M9 1.5C13.1421 1.5 16.5 4.85786 16.5 9M9 14.625V16.5M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9M9 16.5C4.85786 16.5 1.5 13.1421 1.5 9M3.375 9H1.5M16.5 9H14.625M14.3088 14.3088L12.9785 12.9785M3.69122 14.3088L5.02286 12.9772M3.69122 3.75L4.99356 5.05234M14.3088 3.75L10.1249 7.875M10.5 9C10.5 9.82843 9.82843 10.5 9 10.5C8.17157 10.5 7.5 9.82843 7.5 9C7.5 8.17157 8.17157 7.5 9 7.5C9.82843 7.5 10.5 8.17157 10.5 9Z" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0_199_187">
    <rect width="18" height="18" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    , 
  },
  {
    name: 'Análise de Consumo',
    pathname: '/analise-de-consumo',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_199_191)">
    <path d="M15.9 16.5C16.11 16.5 16.215 16.5 16.2952 16.4591C16.3658 16.4232 16.4232 16.3658 16.4591 16.2952C16.5 16.215 16.5 16.11 16.5 15.9V8.1C16.5 7.88998 16.5 7.78497 16.4591 7.70475C16.4232 7.63419 16.3658 7.57683 16.2952 7.54087C16.215 7.5 16.11 7.5 15.9 7.5L14.1 7.5C13.89 7.5 13.785 7.5 13.7048 7.54087C13.6342 7.57682 13.5768 7.63419 13.5409 7.70475C13.5 7.78497 13.5 7.88998 13.5 8.1V9.9C13.5 10.11 13.5 10.215 13.4591 10.2952C13.4232 10.3658 13.3658 10.4232 13.2952 10.4591C13.215 10.5 13.11 10.5 12.9 10.5H11.1C10.89 10.5 10.785 10.5 10.7048 10.5409C10.6342 10.5768 10.5768 10.6342 10.5409 10.7048C10.5 10.785 10.5 10.89 10.5 11.1V12.9C10.5 13.11 10.5 13.215 10.4591 13.2952C10.4232 13.3658 10.3658 13.4232 10.2952 13.4591C10.215 13.5 10.11 13.5 9.9 13.5H8.1C7.88998 13.5 7.78497 13.5 7.70475 13.5409C7.63419 13.5768 7.57682 13.6342 7.54087 13.7048C7.5 13.785 7.5 13.89 7.5 14.1V15.9C7.5 16.11 7.5 16.215 7.54087 16.2952C7.57682 16.3658 7.63419 16.4232 7.70475 16.4591C7.78497 16.5 7.88998 16.5 8.1 16.5L15.9 16.5Z" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 5.1C7.5 4.88998 7.5 4.78497 7.54087 4.70475C7.57682 4.63419 7.63419 4.57682 7.70475 4.54087C7.78497 4.5 7.88998 4.5 8.1 4.5H9.9C10.11 4.5 10.215 4.5 10.2952 4.54087C10.3658 4.57682 10.4232 4.63419 10.4591 4.70475C10.5 4.78497 10.5 4.88998 10.5 5.1V6.9C10.5 7.11002 10.5 7.21503 10.4591 7.29525C10.4232 7.36581 10.3658 7.42317 10.2952 7.45913C10.215 7.5 10.11 7.5 9.9 7.5H8.1C7.88998 7.5 7.78497 7.5 7.70475 7.45913C7.63419 7.42317 7.57682 7.36581 7.54087 7.29525C7.5 7.21503 7.5 7.11002 7.5 6.9V5.1Z" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.25 9.6C2.25 9.38998 2.25 9.28497 2.29087 9.20475C2.32682 9.13419 2.38419 9.07682 2.45475 9.04087C2.53497 9 2.63998 9 2.85 9H4.65C4.86002 9 4.96503 9 5.04525 9.04087C5.11581 9.07682 5.17317 9.13419 5.20913 9.20475C5.25 9.28497 5.25 9.38998 5.25 9.6V11.4C5.25 11.61 5.25 11.715 5.20913 11.7952C5.17317 11.8658 5.11581 11.9232 5.04525 11.9591C4.96503 12 4.86002 12 4.65 12H2.85C2.63998 12 2.53497 12 2.45475 11.9591C2.38419 11.9232 2.32682 11.8658 2.29087 11.7952C2.25 11.715 2.25 11.61 2.25 11.4V9.6Z" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 2.1C1.5 1.88998 1.5 1.78497 1.54087 1.70475C1.57683 1.63419 1.63419 1.57683 1.70475 1.54087C1.78497 1.5 1.88998 1.5 2.1 1.5H3.9C4.11002 1.5 4.21503 1.5 4.29525 1.54087C4.36581 1.57683 4.42317 1.63419 4.45913 1.70475C4.5 1.78497 4.5 1.88998 4.5 2.1V3.9C4.5 4.11002 4.5 4.21503 4.45913 4.29525C4.42317 4.36581 4.36581 4.42317 4.29525 4.45913C4.21503 4.5 4.11002 4.5 3.9 4.5H2.1C1.88998 4.5 1.78497 4.5 1.70475 4.45913C1.63419 4.42317 1.57683 4.36581 1.54087 4.29525C1.5 4.21503 1.5 4.11002 1.5 3.9V2.1Z" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
    <clipPath id="clip0_199_191">
    <rect width="18" height="18" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    
    , 
  },
  {
    name: 'Monitores',
    pathname: '/monitors',
    icon: <FaTachometerAlt color='#FF9700' />,
  },
  {
    name: 'Alertas',
    pathname: '/alert-history',
    icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.01563 15.75C7.54448 16.2168 8.23917 16.5 9 16.5C9.76084 16.5 10.4555 16.2168 10.9844 15.75M13.5 6C13.5 4.80653 13.0259 3.66193 12.182 2.81802C11.3381 1.97411 10.1935 1.5 9 1.5C7.80653 1.5 6.66193 1.97411 5.81802 2.81802C4.97411 3.66193 4.5 4.80653 4.5 6C4.5 8.31764 3.91535 9.90447 3.26225 10.9541C2.71134 11.8394 2.43589 12.2821 2.44599 12.4056C2.45718 12.5423 2.48614 12.5944 2.59633 12.6762C2.69584 12.75 3.14444 12.75 4.04164 12.75H13.9584C14.8556 12.75 15.3042 12.75 15.4037 12.6762C15.5139 12.5944 15.5428 12.5423 15.554 12.4056C15.5641 12.2821 15.2887 11.8394 14.7378 10.9541C14.0846 9.90447 13.5 8.31764 13.5 6Z" stroke="#FF9700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    , 
  },
 
];

interface HeaderProps {
  isBurgerOpen: boolean;
  onBurgerClick: () => void;
  closeNavbar: () => void;
}

function NavbarMenu({ isBurgerOpen, onBurgerClick, closeNavbar }: HeaderProps) {
  const { pathname } = useRouter();
  const { classes } = useStyles();

  const activePath = `/${pathname.split('/')[1]}`;

  return (
    <div className={classes.navbarMenuWrapper}>
      <Container fluid className={classes.navbarMenu}>
      
        <Navbar.Section>
          <NavbarMenuTitle
            isBurgerOpen={isBurgerOpen}
            onBurgerClick={onBurgerClick}
          />
        </Navbar.Section>
        <Navbar.Section grow mt="md">
          {routes.map((route) => (
            <NavbarMenuLink
              key={route.pathname}
              pathname={route.pathname}
              label={route.name}
              icon={route.icon}
              active={activePath === route.pathname}
              onLinkClickCallback={closeNavbar}
            />
          ))}
        </Navbar.Section>
        <Navbar.Section>
          <Text color="dimmed" size="xs" align="center">
            Energia das Coisas &copy;
          </Text>
        </Navbar.Section>
      </Container>
    </div>
  );
}

export default NavbarMenu;
