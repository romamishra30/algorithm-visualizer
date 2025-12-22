import { useState } from "react";


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function generateRandomArray(length, minValue, maxValue) {
  const result = [];
  for (let i = 0; i < length; i++) {
    const value =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    result.push(value);
  }
  return result;
}

// main
export default function App() {
  const [array, setArray] = useState([]);

  const [size, setSize] = useState(40);
  const [speed, setSpeed] = useState(80);

  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState({ i: null, j: null });

  const [sortedIndex, setSortedIndex] = useState(null);
  const [currentAlgo, setCurrentAlgo] = useState(null);



  const handleGenerateArray = () => {
    if (isSorting) return; 

    const newArray = generateRandomArray(size, 10, 250);
    setArray(newArray);
    setActiveIndices({ i: null, j: null }); 
  };

  // Bubble Sort 
  const handleBubbleSort = async () => {
    if (isSorting || array.length === 0) return;

    setIsSorting(true); 
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      setSortedIndex(n - i);
      for (let j = 0; j < n - i - 1; j++) {
// highlight the bars
        setActiveIndices({ i: j, j: j + 1 });

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
        setArray([...arr]);

        await sleep(speed);
      }
    }

    setActiveIndices({ i: null, j: null });
    setSortedIndex(0);
    setIsSorting(false);
  };

  const handleSelectionSort = async () => {
    if (isSorting || array.length === 0) return;

    setIsSorting(true);

    let arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      setActiveIndices({ i: minIndex, j: null });

      for (let j = i + 1; j < n; j++) {
        setActiveIndices({ i: minIndex, j });

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
          setActiveIndices({ i: minIndex, j });
        }

        await sleep(speed);
      }

      if (minIndex !== i) {
        const temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
      }

      setArray([...arr]);
      setSortedIndex(i + 1); 
      await sleep(speed);
    }

    setActiveIndices({ i: null, j: null });
    setSortedIndex(0);
    setIsSorting(false);
  };




  // Insertion Sort 
  const handleInsertionSort = async () => {
    if (isSorting || array.length === 0) return;

    setIsSorting(true);

    let arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      setActiveIndices({ i, j: null });
      await sleep(speed);

      while (j >= 0 && arr[j] > key) {
        setActiveIndices({ i: j, j: j + 1 });

        arr[j + 1] = arr[j];
        setArray([...arr]);

        j--;
        await sleep(speed);
      }

      arr[j + 1] = key;
      setArray([...arr]);

      
      setSortedIndex(i + 1);
      await sleep(speed);
    }

    setActiveIndices({ i: null, j: null });
    setSortedIndex(0);
    setIsSorting(false);
  };




  
  // appearing on screen
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-4">
        Sorting Algorithm Visualizer
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
       {/* Generate button */}
        <button
          onClick={handleGenerateArray}
          disabled={isSorting}
          className={`px-4 py-2 rounded 
            ${isSorting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          Generate New Array
        </button>



        {/* Bubble Sort button */}
        <button
          onClick={() => {
            setCurrentAlgo("Bubble Sort");
            handleBubbleSort();
          }}
          disabled={isSorting || array.length === 0}
          className={`px-4 py-2 rounded 
    ${isSorting || array.length === 0
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"}`}
        >
          Bubble Sort
        </button>




        {/* Selection Sort button */}
        <button
          onClick={() => {
            setCurrentAlgo("Selection Sort");
            handleSelectionSort();
          }}
          disabled={isSorting || array.length === 0}
          className={`px-4 py-2 rounded 
    ${isSorting || array.length === 0
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"}`}
        >
          Selection Sort
        </button>




        {/* Insertion Sort button */}
        <button
          onClick={() => {
            setCurrentAlgo("Insertion Sort");
            handleInsertionSort();
          }}
          disabled={isSorting || array.length === 0}
          className={`px-4 py-2 rounded 
    ${isSorting || array.length === 0
              ? "bg-yellow-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"}`}
        >
          Insertion Sort
        </button>





        {/* Size slider */}
        <div className="flex items-center gap-2">
          <span>Size:</span>
          <input
            type="range"
            min="10"
            max="145"
            value={size}
            disabled={isSorting}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <span className="text-sm text-gray-300">{size}</span>
        </div>




        {/* Speed slider */}
        <div className="flex items-center gap-2">
          <span>Speed:</span>
          <input
            type="range"
            min="10"
            max="500"
            value={speed}
            disabled={isSorting}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span className="text-sm text-gray-300">{speed} ms</span>
        </div>
      </div>




      {currentAlgo && (
        <div className="mt-4 p-4 bg-slate-800 rounded-lg text-sm">
          <p><b>Algorithm:</b> {currentAlgo}</p>

          {currentAlgo === "Bubble Sort" && (
            <p>Time: O(n²) | Space: O(1) | Stable: Yes</p>
          )}

          {currentAlgo === "Selection Sort" && (
            <p>Time: O(n²) | Space: O(1) | Stable: No</p>
          )}

          {currentAlgo === "Insertion Sort" && (
            <p>Time: O(n²) | Space: O(1) | Stable: Yes</p>
          )}
        </div>
      )}





      {/* Bars container */}
      <div className="flex items-end justify-center gap-[2px] h-96 bg-slate-900 rounded-xl p-3 overflow-hidden shadow-lg">
        {array.map((value, index) => {
          const isActive =
            index === activeIndices.i || index === activeIndices.j;

          const isSorted =
            sortedIndex !== null && index >= sortedIndex;

          return (
            <div
              key={index}
              className={`${isSorted
                ? "bg-emerald-400"
                : isActive
                  ? "bg-red-400"
                  : "bg-cyan-400"
                }`}
              style={{
                height: `${value}px`,
                width: `${Math.max(3, 700 / array.length)}px`,
              }}
            />

          );
        })}
      </div>
    </div>
  );
}
