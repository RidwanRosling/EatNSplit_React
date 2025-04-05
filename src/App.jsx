import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showFriends, setShowFriends] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [newImg, setNewImg] = useState("https://i.pravatar.cc/48?u=49");

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

    initialFriends.push(newFriend);
    console.log(newFriend);
    setFriendName("");
    setNewImg("https://i.pravatar.cc/48?u=49");
  }

  function handleShowFriends() {
    setShowFriends((prevState) => !prevState);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={initialFriends} />
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

      <FormSplitBill />
    </div>
  );
}

function FriendList() {
  const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friends friend={friend} key={friend.id} />
      ))}
    </ul>
  );
}

function Friends({ friend }) {
  return (
    <li>
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
      <Button>Select</Button>
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

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with X</h2>

      <label>💵 Bill value</label>
      <input type="text" />

      <label>🤸‍♂️ Your expense</label>
      <input type="text" />

      <label>🤸‍♂️🤸‍♂️ X's expense</label>
      <input type="text" disabled />

      <label>💁‍♂️ Who is paying the bill?</label>
      <select>
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
