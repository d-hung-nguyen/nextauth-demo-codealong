import Layout from "@/components/Layout";
import GlobalStyle from "../styles";
import useSWR, { SWRConfig } from "swr";
import { useState } from "react";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function App({ Component, pageProps }) {
  const { data: ponies, error, isLoading } = useSWR("/api/ponies", fetcher);
  const [favorites, setFavorites] = useState([]);

  function toggleFavorite(id) {
    const foundEntry = favorites.find((favorite) => favorite === id);
    if (foundEntry) {
      setFavorites(favorites.filter((favorite) => favorite !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  }

  return (
    <>
      <GlobalStyle />
      <SWRConfig value={{ fetcher }}>
        <Layout>
          <Component
            {...pageProps}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            ponies={ponies}
            error={error}
            isLoading={isLoading}
          />
        </Layout>
      </SWRConfig>
    </>
  );
}
