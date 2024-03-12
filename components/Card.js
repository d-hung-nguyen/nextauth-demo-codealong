import Image from "next/image";
import ImageContainer from "./ImageContainer";
import Link from "next/link";

export default function Card({ pony }) {
  return (
    <li>
      <figure>
        <ImageContainer as={Link} href={`/ponies/${pony._id}`}>
          <Image
            alt={`image of ${pony.name}`}
            fill
            src={pony.image[0]}
            sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
          />
        </ImageContainer>
        <figcaption>{pony.name}</figcaption>
      </figure>
    </li>
  );
}
