import styled from "styled-components";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Main>{children}</Main>
      <Footer />
    </>
  );
}

const Main = styled.main`
  margin-bottom: 5rem;
`;
