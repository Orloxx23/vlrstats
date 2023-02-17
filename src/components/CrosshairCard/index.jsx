import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import Icon from "../Icon";
import "./crosshairCard.css";
import "./heartIcon.css";

export default function CrosshairCard({ item, loading, setLoading }) {
  const { user } = React.useContext(AuthContext);

  const [userData, setUserData] = React.useState(null);
  const [isFav, setIsFav] = React.useState(
    item?.favoritesBy?.includes(user?.id)
  );

  const [loadingFav, setLoadingFav] = React.useState(false);
  const [favs, setFavs] = React.useState(item?.favs || 0);

  const copyCode = () => {
    navigator.clipboard.writeText(item?.code);
    toast.success("Copied to clipboard!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
    });
  };

  const getUserData = async () => {
    if (item) {
      const docRef = doc(db, "users", item?.user);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // console.error("Something's wrong!");
      }
    }
  };

  const handleFav = async () => {
    setLoadingFav(true);
    if (user) {
      const userRef = doc(db, "crosshairs", item?.id);

      if (!isFav) {
        await updateDoc(userRef, {
          favoritesBy: arrayUnion(user.id || JSON.parse(user).id),
          favs: item?.favoritesBy.length + 1 ,
        });
        setFavs(favs + 1);
        setIsFav(true);
      } else {
        await updateDoc(userRef, {
          favoritesBy: item?.favoritesBy.filter(
            (fav) => fav !== (user.id || JSON.parse(user).id)
          ),
          favs: item?.favoritesBy.length - 1,
        });
        setFavs(favs - 1);
        setIsFav(false);
      }
    } else {
      toast.error(
        "You need to be logged in to add a crosshair to your favorites",
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
        }
      );
    }
    setLoadingFav(false);
  };

  React.useEffect(() => {
    if(user){
      setIsFav(item?.favoritesBy?.includes(user?.id || JSON.parse(user).id));
    }
  }, []);

  React.useEffect(() => {
    getUserData();
  }, [item]);

  return (
    <div className={loading ? "crosshair-card-loading" : "crosshair-card"}>
      <div className="crosshair-card__image">
        <img src={item?.preview} alt={item?.name} draggable={false} onLoadStart={() => setLoading(true)} onLoad={() => setLoading(false)} />
      </div>
      <div className="crosshair-card__info">
        <div className="crosshair-card__info-left">
          <div className="crosshair-card__info__name">{item?.name}</div>
          <div className="crosshair-card__info__author">
            by <span>{userData?.username}</span>
          </div>
        </div>
        <div className="crosshair-card__info-right">
          <div className="crosshair-card__info__copy" onClick={copyCode}>
            <Icon icon={"copy"} />
          </div>
          <div className="crosshair-card__info__favs" onClick={handleFav}>
            <label className="container">
              <input
                type="checkbox"
                disabled={user ? (loadingFav ? true : false) : true}
              />
              <div className="checkmark">
                <svg viewBox="0 0 256 256">
                  <rect fill="none" height="256" width="256"></rect>
                  <path
                    d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
                    strokeWidth="20px"
                    stroke={isFav ? "#ff5353" : "#FFF"}
                    fill={isFav ? "#ff5353" : "none"}
                  ></path>
                </svg>
              </div>
            </label>
            {favs}
          </div>
        </div>
      </div>
    </div>
  );
}
