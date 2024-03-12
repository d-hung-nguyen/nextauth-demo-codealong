import styled from "styled-components";

export default styled.button`
  position: relative;
  width: 60px;
  height: 60px;
  background-color: ${({ $isFavorite }) =>
    $isFavorite ? "#f44336" : "#bcc8bd"};
  border: none;
  cursor: pointer;
  border-radius: 50% 0 0 0;
  transform: rotate(45deg);
  transition: background-color 0.3s;
  -webkit-tap-highlight-color: transparent;

  padding: 0;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: ${({ $isFavorite }) =>
      $isFavorite ? "#f44336" : "#bcc8bd"};
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  &::before {
    top: 10px;
    left: -20px;
  }

  &::after {
    right: 0;
    top: -20px;
  }
`;
