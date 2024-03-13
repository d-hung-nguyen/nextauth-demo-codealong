import Link from "next/link";
import HiddenElement from "./HiddenElement";
import Button from "./Button";
import Image from "next/image";
import styled from "styled-components";

export default function DetailCard({ id, pony, toggleFavorite, isFavorite }) {
  return (
    <section>
      <h2>{pony.name}</h2>
      <Container>
        <Image
          alt={`image of ${pony.name}`}
          width={200}
          height={200}
          src={pony.image[0]}
        />
        <Button
          type="button"
          onClick={() => toggleFavorite(id)}
          $isFavorite={isFavorite}
          aria-label={isFavorite ? "Unmark as favorite" : "Mark as favorite"}
        >
          <HiddenElement>
            {isFavorite ? "Unmark" : "Mark"} as favorite
          </HiddenElement>
        </Button>
      </Container>
      <h3>Occupation: </h3>
      <ul>
        {pony.occupation?.split("\n").map((entry, index) => {
          return <li key={index}>{entry}</li>;
        })}
      </ul>
      <h3>Residence</h3>
      <ul>
        {pony.residence?.split("\n").map((entry, index) => {
          return <li key={index}>{entry}</li>;
        })}
      </ul>
      <Link href="/">&larr; Back Home</Link>
    </section>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
