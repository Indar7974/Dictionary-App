import { useState } from "react";
import axios from "axios";

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordData, setWordData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const searchWord = async () => {
    if (word.trim() === "") {
      setError("Please enter a word.");
      setWordData(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(` https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      setWordData(res.data[0]);
    } catch (err) {
      setWordData(null);
      setError("Word not found!");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    const audio = wordData?.phonetics?.find(
      (item) => item.audio !== ""
    );

    if (audio) {
      new Audio(audio.audio).play();
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 flex justify-center items-center px-4 py-10 ${
        darkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-blue-500 via-white to-indigo-100"
      }`}
    >
      <div
        className={`w-full max-w-5xl rounded-3xl shadow-2xl p-8 transition-all ${
          darkMode
            ? "bg-slate-800 text-white"
            : "bg-white text-gray-800"
        }`}
      >
        {/* Header */}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">
            📖 Dictionary
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Search */}

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search any word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchWord();
              }
            }}
            className={`flex-1 rounded-xl px-5 py-3 border outline-none transition ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300"
            }`}
          />

          <button
            onClick={searchWord}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl transition duration-300"
          >
            🔍 Search
          </button>
        </div>

        {/* Loading */}

        {loading && (
          <div className="text-center mt-8">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-indigo-500 font-semibold">
              Searching...
            </p>
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mt-8 bg-red-100 text-red-600 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Result Starts */}

        {wordData && (
          <>
            {/* Word Card */}

            <div
              className={`mt-8 rounded-2xl p-6 shadow-lg ${
                darkMode
                  ? "bg-slate-700"
                  : "bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-center flex-wrap gap-5">

                <div>
                  <h2 className="text-5xl font-bold">
                    {wordData.word}
                  </h2>

                  <p className="text-lg text-gray-400 mt-2">
                    {wordData.phonetic ||
                      "No phonetic available"}
                  </p>
                </div>{wordData.phonetics?.find(
                  (item) => item.audio
                ) && (
                  <button
                    onClick={playAudio}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl"
                  >
                    🔊 Listen
                  </button>
                )}
              </div>
            </div>

            {/* Meaning Cards Start */}
            <div className="grid gap-6 mt-8">

  {wordData.meanings.map((meaning, index) => (

    <div
      key={index}
      className={`rounded-2xl shadow-lg p-6 transition-all duration-300 hover:scale-[1.02] ${
        darkMode
          ? "bg-slate-700 border border-slate-600"
          : "bg-white border border-gray-200"
      }`}
    >

      {/* Part of Speech */}

      <div className="flex justify-between items-center flex-wrap gap-3">

        <h2 className="text-2xl font-bold text-indigo-600">
          📚 {meaning.partOfSpeech.toUpperCase()}
        </h2>

        <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
          {meaning.definitions.length} Meaning
          {meaning.definitions.length > 1 ? "s" : ""}
        </span>

      </div>

      <hr className="my-5" />

      {/* Definitions */}

      {meaning.definitions.map((def, i) => (

        <div
          key={i}
          className="mb-8 border-l-4 border-indigo-500 pl-4"
        >

          <h3 className="text-lg font-semibold mb-2">
            📝 Meaning
          </h3>

          <p className="leading-8">
            {def.definition}
          </p>

          {def.example && (

            <>
              <h3 className="font-semibold mt-5">
                💬 Example
              </h3>

              <p className="italic text-green-500 mt-2">
                "{def.example}"
              </p>
            </>

          )}

        </div>

      ))}

      {/* Synonyms */}

      {meaning.synonyms.length > 0 && (

        <>

          <h3 className="text-lg font-bold mb-3">
            ⭐️ Synonyms
          </h3>

          <div className="flex flex-wrap gap-2">

            {meaning.synonyms.slice(0, 10).map((syn, i) => (

              <span
                key={i}
                className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
              >
                {syn}
              </span>

            ))}

          </div>

        </>

      )}

      {/* Antonyms */}

      {meaning.antonyms.length > 0 && (

        <>

          <h3 className="text-lg font-bold mt-6 mb-3">
            ❌ Antonyms
          </h3>

          <div className="flex flex-wrap gap-2">

            {meaning.antonyms.slice(0, 10).map((ant, i) => (

              <span
                key={i}
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
              >
                {ant}
              </span>

            ))}

          </div>

        </>

      )}

    </div>

  ))}

</div>
            {/* Meaning Cards End */}
          </>
        )}
      </div>
    </div>
  );
};

export default Dictionary;