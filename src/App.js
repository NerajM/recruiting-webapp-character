import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { SKILL_LIST } from "./consts.js";
import CharacterSheet from "./CharacterSheet";

function App() {
  const [characters, setCharacters] = useState([]);

  const get_API =
    "https://recruiting.verylongdomaintotestwith.ca/api/{NerajM}/character";

  const post_API =
    "https://recruiting.verylongdomaintotestwith.ca/api/{NerajM}/character";

  useEffect(() => {
    axios
      .get(get_API)
      .then((res) => {
        setCharacters(res.data.body.characters);
      })
      .catch((err) => console.log("Error fetching character: {}", err));
  }, []);

  const handleSaveCharacterData = () => {
    const data = {
      characters: characters,
    };
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(post_API, data, headers)
      .then((res) => {
        console.log("Character Data Saved Successfully!");
      })
      .catch((err) => {
        console.log("Error Saving Character Data: {}", err);
      });
  };

  const handleAddCharacterData = () => {
    const character = {
      attributes: {
        Strength: 10,
        Dexterity: 10,
        Constitution: 10,
        Intelligence: 10,
        Wisdom: 10,
        Charisma: 10,
      },
      skills: SKILL_LIST.map((skill) => ({ ...skill, points: 0 })),
      spentAttributePoints: 60,
      spentSkillPoints: 0,
      characterId: Math.random(),
    };

    setCharacters([...characters, character]);
  };
  const updateCharacter = (updatedCharacter) =>
    setCharacters((chars) =>
      chars.map((character) =>
        character.characterId === updatedCharacter.characterId
          ? updatedCharacter
          : character
      )
    );

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - Neraj Manamperi</h1>
      </header>
      <button onClick={handleAddCharacterData}>Add Character</button>
      <button onClick={handleSaveCharacterData}>Save Characters</button>
      <section className="App-section">
        {characters.map((character) => {
          return (
            <CharacterSheet
              character={character}
              updateCharacter={updateCharacter}
            />
          );
        })}
      </section>
    </div>
  );
}

export default App;
