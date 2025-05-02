import { useContext, createContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

// Create a context for authentication
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  // Function to update the authentication token (log in)
  const login = async (data) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      const res = await response.json();

      if(res.accessToken) {
        localStorage.setItem("user", JSON.stringify(res));
        setUser(res);
        setAuthToken(res.accessToken);
        localStorage.setItem("token", res.accessToken);
        navigate(`/${res.role[0]}-dashboard`)
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error("Error fetching response, ", err)
    }

  };

  // Function to log out (clear token)
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/")
  };

  return (
    <AuthContext.Provider value={{authToken, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
