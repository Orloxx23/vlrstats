import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import Router from "./routes";

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <Router />
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
