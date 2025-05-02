import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [text, setText] = useState("");

  const handlePost = async () => {
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, "posts"), {
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
      <h1>Post Something</h1>
      <input
        type="text"
        value={text}
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />
      <button onClick={handlePost} style={{ padding: "0.5rem 1rem" }}>
        Post
      </button>
    </main>
  );
}
