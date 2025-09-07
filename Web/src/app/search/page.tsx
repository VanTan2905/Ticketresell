import React, { Suspense } from "react";
import SearchPage from "@/Components/Search";
import "@/Css/Search.css";

const Search = () => {
  return (
    <div className="home">
      {/* <Background test={<Ads />} /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPage />
      </Suspense>
      <div></div>
    </div>
  );
};

export default Search;
