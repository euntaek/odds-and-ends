import React from "react";
import Ingredint from "./Ingredient";

function IngredientsList({ list }) {
  return (
    <ul className="Ingredint">
      {list.map((ingredint, i) => (
        <Ingredint key={i} {...ingredint} />
      ))}
    </ul>
  );
}

export default IngredientsList;
