import React from "react";
import { Icon } from "../../components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Region() {
  const { user, getUser } = React.useContext(AuthContext);
  const [region, setRegion] = React.useState(user?.region || "na");

  const updateRegion = async () => {
    if (!user){
        toast.info("You need to log in to change the region", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
          });
        return;
    };
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      region: region,
    })
      .then(() => {
        getUser(user.id);
        toast.success("Region updated", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
        });
      })
      .catch((error) => {
        toast.error("Error updating region", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
        });
      });
  };

  return (
    <div className="settings-region">
      <p>Region</p>
      <div className="settings-region__form">
        <select
          className="settings-region__select"
          onChange={(e) => setRegion(e.target.value)}
          value={region}
          disabled={!user}
        >
          <option value="na">America</option>
          <option value="ap">Asia</option>
          <option value="br">Brazil</option>
          <option value="eu">Europe</option>
          <option value="latam">Latam</option>
          <option value="kr">Korea</option>
        </select>
        <button
          className="settings-region__form__button"
          onClick={updateRegion}
        >
          <Icon icon="floppy-disk" />
        </button>
      </div>
    </div>
  );
}
