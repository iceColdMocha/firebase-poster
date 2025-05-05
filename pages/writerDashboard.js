import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function WriterDashboard() {
    const [stories, setStories] = useState([]);
    const router = useRouter();


    useEffect(() => {
        const fetchStories = async () => {
          const querySnapshot = await getDocs(collection(db, "stories"));
          const storyList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data()),
          }));
          setStories(storyList);
        };
    
        fetchStories();
      }, []);

      return (
        <div className="container">
          <div className="header">
            <h1 className="title">All Stories</h1>
            <button onClick={() => router.push('/writer/add')}>
              ➕ Add New Book
            </button>
          </div>
          <h1 className="title">All Stories</h1>
          <ul>
            {stories.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => router.push(`/story/${item.id}`)}
                  className="card"
                >
                  <h2 className="storyTitle">{item.title}</h2>
                  <p className="storySummary">{item.summary}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      );


}


