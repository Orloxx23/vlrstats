import axios from "axios";
import React, { useEffect } from "react";
import { baseApi } from "../../api";

const SearchContext = React.createContext();

function SearchProvider(props) {
  return (
    <SearchContext.Provider value={{}}>{props.children}</SearchContext.Provider>
  );
}

export { SearchContext, SearchProvider };
