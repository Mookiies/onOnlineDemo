import React, { useState, useMemo } from "react";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider
} from "urql";

import { offlineExchange } from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import { Todos } from "./components";

const storage = makeDefaultStorage({
  idbName: "graphcache-v3", // The name of the IndexedDB database
  maxAge: 7 // The maximum age of the persisted data in days
});

const cache = offlineExchange({
  storage
});

const clientConfig = {
  url: "https://0ufyz-4000.sse.codesandbox.io",
  exchanges: [
    dedupExchange,
    cache,
    fetchExchange
  ],
  requestPolicy: "cache-first"
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleLoggedIn = () => {
    setIsLoggedIn((previousValue) => !previousValue);
  };
  const client = useMemo(() => {
    if (!isLoggedIn) {
      return null;
    }

    console.log('createClient');
    return createClient(clientConfig);
  }, [isLoggedIn]);

  const app = <Provider value={client}>
     <Todos />
  </Provider>

  return (
      <main>
        <button onClick={toggleLoggedIn}>Toggle login</button>
        {isLoggedIn && app}
      </main>
  );
};

export default App;
