import { useEffect, useState } from "react";
import { ref, onValue, runTransaction } from "firebase/database";
import { db } from "./firebase";
import "./App.css";

function App() {
  const [count, setCount] = useState(null);

  const counterRef = ref(db, "giladas");

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
      <h1>Contador de Giladas</h1>

      <button onClick={handleClick}>
        +1 Gilada
      </button>

      <div className="counter">
        {count === null ? <span className="loading">...</span> : count}
      </div>
    </div>
  );
}

export default App;