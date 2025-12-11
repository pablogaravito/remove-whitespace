// clean spaces
function removeExtraSpaces(text) {
  return text
    .replace(/\s+/g, " ") // Collapse repeated spaces
    .replace(/\n\s+/g, "\n") // Trim indentation per line
    .trim();
}

// show stats
function updateStats(element, statsElement) {
  const text = element.value;
  const chars = text.length;
  const kb = (chars / 1024).toFixed(2);
  statsElement.textContent = `Size: ${kb} KB, ${chars} characters`;
}

// process function
function process() {
  const input = document.getElementById("inputText").value;
  const output = removeExtraSpaces(input);
  const outputBox = document.getElementById("outputText");
  outputBox.value = output;
  updateStats(outputBox, document.getElementById("outputStats"));
}

// auto toggle
const autoToggle = document.getElementById("autoToggle");
autoToggle.onchange = () => {
  if (autoToggle.checked) process();
};

// input events
document.getElementById("inputText").addEventListener("input", () => {
  updateStats(
    document.getElementById("inputText"),
    document.getElementById("inputStats")
  );
  if (autoToggle.checked) process();
});

// manual process button
document.getElementById("processBtn").onclick = process;

// clear buttons
document.getElementById("clearInput").onclick = () => {
  document.getElementById("inputText").value = "";
  updateStats(
    document.getElementById("inputText"),
    document.getElementById("inputStats")
  );
  if (autoToggle.checked) process();
};

document.getElementById("clearOutput").onclick = () => {
  document.getElementById("outputText").value = "";
  updateStats(
    document.getElementById("outputText"),
    document.getElementById("outputStats")
  );
};

// copy buttons
document.getElementById("copyInput").onclick = () => {
  navigator.clipboard.writeText(document.getElementById("inputText").value);
  alert("Input copied!");
};

document.getElementById("copyOutput").onclick = () => {
  navigator.clipboard.writeText(document.getElementById("outputText").value);
  alert("Output copied!");
};

// initial stats
updateStats(
  document.getElementById("inputText"),
  document.getElementById("inputStats")
);
updateStats(
  document.getElementById("outputText"),
  document.getElementById("outputStats")
);
