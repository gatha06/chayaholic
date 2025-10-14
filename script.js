function analyzeTea() {
  const input = document.getElementById("ingredients").value.toLowerCase();
  const result = document.getElementById("result");

  if (!input.trim()) {
    result.innerHTML = "Please enter some ingredients ☕";
    return;
  }

  let score = 0;

  // Strong tea ingredients
  const strong = ["ginger", "masala", "black", "less milk", "cardamom", "clove"];
  const light = ["more milk", "water", "sugar", "honey"];

  strong.forEach(item => {
    if (input.includes(item)) score += 2;
  });
  light.forEach(item => {
    if (input.includes(item)) score -= 1;
  });

  let strength = "";
  if (score >= 3) strength = "🔥 Strong & Bold — perfect wake-up tea!";
  else if (score >= 1) strength = "🌿 Medium — nicely balanced brew.";
  else strength = "🍯 Light & calming — your cozy comfort tea.";

  result.innerHTML = strength;
}