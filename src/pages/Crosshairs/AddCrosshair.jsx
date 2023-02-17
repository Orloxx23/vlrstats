import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader } from "../../components";
import { db, storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function AddCrosshair({ show, setShow }) {
  const { user } = React.useContext(AuthContext);

  const [crosshairName, setCrosshairName] = React.useState("");
  const [crosshairCode, setCrosshairCode] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let regex = new RegExp("[a-zA-Z0-9]*;[a-zA-Z0-9]");

    setCrosshairCode("");
    setCrosshairName("");

    if (regex.test(crosshairCode)) {
      await axios
        .get(
          `https://api.henrikdev.xyz/valorant/v1/crosshair/generate?id=${crosshairCode}`,
          { responseType: "blob" }
        )
        .then((res) => {
          const file = res.data;
          const d = new Date();
          const crosshairDate = d.getTime();
          const storageRef = ref(storage, crosshairDate + "");

          uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then(async (url) => {
                const newCrosshair = {
                  name: crosshairName,
                  code: crosshairCode,
                  date: crosshairDate,
                  preview: url,
                  favoritesBy: [],
                  favs: 0,
                  user: user.id || JSON.parse(user).id,
                };
                // console.log(newCrosshair);
                const docRef = await addDoc(
                  collection(db, "crosshairs"),
                  newCrosshair
                );
              })
              .catch((err) => {
                toast.error("It could not send", {
                  position: "bottom-right",
                  autoClose: 2000,
                  hideProgressBar: true,
                  theme:
                    localStorage.getItem("theme") === "dark" ? "dark" : "light",
                });
              });
          });
          toast.success("Crosshair added", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
          });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("It could not send", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
          });
          console.error(err);
        });
    } else {
      setLoading(false);
      toast.error("Invalid crosshair code", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
      });
    }
    setShow(false);
    
  };
  return (
    <div className={`addcrosshair-container ${show ? "" : "hide"}`}>
      {user ? (
        <form onSubmit={(e) => handleSubmit(e)} noValidate={false}>
          <div className="addcrosshair-inputs">
            <input
              type="text"
              onChange={(e) => setCrosshairName(e.target.value)}
              placeholder="Crosshair Name"
              required
            />
            <input
              type="text"
              onChange={(e) => setCrosshairCode(e.target.value)}
              placeholder="Crosshair code"
              required
            />
          </div>
          <button type="submit">
            {loading ? <Loader size={15} /> : "Add"}
          </button>
        </form>
      ) : (
        <div className="addcrosshair-login">
          <span>You need to login to add a crosshair</span>
          <div className="addcrosshair-account">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      )}
    </div>
  );
}
