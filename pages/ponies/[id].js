import DetailCard from "@/components/DetailCard";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function DetailPage({ toggleFavorite, favorites }) {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: pony,
    error,
    isLoading,
  } = useSWR(id ? `/api/ponies/${id}` : null);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  if (!pony) return null;

  const isFavorite = favorites.includes(id);

  return (
    <DetailCard
      id={id}
      toggleFavorite={toggleFavorite}
      isFavorite={isFavorite}
      pony={pony}
    />
  );
}
