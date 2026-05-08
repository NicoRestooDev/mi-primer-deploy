import { useEffect, useState } from "react";
import { ref, onValue, runTransaction } from "firebase/database";
import { db } from "./firebase";
import MatapayoGame from "./MatapayoGame";
import "./App.css";

const counterRef = ref(db, "giladas");

function App() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const unsubscribe = onValue(counterRef, (snapshot) => {
      setCount(snapshot.val() || 0);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    runTransaction(counterRef, (current) => {
      return (current || 0) + 1;
    });
  };

  return (
    <div className="container">
      <section className="panel game-panel">
        <MatapayoGame />
      </section>
    </div>
  );
}

export default App;
