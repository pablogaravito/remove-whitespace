function removeExtraSpaces(text) {
  return text
    .replace(/\s+/g, " ") // collapse repeated spaces
    .replace(/\n\s+/g, "\n") // trim indentation
    .trim(); // remove leading/trailing whitespace
}

document.getElementById("processBtn").onclick = () => {
  const input = document.getElementById("inputText").value;
  document.getElementById("outputText").value = removeExtraSpaces(input);
};

document.getElementById("clearBtn").onclick = () => {
  document.getElementById("inputText").value = "";
  document.getElementById("outputText").value = "";
};

document.getElementById("copyBtn").onclick = () => {
  const out = document.getElementById("outputText");
  out.select();
  navigator.clipboard.writeText(out.value);
  alert("Copied to clipboard!");
};
