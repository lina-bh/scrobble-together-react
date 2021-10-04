import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

const AuthProvider = (props) => {
  const [key, setKey] = useState(null);
  const [name, setName] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let name, key;
    if (
      (name = localStorage.getItem("name")) &&
      (key = localStorage.getItem("key"))
    ) {
      setKey(key);
      setName(name);
    }
    setLoaded(true);
  }, []);

  const login = ({ name, key }) => {
    setName(name);
    setKey(key);
    localStorage.setItem("name", name);
    localStorage.setItem("key", key);
  };

  const logout = () => {
    localStorage.removeItem("key", null);
    localStorage.removeItem("name", null);
    setKey(null);
    setName(null);
  };

  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ name, key, login, logout }} {...props} />
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
