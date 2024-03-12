import Card from "@/components/Card";
import List from "@/components/List";

export default function HomePage({ error, isLoading, ponies }) {
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div>
      <h1>Welcome to My Little Pony: Friendship is Magic</h1>
      <List>
        {ponies.map((pony) => {
          return <Card key={pony._id} pony={pony} />;
        })}
      </List>
    </div>
  );
}
