import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function EditStory() {
  const router = useRouter();
  const { id: bookId } = router.query;

  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [body, setBody] = useState([""]);
  const [options, setOptions] = useState([{ text: "", nextChapterId: "" }]);

  useEffect(() => {
    if (!bookId) return;
    const fetchChapters = async () => {
      const chaptersRef = collection(db, "stories", bookId, "chapters");
      const snapshot = await getDocs(chaptersRef);
      const chapterList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChapters(chapterList);
    };

    fetchChapters();
  }, [bookId]);

  const handleSelectChapter = async (id) => {
    setSelectedChapterId(id);
    const chapterDoc = await getDoc(doc(db, "stories", bookId, "chapters", id));
    const chapterData = chapterDoc.data();
    setChapterTitle(chapterData.title || "");
    setBody(chapterData.body || [""]);
    setOptions(chapterData.options || [{ text: "", nextChapterId: "" }]);
  };

  const handleSaveChapter = async () => {
    const chapterData = {
      title: chapterTitle,
      body,
      options: options.slice(0, 3).filter(o => o.text),
    };

    const chaptersRef = collection(db, "stories", bookId, "chapters");

    if (selectedChapterId) {
      await updateDoc(doc(db, "stories", bookId, "chapters", selectedChapterId), chapterData);
    } else {
      const newDoc = await addDoc(chaptersRef, chapterData);
      setSelectedChapterId(newDoc.id);
    }

    alert("Chapter saved!");
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>Edit Chapters</h1>

      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Chapters</h2>
        <select
          value={selectedChapterId}
          onChange={(e) => handleSelectChapter(e.target.value)}
        >
          <option value="">-- Add New Chapter --</option>
          {chapters.map((chap) => (
            <option key={chap.id} value={chap.id}>
              {chap.title || `Untitled (${chap.id.slice(0, 6)})`}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          placeholder="Chapter Title"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <h3>Paragraphs</h3>
        {body.map((para, idx) => (
          <textarea
            key={idx}
            value={para}
            placeholder={`Paragraph ${idx + 1} (Markdown supported)`}
            onChange={(e) => {
              const updated = [...body];
              updated[idx] = e.target.value;
              setBody(updated);
            }}
            style={{ width: "100%", height: "100px", marginBottom: "1rem" }}
          />
        ))}
        <button onClick={() => setBody([...body, ""])}>+ Add Paragraph</button>
      </div>

      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <h3>Options (Up to 3)</h3>
        {options.map((option, idx) => (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={option.text}
              onChange={(e) => {
                const updated = [...options];
                updated[idx].text = e.target.value;
                setOptions(updated);
              }}
              placeholder="Option text"
              style={{ width: "45%", marginRight: "1rem", padding: "0.5rem" }}
            />
            <select
              value={option.nextChapterId}
              onChange={(e) => {
                const updated = [...options];
                updated[idx].nextChapterId = e.target.value;
                setOptions(updated);
              }}
              style={{ width: "45%", padding: "0.5rem" }}
            >
              <option value="">-- Select next chapter --</option>
              {chapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  {chap.title || `Untitled (${chap.id.slice(0, 6)})`}
                </option>
              ))}
            </select>
          </div>
        ))}
        {options.length < 3 && (
          <button onClick={() => setOptions([...options, { text: "", nextChapterId: "" }])}>
            + Add Option
          </button>
        )}
      </div>

      <button onClick={handleSaveChapter} style={{ padding: "0.75rem 1.5rem" }}>
        Save Chapter
      </button>
    </main>
  );
}
