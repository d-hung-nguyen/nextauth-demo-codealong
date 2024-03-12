import Link from "next/link";
import styled from "styled-components";

export default function Footer() {
  return (
    <Navigation>
      <List>
        <ListItem>
          <StyledLink href="/">Home</StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink href="/favorite">Favorites</StyledLink>
        </ListItem>
      </List>
    </Navigation>
  );
}

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #eee;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const List = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
`;

const ListItem = styled.li`
  flex: 1;
  display: flex;
`;

const StyledLink = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
`;
