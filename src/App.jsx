import { useState } from "react";
import initialFriends from "./data";
export default function App() {
  const [allFriends, setAllFriends] = useState(initialFriends);
  const [showFriends, setShowFriends] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [newImg, setNewImg] = useState("https://i.pravatar.cc/48?u=49");
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!friendName) {
      alert("Please enter a name");
      return;
    }
    if (!newImg) {
      alert("Please enter an image URL");
      return;
    }
    if (!newImg.startsWith("https://")) {
      alert("Please enter a valid image URL");
      return;
    }

    const newFriend = {
      id: crypto.randomUUID(),
      name: friendName,
      image: `${newImg}`,
      balance: 0,
    };

    setAllFriends((prevState) => [...prevState, newFriend]);
    console.log(newFriend);
    setFriendName("");
    setNewImg("https://i.pravatar.cc/48?u=49");
    setShowFriends(false);
  }

  function handleShowFriends() {
    if (selectedFriend) {
      setSelectedFriend(null);
    }
    setShowFriends((prevState) => !prevState);
  }

  function handleSelected(friend) {
    if (selectedFriend?.id === friend.id) {
      setSelectedFriend(null);
      return;
    }
    if (showFriends === true) {
      setShowFriends(false);
    }
    setSelectedFriend(friend);
  }

  function handleSplitBill(friend) {
    setSelectedFriend(friend);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={allFriends}
          selectedFriend={selectedFriend}
          onSelected={handleSelected}
        />
        {showFriends && (
          <FormAddFriend
            newFriend={friendName}
            newImg={newImg}
            handleAddFriend={handleShowFriends}
            handleSubmit={handleSubmit}
            handleNameFriend={setFriendName}
            handleImgFriend={setNewImg}
          />
        )}
        <Button onClick={handleShowFriends}>
          {showFriends === false ? "Add Friend" : "Close"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, selectedFriend, onSelected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friends
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelected={onSelected}
        />
      ))}
    </ul>
  );
}

function Friends({ friend, onSelected, selectedFriend }) {
  // its optional chaining you must use "?" to avoid error
  // when selectedFriend is null
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelected(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({
  newFriend,
  newImg,
  handleSubmit,
  handleNameFriend,
  handleImgFriend,
}) {
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={newFriend}
        onChange={(e) => handleNameFriend(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={newImg}
        onChange={(e) => handleImgFriend(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  // for the value not to be negative
  const paidByFriend =
    bill && paidByUser ? Number(bill) - Number(paidByUser) : 0;
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) {
      alert("Please enter a value");
      onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
      return;
    }
    if (paidByUser > bill) {
      alert("You can't pay more than the bill");
      return;
    }
    onSplitBill(selectedFriend);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => {
          let value = e.target.value;

          // Hapus semua non-digit kecuali titik (untuk desimal)
          value = value.replace(/^0+(?!$)/, "");
          if (!/^\d*\.?\d*$/.test(value)) return;

          setBill(value);
        }}
      />

      <label>🤸‍♂️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => {
          let value = e.target.value;

          value = value.replace(/^0+(?!$)/, "");
          if (!/^\d*\.?\d*$/.test(value)) return;

          const numeric = Number(value);
          if (numeric > Number(bill)) {
            alert("Your expense tidak boleh melebihi nilai bill");
            return;
          }

          setPaidByUser(value);
        }}
      />

      <label>🤸‍♂️🤸‍♂️ {selectedFriend.name} expense</label>
      <input
        type="text"
        disabled
        value={paidByFriend}
        onChange={(e) =>
          setPaidByUser(Number(e.target.value)) > bill
            ? paidByUser
            : Number(e.target.value)
        }
      />

      <label>💁‍♂️ Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)} // Jangan pakai Number!
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
