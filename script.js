function analyzeTea() {
  const input = document.getElementById("ingredients").value || "";
  const result = document.getElementById("result");

  if (!input.trim()) {
    result.textContent = "Please enter some ingredients ☕";
    return;
  }

  const text = input.toLowerCase();

  // normalize common misspellings
  const normalized = text.replace(/cardamon/g, 'cardamom').replace(/teapowder|teapowder/g, 'tea powder');

  // extract quantities: e.g. "1 glass water", "2 glasses milk", "4 spoons tea powder"
  let waterGlasses = 0;
  let milkGlasses = 0;
  let teaSpoons = 0;

  const glassRegex = /(\d+)\s*(?:glass|glasses)\s*(?:of\s*)?(water|milk)/g;
  let m;
  while ((m = glassRegex.exec(normalized)) !== null) {
    const n = parseInt(m[1], 10) || 0;
    if (m[2].includes('water')) waterGlasses += n;
    if (m[2].includes('milk')) milkGlasses += n;
  }

  const spoonRegex = /(\d+)\s*(?:spoon|spoons|tsp|tbsp)\s*(?:of\s*)?(tea powder|tea|teapowder)/g;
  while ((m = spoonRegex.exec(normalized)) !== null) {
    teaSpoons += parseInt(m[1], 10) || 0;
  }

  // fallback: if user mentions water/milk without numbers, assume 1 glass each
  if (waterGlasses === 0 && /\bwater\b/.test(normalized)) waterGlasses = 1;
  if (milkGlasses === 0 && /\bmilk\b/.test(normalized)) milkGlasses = 1;
  if (teaSpoons === 0 && /\btea powder\b|\btea\b/.test(normalized)) teaSpoons = 3; // default baseline

  const totalGlasses = waterGlasses + milkGlasses || 1; // avoid div by zero

  // spices adjustment
  const spiceList = ['masala', 'cardamom', 'cardamon', 'clove', 'ginger'];
  let spiceCount = 0;
  spiceList.forEach(s => { if (new RegExp('\\b' + s + '\\b').test(normalized)) spiceCount += 1; });

  // each spice increases perceived strength slightly
  const spiceBoost = 0.5 * spiceCount;

  const effectiveSpoons = teaSpoons + spiceBoost;
  const spoonsPerGlass = effectiveSpoons / totalGlasses;

  // strength thresholds (user: above 3 spoons per glass => strong)
  let verdict = '';
  if (spoonsPerGlass > 3) verdict = '🔥 Strong — this is a bold brew.';
  else if (spoonsPerGlass >= 2) verdict = '🌿 Medium — nicely balanced.';
  else verdict = '🍯 Light — gentle and milky.';

  // suggestions: compute required total spoons for thresholds
  const neededForStrong = Math.ceil((3.1) * totalGlasses - spiceBoost);
  const neededForMedium = Math.ceil((2) * totalGlasses - spiceBoost);

  let suggestion = '';
  if (spoonsPerGlass <= 3) {
    suggestion = `For a strong brew, use about ${Math.max(neededForStrong, 0)} spoons total (${(neededForStrong/totalGlasses).toFixed(1)} spoons/glass).`;
  } else {
    suggestion = `To make it milder, reduce to about ${Math.max(neededForMedium, 0)} spoons total (${(neededForMedium/totalGlasses).toFixed(1)} spoons/glass).`;
  }

  result.innerHTML = `Detected: ${waterGlasses} glass(es) water, ${milkGlasses} glass(es) milk, ${teaSpoons} spoon(s) tea powder.<br>` +
                     `Spices: ${spiceCount} (boost ${spiceBoost.toFixed(1)}).<br>` +
                     `Effective spoons per glass: ${spoonsPerGlass.toFixed(2)}.<br>` +
                     `${verdict}<br>` +
                     `${suggestion}`;
}