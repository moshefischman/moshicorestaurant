import React, { useState } from "react";

import Main from "./components/main";
import Book from "./components/book";
import Reserved from "./components/reserved";
import ThankYou from "./components/thankYou";
import Navbar from "./components/navbar";

export default _ => {
  const [page, setPage] = useState(0);

  return (
    <div>
      <Navbar setPage={setPage} />
      {page === 0 ? <Main setPage={setPage} /> : null}
      {page === 1 ? <Book setPage={setPage} /> : null}
      {page === 2 ? <Reserved setPage={setPage} /> : null}
      {page === 3 ? <ThankYou /> : null}
    </div>
  );
};
