import React from "react";
import Recipe from "./Recipe";

function Main({ recipes }) {
  return (
    <articel>
      <header>
        <h1>맛있는 조리법</h1>
      </header>
      <div className="recipes">
        {recipes.map((recipe, i) => (
          <Recipe key={i} {...recipe} />
        ))}
      </div>
    </articel>
  );
}

export default Main;
