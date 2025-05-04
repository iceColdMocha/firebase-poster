import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, setDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [text, setText] = useState("");

  const handlePost = async () => {
    if (!text.trim()) return;

    try {
      await setDoc(collection(db, "books"), {
        text,
        createdAt: serverTimestamp(),
      });
      setText("");
      alert("Posted!");
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Add a new Book</h1>
      <input
        type="text"
        value={text}
        placeholder="Type something for a book..."
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />
      <button onClick={handlePost} style={{ padding: "0.5rem 1rem" }}>
        Post
      </button>
    </main>
  );
}
