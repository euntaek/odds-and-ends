import React from "react";

function Instruction({ title, steps }) {
  return (
    <section className="instruction">
      <h2>{title}</h2>
      {steps.map((s, i) => (
        <p key={i}>{s}</p>
      ))}
    </section>
  );
}

export default Instruction;
