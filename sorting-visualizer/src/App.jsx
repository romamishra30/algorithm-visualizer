// 1️⃣ Import the useState hook from React
import { useState } from "react";

// 2️⃣ Helper: wait for some time (used for animation delay)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 3️⃣ Helper: create a random array
function generateRandomArray(length, minValue, maxValue) {
  const result = [];
  for (let i = 0; i < length; i++) {
    const value =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    result.push(value);
  }
  return result;
}

function getMergeSortAnimations(arr) {
  const animations = [];
  if (arr.length <= 1) return animations;

  const auxiliaryArray = arr.slice();
  mergeSortHelper(arr, 0, arr.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  animations
) {
  if (startIdx === endIdx) return;

  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  animations
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;

  while (i <= middleIdx && j <= endIdx) {
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  while (i <= middleIdx) {
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }

  while (j <= endIdx) {
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}


// 4️⃣ Main component
export default function App() {
  // The array we are visualizing
  const [array, setArray] = useState([]);

  // Number of elements in the array
  const [size, setSize] = useState(40);

  // Delay between animation steps (in ms)
  const [speed, setSpeed] = useState(80);

  // Are we currently sorting? (used to disable buttons)
  const [isSorting, setIsSorting] = useState(false);

  // Which two indices are being compared right now (for coloring)
  const [activeIndices, setActiveIndices] = useState({ i: null, j: null });

  // Index from which elements are sorted (for green bars)
  const [sortedIndex, setSortedIndex] = useState(null);

  const [currentAlgo, setCurrentAlgo] = useState(null);



  // 5️⃣ Create a new random array
  const handleGenerateArray = () => {
    if (isSorting) return; // don't regenerate while sorting

    const newArray = generateRandomArray(size, 10, 250);
    setArray(newArray);
    setActiveIndices({ i: null, j: null }); // clear highlights
  };

  // 6️⃣ Bubble Sort with animation
  const handleBubbleSort = async () => {
    // If we are already sorting or array is empty, do nothing
    if (isSorting || array.length === 0) return;

    setIsSorting(true); // lock the UI

    // Make a copy so we don't mutate state directly
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      setSortedIndex(n - i);
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight the two bars being compared
        setActiveIndices({ i: j, j: j + 1 });

        // If left element is greater, swap
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }

        // Update the array in state so bars move
        setArray([...arr]);

        // Wait for "speed" ms before next step
        await sleep(speed);
      }
    }

    // Sorting done → clear highlights and unlock UI
    setActiveIndices({ i: null, j: null });
    setSortedIndex(0);
    setIsSorting(false);
  };

  // Selection Sort with animation
  const handleSelectionSort = async () => {
    if (isSorting || array.length === 0) return;

    setIsSorting(true);

    let arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      // Highlight the starting index
      setActiveIndices({ i: minIndex, j: null });

      for (let j = i + 1; j < n; j++) {
        // Highlight comparison
        setActiveIndices({ i: minIndex, j });

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
          setActiveIndices({ i: minIndex, j });
        }

        await sleep(speed);
      }

      // Swap minimum with first unsorted element
      if (minIndex !== i) {
        const temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
      }

      setArray([...arr]);
      setSortedIndex(i + 1); // left side sorted
      await sleep(speed);
    }

    setActiveIndices({ i: null, j: null });
    setSortedIndex(0);
    setIsSorting(false);
  };

  // Insertion Sort with animation
  const handleInsertionSort = async () => {
    if (isSorting || array.length === 0) return;

    setIsSorting(true);

    let arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      // Highlight the key being inserted
      setActiveIndices({ i, j: null });
      await sleep(speed);

      // Shift elements to the right
      while (j >= 0 && arr[j] > key) {
        setActiveIndices({ i: j, j: j + 1 });

        arr[j + 1] = arr[j];
        setArray([...arr]);

        j--;
        await sleep(speed);
      }

      // Insert key at correct position
      arr[j + 1] = key;
      setArray([...arr]);

      // Left part is sorted
      setSortedIndex(i + 1);
      await sleep(speed);
    }

    setActiveIndices({ i: null, j: null });
    setSortedIndex(0);
    setIsSorting(false);
  };

  // Merge Sort with animation
  const handleMergeSort = async () => {
    if (isSorting || array.length === 0) return;

    setIsSorting(true);
    setActiveIndices({ i: null, j: null });
    setSortedIndex(null);

    const animations = getMergeSortAnimations([...array]);
    const arr = [...array];

    for (let i = 0; i < animations.length; i++) {
      const [index, newValue] = animations[i];

      arr[index] = newValue;
      setArray([...arr]);

      await sleep(speed);
    }

    setSortedIndex(0);
    setIsSorting(false);
  };




  // 7️⃣ JSX: what appears on screen
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

        {/* Merge Sort button */}
        <button
          onClick={() => {
            setCurrentAlgo("Merge Sort");
            handleMergeSort();
          }}
          disabled={isSorting || array.length === 0}
          className={`px-4 py-2 rounded 
    ${isSorting || array.length === 0
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600"}`}
        >
          Merge Sort
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

      {/* Bars container */}
      <div className="flex items-end gap-[2px] h-96 bg-slate-900 rounded-xl p-3 overflow-hidden shadow-lg">
        {array.map((value, index) => {
          const isActive =
            index === activeIndices.i || index === activeIndices.j;

          const isSorted =
            sortedIndex !== null && index >= sortedIndex;

          return (
            <div
              key={index}
              className={`w-[6px] md:w-[8px] ${isSorted ? "bg-emerald-400"
                : isActive ? "bg-red-400" : "bg-cyan-400"
                }`}
              style={{ height: `${value}px` }}
            />
          );
        })}
      </div>
    </div>
  );
}
