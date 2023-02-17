import React from "react";
import "./crosshairs.css";
import Icon from "../../components/Icon";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
  endBefore,
  orderBy,
  endAt,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CrosshairCard } from "../../components";
import AddCrosshair from "./AddCrosshair";
import { AuthContext } from "../../context/AuthContext";

const sort = ["new", "popular", "favorites", "mine"];

export default function Crosshairs() {
  const { user } = React.useContext(AuthContext);

  const [sortSelected, setSortSelected] = React.useState("new");
  const [loading, setLoading] = React.useState(true);

  const [showCrosshairInput, setShowCrosshairInput] = React.useState(false);

  const [list, setList] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);

  const [lastVisible, setLastVisible] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const q = query({ ...sortToQuery() }, limit());
      const querySnapshot = await getDocs(q);
      setTotalItems(querySnapshot.size);
    })();
  }, [sortSelected]);

  React.useEffect(() => {
    setPage(1);
  }, [sortSelected]);

  React.useEffect(() => {
    (async () => {
      setList([]);
      setLoading(true);
      const q = sortToQuery();
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setList((prev) => [...prev, { ...doc.data(), id: doc.id }]);
      });
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisible);

      setLoading(false);
    })();
  }, [sortSelected]);

  const sortToQuery = () => {
    switch (sortSelected) {
      case "new":
        return query(
          collection(db, "crosshairs"),
          orderBy("date", "desc"),
          limit(6)
        );
      case "popular":
        return query(
          collection(db, "crosshairs"),
          orderBy("favs", "desc"),
          limit(6)
        );
      case "favorites":
        return query(
          collection(db, "crosshairs"),
          where(
            "favoritesBy",
            "array-contains",
            user.id || JSON.parse(user).id
          ),
          limit(6)
        );
      case "mine":
        return query(
          collection(db, "crosshairs"),
          orderBy("date", "desc"),
          where("user", "==", user.id || JSON.parse(user).id),
          limit(6)
        );
      default:
        return query(collection(db, "crosshairs"), limit(6));
    }
  };

  const showNextPage = () => {
    if (page >= totalItems / 6) return;
    setPage((prev) => prev + 1);
    if (list.length > 0) {
      const fetchNextData = async () => {
        setLoading(true);
        setList([]);
        const q = query(
          { ...sortToQuery() },
          collection(db, "crosshairs"),
          limit(6),
          startAfter(lastVisible)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setList((prev) => [...prev, { ...doc.data(), id: doc.id }]);
        });

        setLoading(false);
      };
      fetchNextData();
    }
  };

  const showPrevPage = () => {
    if (page === 1) return;
    setPage((prev) => prev - 1);
    if (list.length > 0) {
      const fetchPrevData = async () => {
        setLoading(true);
        setList([]);
        const q = query(
          { ...sortToQuery() },
          collection(db, "crosshairs"),
          limit(6),
          endAt(lastVisible)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setList((prev) => [...prev, { ...doc.data(), id: doc.id }]);
        });
        setLoading(false);
      };
      fetchPrevData();
    }
  };

  const showInput = () => {
    setShowCrosshairInput((prev) => !prev);
  };

  return (
    <div className="crosshairs-container">
      <div className="crosshairs-menu">
        <div className="crosshairs-menu-sort">
          {sort.map((value) => (
            <CrosshairsMenuSortItem
              key={value}
              label={value}
              value={value}
              selected={sortSelected}
              setSelected={setSortSelected}
              user={user}
              loading={loading}
            />
          ))}
        </div>
        <div className="crosshairs-menu-controls">
          <div className="crosshairs-menu-controls-pagination">
            <div
              className="crosshairs-menu-controls-pagination-control"
              onClick={showPrevPage}
              style={{
                opacity: page === 1 ? 0.5 : 1,
                cursor: page === 1 ? "default" : "pointer",
              }}
            >
              <Icon icon="chevron-left" />
            </div>
            <div
              className="crosshairs-menu-controls-pagination-control"
              onClick={showNextPage}
              style={{
                opacity: page >= totalItems / 6 ? 0.5 : 1,
                cursor: page >= totalItems / 6 ? "default" : "pointer",
              }}
            >
              <Icon icon="chevron-right" />
            </div>
          </div>
          <div
            className={`crosshairs-menu-controls-add ${
              showCrosshairInput ? "crosshairs-menu-controls-add-close" : ""
            }`}
            onClick={showInput}
          >
            <Icon icon="add" />
          </div>
        </div>
        <AddCrosshair
          show={showCrosshairInput}
          setShow={setShowCrosshairInput}
        />
      </div>
      {loading ? (
        onLoadingCards()
      ) : list.length > 0 ? (
        <div className="crosshairs-list">
          {list.map((item) => (
            <CrosshairCard
              key={item.id}
              item={item}
              setLoading={setLoading}
              loading={loading}
            />
          ))}
        </div>
      ) : (
        <div className="crosshairs-list-empty">There is nothing to show</div>
      )}
    </div>
  );
}

function CrosshairsMenuSortItem({
  value,
  label,
  selected,
  setSelected,
  user,
  loading,
}) {
  if ((value === "mine" && !user) || (value === "favorites" && !user))
    return null;
  return (
    <label
      className={`crosshairs-menu-sort-item ${
        value === selected ? "crosshairs-menu-sort-item-selected" : ""
      }`}
    >
      <input
        type="radio"
        name="sort"
        id="sort"
        value={value}
        checked={value === selected}
        onChange={() => setSelected(value)}
        disabled={loading}
      />{" "}
      {label}
    </label>
  );
}

function onLoadingCards() {
  return (
    <div className="crosshairs-list">
      <CrosshairCard loading={true} />
      <CrosshairCard loading={true} />
      <CrosshairCard loading={true} />
      <CrosshairCard loading={true} />
      <CrosshairCard loading={true} />
      <CrosshairCard loading={true} />
    </div>
  );
}
