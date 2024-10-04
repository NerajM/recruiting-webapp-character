import { useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST } from "./consts.js";

function CharacterSheet({ character, updateCharacter }) {
  const [attributes, setAttributes] = useState(character.attributes);

  const [modifiers, setModifiers] = useState({
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0,
  });

  const [skills, setSkills] = useState(character.skills);

  const [displayedClassReqs, setDisplayedClassReqs] = useState(null);

  const [totalSkillPoints, setTotalSkillPoints] = useState(
    Math.max(0, 10 + 4 * modifiers.Intelligence)
  );

  const [spentSkillPoints, setSpentSkillPoints] = useState(
    character.spentSkillPoints
  );

  const [spentAttributePoints, setSpentAttributePoints] = useState(
    character.spentAttributePoints
  );

  const totalAttributePoints = 70;

  const handleAttributeChange = (attribute, change) => {
    const newAttrVal = Math.max(0, attributes[attribute] + change);
    const newModifierVal = Math.floor((newAttrVal - 10) / 2);
    const newTotalSkillPoints = Math.max(0, 10 + 4 * newModifierVal);

    if (attribute === "Intelligence") {
      setTotalSkillPoints(newTotalSkillPoints);
    }

    setSpentAttributePoints(spentAttributePoints + change);
    setModifiers({ ...modifiers, [attribute]: newModifierVal });
    setAttributes({ ...attributes, [attribute]: newAttrVal });
    updateCharacter({
      ...character,
      attributes: { ...attributes, [attribute]: newAttrVal },
      spentAttributePoints: spentAttributePoints + change,
    });
  };

  const handleSkillChange = (index, change) => {
    const newSkills = { ...skills };
    const newSkillVal = Math.max(0, skills[index].points + change);

    if (skills[index].points + change !== -1) {
      setSpentSkillPoints(spentSkillPoints + change);
    }

    newSkills[index].points = newSkillVal;
    setSkills(newSkills);
    updateCharacter({
      ...character,
      skills: newSkills,
      spentSkillPoints: spentSkillPoints + change,
    });
  };

  const remainingSkillPoints = Math.max(0, totalSkillPoints - spentSkillPoints);

  const meetsStatRequirements = (classReqs) => {
    return Object.keys(classReqs).every(
      (attr) => attributes[attr] >= classReqs[attr]
    );
  };

  return (
    <div>
      <section className="Char-sheet">
        <div>
          <h2>
            Attribute Points Remaining:{" "}
            {totalAttributePoints - spentAttributePoints}
          </h2>
          {ATTRIBUTE_LIST.map((attr) => (
            <div>
              {attr}:{attributes[attr]} Modifier:{modifiers[attr]}
              <button
                onClick={() => handleAttributeChange(attr, 1)}
                disabled={totalAttributePoints - spentAttributePoints === 0}
              >
                +
              </button>
              <button
                onClick={() => handleAttributeChange(attr, -1)}
                disabled={
                  (attr === "Intelligence" &&
                    spentSkillPoints !== 0 &&
                    remainingSkillPoints <= 3) ||
                  attributes[attr] === 0
                }
              >
                -
              </button>
            </div>
          ))}
        </div>
        <div>
          <h2>Classes</h2>
          <div>
            {Object.entries(CLASS_LIST).map(([className, classReqs]) => (
              <div
                style={{
                  color: meetsStatRequirements(classReqs) ? "green" : "white",
                }}
                onClick={() => setDisplayedClassReqs(classReqs)}
              >
                {className}
              </div>
            ))}
            {displayedClassReqs && (
              <>
                {Object.keys(displayedClassReqs).map((attr) => {
                  return (
                    <div>
                      {attr} : {displayedClassReqs[attr]}
                    </div>
                  );
                })}
                <button onClick={() => setDisplayedClassReqs(null)}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
        <div>
          <h2>Total Skill Points Remaining:{remainingSkillPoints}</h2>
          {Object.entries(skills).map(([index, skill]) => (
            <div>
              {skill.name}: {skill.points}
              Modifier: {modifiers[skill.attributeModifier]}
              Total: {skill.points + modifiers[skill.attributeModifier]}
              <button
                onClick={() => handleSkillChange(index, 1)}
                disabled={remainingSkillPoints === 0}
              >
                +
              </button>
              <button
                onClick={() => handleSkillChange(index, -1)}
                disabled={skill.points === 0}
              >
                -
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CharacterSheet;
