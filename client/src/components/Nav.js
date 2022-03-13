import React from 'react';
import { Link } from '@reach/router';
import { useMoralis } from 'react-moralis';

import { IconUser, IconMicrophone, IconMusic } from './icons';

import styled from 'styled-components/macro';
import { theme, mixins, media } from '../styles';
import { useAppContext } from '../utils/stateContext';
const { colors, fontSizes } = theme;

const Container = styled.nav`
  ${mixins.coverShadow};
  ${mixins.flexBetween};
  flex-direction: column;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: ${theme.navWidth};
  background-color: ${colors.navBlack};
  text-align: center;
  z-index: 99;
  ${media.tablet`
    top: auto;
    bottom: 0;
    right: 0;
    width: 100%;
    min-height: ${theme.navHeight};
    height: ${theme.navHeight};
    flex-direction: row;
  `};
  & > * {
    width: 100%;
    ${media.tablet`
      height: 100%;
    `};
  }
`;
const Logo = styled.div`
  color: ${colors.green};
  margin-top: 30px;
  width: 70px;
  height: 70px;
  transition: ${theme.transition};
  ${media.tablet`
    display: none;
  `};
  &:hover,
  &:focus {
    color: ${colors.offGreen};
  }
  svg {
    width: 50px;
  }
`;
const Github = styled.div`
  color: ${colors.lightGrey};
  width: 45px;
  height: 45px;
  margin-bottom: 30px;
  ${media.tablet`
    display: none;
  `};
  a {
    &:hover,
    &:focus,
    &.active {
      color: ${colors.blue};
    }
    svg {
      width: 30px;
    }
  }
`;
const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  ${media.tablet`
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
  `};
`;
const LogoutButton = styled.a`
  background-color: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.white};
  border-radius: 30px;
  height: 50px;
  font-size: ${fontSizes.xs};
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-top: 10%;
  &:hover,
  &:focus {
    background-color: ${colors.white};
    color: ${colors.black};
  }
`;
const MenuItem = styled.li`
  color: ${colors.lightGrey};
  font-size: 11px;
  ${media.tablet`
    flex-grow: 1;
    flex-basis: 100%;
    height: 100%;
  `};
  a {
    display: block;
    padding: 15px 0;
    border-left: 5px solid transparent;
    width: 100%;
    height: 100%;
    ${media.tablet`
      ${mixins.flexCenter};
      flex-direction: column;
      padding: 0;
      border-left: 0;
      border-top: 3px solid transparent;
    `};
    &:hover,
    &:focus,
    &.active {
      color: ${colors.white};
      background-color: ${colors.black};
      border-left: 5px solid ${colors.offGreen};
      ${media.tablet`
        border-left: 0;
        border-top: 3px solid ${colors.offGreen};
      `};
    }
  }
  svg {
    width: 20px;
    height: 20px;
    margin-bottom: 7px;
  }
`;

const isActive = ({ isCurrent }) => (isCurrent ? { className: 'active' } : null);

const NavLink = props => <Link getProps={isActive} {...props} />;

function Nav() {
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
  const { address, setAddress } = useAppContext();

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: 'Log in using Moralis' })
        .then(function (user) {
          console.log('logged in user:', user);
          console.log(user.get('ethAddress'));
          setAddress(user.get('ethAddress'));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const logOut = async () => {
    await logout();
    console.log('logged out');
  };

  return (
    <Container>
      <Logo>
        <Link to="/">
          <img src="https://ipfs.io/ipfs/bafkreih5wta6oiq76z3l4dsolozgbykhsdyalyy2dddkfy4zh5kqgffxfy"></img>
        </Link>
      </Logo>
      {isAuthenticated ? (
        <LogoutButton onClick={logOut}>Logout</LogoutButton>
      ) : (
        <LogoutButton onClick={login}>Connect Wallet</LogoutButton>
      )}
      <Menu>
        <MenuItem>
          <NavLink to="/">
            <IconUser />
            <div>Profile</div>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/test">
            <IconMicrophone />
            <div>Top Artist</div>
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="tracks">
            <IconMusic />
            <div>Top Track</div>
          </NavLink>
        </MenuItem>
      </Menu>
      <Github></Github>
    </Container>
  );
}

export default Nav;
