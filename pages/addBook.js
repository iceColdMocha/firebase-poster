import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const handlePost = async () => {
    if (!title.trim()) return;

    try {
      await addDoc(collection(db, "stories"), {
        title,
        description,
        tags: tag ? [tag] : [],
        chapters: [],
        coverImage: "", // kept for future use
        published: false,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setTag("");
      alert("Book added!");
    } catch (error) {
      console.error("Error posting:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Add a New Book</h1>

      <input
        type="text"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      <input
        type="text"
        value={description}
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      >
        <option value="">Select a genre</option>
        <option value="horror">Horror</option>
        <option value="drama">Drama</option>
        <option value="romance">Romance</option>
        <option value="sci-fi">Sci-Fi</option>
        <option value="fantasy">Fantasy</option>
      </select>

      <button
        onClick={handlePost}
        style={{ padding: "0.5rem 1rem" }}
      >
        Post
      </button>
    </main>
  );
}
