import { useState } from "react"
import "./style.css"

interface Friend {
  id: number | string
  name: string
  image: string
  balance: number
}

const initialFriends: Friend[] = [
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
]

export default function App() {
  const [showForm, setShowForm] = useState(false)
  const [friends, setFriends] = useState<Friend[]>(initialFriends)
  const [splitFriend, setSplitFriend] = useState<Friend>()

  function handleClick() {
    setShowForm((show) => !show)
  }

  function handleAddFriend(newFriend: Friend) {
    setFriends((friends) => [...friends, newFriend])
  }

  function handleSelect(friend: Friend) {
    setSplitFriend(friend)
  }

  function editBalance(expense: number) {
    setFriends((friends) =>
      friends
        .slice()
        .map((f) => (f.id === splitFriend?.id ? { ...f, balance: f.balance + expense } : f))
    )
  }

  return (
    <div className="app">
      <img className="banner" src="/public/friends.svg" />
      <h1>
        Friends who <span>SPLIT</span> bills <span>STAY</span> together!
      </h1>
      <div className="main">
        <div className="sidebar">
          <Friends friends={friends} handleSelect={handleSelect} />
          <AddFriendForm
            handleClick={handleClick}
            showForm={showForm}
            handleAddFriend={handleAddFriend}
          />
        </div>
        <SplitForm splitFriend={splitFriend} editBalance={editBalance} />
      </div>
    </div>
  )
}

function Friends({ friends, handleSelect }) {
  return (
    <ul>
      {friends.map((f: Friend) => (
        <Friend friend={f} key={f.id} handleSelect={handleSelect} />
      ))}
    </ul>
  )
}

function Friend({ friend, handleSelect }) {
  return (
    <li>
      <img src={friend.image} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you £{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>{friend.name} and you are square</p>}
      <Button handleClick={() => handleSelect(friend)}>Select</Button>
    </li>
  )
}

function AddFriendForm({ handleClick, showForm, handleAddFriend }) {
  const [name, setName] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (!name) return

    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name,
      image: "https://i.pravatar.cc/48",
      balance: 0,
    }
    console.log("New friend", newFriend)
    handleAddFriend(newFriend)
    setName("")
  }

  return (
    <>
      {showForm && (
        <form className="form-add-friend" onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Button>Add</Button>
        </form>
      )}
      <Button handleClick={handleClick}>{showForm ? "Close form" : "Add more friends"}</Button>
    </>
  )
}

function SplitForm({ splitFriend, editBalance }) {
  const [bill, setBill] = useState(0)
  const [whoPay, setWhoPay] = useState("you")
  const [yourExpense, setYourExpense] = useState(0)
  const friendExpense = bill - yourExpense

  function handleClick(e) {
    e.preventDefault()
    console.log("Friend exp", friendExpense)
    if (whoPay === "you") {
      editBalance(friendExpense)
    }
    if (whoPay !== "you") {
      editBalance(-yourExpense)
    }
  }

  return (
    <form className="form-split-bill">
      <h2>Split the bill with {splitFriend?.name}</h2>
      <label>Bill value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />
      <label>Your expense</label>
      <input
        type="text"
        disabled={whoPay !== "you"}
        value={yourExpense}
        onChange={(e) => setYourExpense(Number(e.target.value))}
      />

      <label>{splitFriend ? `${splitFriend.name}` : "Friend"} expense</label>
      <input
        type="text"
        disabled={whoPay === "you"}
        value={friendExpense}
        onChange={(e) => setYourExpense(bill - Number(e.target.value))}
      />

      <label>Who is paying</label>
      <select onChange={(e) => setWhoPay(e.target.value)}>
        <option value="you">You</option>
        <option value={splitFriend?.name}>{splitFriend?.name}</option>
      </select>
      <Button handleClick={handleClick}>Split bill</Button>
    </form>
  )
}

function Button({ children, handleClick }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  )
}
