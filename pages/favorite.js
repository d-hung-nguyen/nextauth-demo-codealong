import Card from "@/components/Card";
import List from "@/components/List";

export default function Favorite({ favorites, ponies = [] }) {
  const favoritePonies = ponies.filter((pony) => favorites.includes(pony._id));
  return (
    <>
      <h2>Your Favorite Little Ponies</h2>
      <List>
        {favoritePonies.map((pony) => {
          return <Card key={pony._id} pony={pony} />;
        })}
      </List>
    </>
  );
}
