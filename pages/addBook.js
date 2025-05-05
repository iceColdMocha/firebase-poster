import { useState } from "react";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePost = async () => {
    if (!title.trim()) return;

    try {
      setIsUploading(true);
      let coverImage = "";

      if (imageFile) {
        const imageRef = ref(storage, `covers/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        coverImage = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "stories"), {
        title,
        description,
        tags: tag ? [tag] : [],
        chapters: [],
        coverImage,
        published: false,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setTag("");
      setImageFile(null);
      alert("Book added!");
    } catch (error) {
      console.error("Error posting:", error);
      alert("Something went wrong.");
    } finally {
      setIsUploading(false);
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

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        style={{ marginBottom: "1rem" }}
      />

      <button
        onClick={handlePost}
        style={{ padding: "0.5rem 1rem" }}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Post"}
      </button>
    </main>
  );
}
