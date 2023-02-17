/* eslint-disable react-hooks/exhaustive-deps */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../../firebase";
import { ThemeContext } from "../ThemeContext";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(localStorage.getItem("user") || null);
  // const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { theme, changeTheme } = useContext(ThemeContext);

  let navigate = useNavigate();

  const createAccount = (username, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const newUser = { id: user.uid, email: user.email, username: username };
        if (saveUser(newUser)) {
          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
          toast.success("Account created successfully");
          navigate("/", { replace: true });
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        let message = "";
        switch (errorCode) {
          case "auth/email-already-in-use":
            message = "Email already in use";
            break;
          case "auth/invalid-email":
            message = "Invalid email";
            break;
          case "auth/weak-password":
            message = "Password is too weak";
            break;
          default:
            message = errorMessage;
            break;
        }
        toast.error(message, { theme: theme === "dark" ? "dark" : "light" });
        setLoading(false);
      });
  };

  const saveUser = async (user) => {
    try {
      await setDoc(doc(db, "users", user.id), user);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      return false;
    }
  };

  const login = (email, password) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        getUser(user.uid);
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        let message = "";
        switch (errorCode) {
          case "auth/invalid-email":
            message = "Invalid email";
            break;
          case "auth/user-disabled":
            message = "User disabled";
            break;
          case "auth/user-not-found":
            message = "User not found";
            break;
          case "auth/wrong-password":
            message = "Wrong password";
            break;
          default:
            message = errorMessage;
            break;
        }
        toast.error(message);
        setLoading(false);
      });
  };

  const getUser = async (id) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      localStorage.setItem("user", JSON.stringify(docSnap.data()));
      setUser(docSnap.data());
      navigate("/", { replace: true });
    } else {
      console.log("No such document!");
    }
    setLoading(false);
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("playerData");
        changeTheme("default");
      })
      .catch((error) => {
        // An error happened.
      });
  };

 /* useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {

        navigate("/", { replace: true });
      } else {
        // User is signed out
        navigate("/login", { replace: true });
      }
    });
  }, []);*/

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        createAccount,
        login,
        logout,
      }}
    >
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
