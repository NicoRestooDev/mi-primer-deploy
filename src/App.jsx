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
      <section className="panel counter-panel">
        <h1>Contador de Giladas</h1>
        <button onClick={handleClick}>+1 Gilada</button>

        <div className="counter">
          {count === null ? <span className="loading">...</span> : count}
        </div>
      </section>

      <section className="panel game-panel">
        <h2>Matapayo</h2>
        <MatapayoGame />
      </section>
    </div>
  );
}

export default App;
