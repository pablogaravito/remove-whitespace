/* -------------------------------------------------------
   Toast notification
--------------------------------------------------------*/
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.opacity = 1;
  setTimeout(() => {
    t.style.opacity = 0;
  }, 1600);
}

/* -------------------------------------------------------
   Safe comment remover (preserves URLs & strings)
--------------------------------------------------------*/
function stripCommentsSafe(code) {
  let out = "";
  let i = 0;
  let inStr = false;
  let strChar = "";
  let inTemplate = false;
  let inBlockComment = false;
  let inLineComment = false;

  while (i < code.length) {
    const c = code[i];
    const next = code[i + 1];

    // Inside // line comment
    if (inLineComment) {
      if (c === "\n") {
        inLineComment = false;
        out += c;
      }
      i++;
      continue;
    }

    // Inside /* block comment */
    if (inBlockComment) {
      if (c === "*" && next === "/") {
        inBlockComment = false;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    // Inside string
    if (inStr) {
      out += c;
      if (c === "\\" && code[i + 1]) {
        out += code[i + 1];
        i += 2;
        continue;
      }
      if (c === strChar) {
        inStr = false;
      }
      i++;
      continue;
    }

    // Inside template literal
    if (inTemplate) {
      out += c;
      if (c === "`") {
        inTemplate = false;
      } else if (c === "\\" && code[i + 1]) {
        out += code[i + 1];
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    // Detect new strings
    if (c === "'" || c === '"') {
      inStr = true;
      strChar = c;
      out += c;
      i++;
      continue;
    }

    // Detect template literals
    if (c === "`") {
      inTemplate = true;
      out += c;
      i++;
      continue;
    }

    // Detect // comments (must NOT be http://)
    if (c === "/" && next === "/") {
      // Check previous characters to avoid matching https://
      const prev = code[i - 1];
      const prevPrev = code[i - 2];

      const isURL =
        (prev === ":" && prevPrev === "p") || // http:
        (prev === ":" && prevPrev === "s"); // https:

      if (!isURL) {
        inLineComment = true;
        i += 2;
        continue;
      }
    }

    // Detect /* block comments */
    if (c === "/" && next === "*") {
      inBlockComment = true;
      i += 2;
      continue;
    }

    // Default: keep the character
    out += c;
    i++;
  }

  return out;
}

/* -------------------------------------------------------
   Remove extra spaces
--------------------------------------------------------*/
function removeExtraSpaces(text) {
  return text.replace(/\s+/g, " ").replace(/\n\s+/g, "\n").trim();
}

/* -------------------------------------------------------
   Update size / character counter
--------------------------------------------------------*/
function updateStats(textarea, statsElement) {
  const text = textarea.value;
  const chars = text.length;
  const kb = (chars / 1024).toFixed(2);
  statsElement.textContent = `Size: ${kb} KB, ${chars} characters`;
}

/* -------------------------------------------------------
   Main processing pipeline
--------------------------------------------------------*/
function process() {
  let input = document.getElementById("inputText").value;
  const removeCom = document.getElementById("removeComments").checked;

  if (removeCom) input = stripCommentsSafe(input);

  const output = removeExtraSpaces(input);

  const outBox = document.getElementById("outputText");
  outBox.value = output;

  updateStats(outBox, document.getElementById("outputStats"));
}

/* -------------------------------------------------------
   Auto mode
--------------------------------------------------------*/
document.getElementById("autoToggle").onchange = () => {
  if (document.getElementById("autoToggle").checked) process();
};

/* -------------------------------------------------------
   Input listener (live stats + auto)
--------------------------------------------------------*/
document.getElementById("inputText").addEventListener("input", () => {
  updateStats(
    document.getElementById("inputText"),
    document.getElementById("inputStats")
  );
  if (document.getElementById("autoToggle").checked) process();
});

/* -------------------------------------------------------
   Buttons
--------------------------------------------------------*/
document.getElementById("processBtn").onclick = process;

document.getElementById("clearInput").onclick = () => {
  document.getElementById("inputText").value = "";
  updateStats(
    document.getElementById("inputText"),
    document.getElementById("inputStats")
  );
  if (document.getElementById("autoToggle").checked) process();
};

document.getElementById("clearOutput").onclick = () => {
  document.getElementById("outputText").value = "";
  updateStats(
    document.getElementById("outputText"),
    document.getElementById("outputStats")
  );
};

/* Copies with toasts */
document.getElementById("copyInput").onclick = () => {
  navigator.clipboard.writeText(document.getElementById("inputText").value);
  toast("Input copied!");
};

document.getElementById("copyOutput").onclick = () => {
  navigator.clipboard.writeText(document.getElementById("outputText").value);
  toast("Output copied!");
};

/* Init stats */
updateStats(
  document.getElementById("inputText"),
  document.getElementById("inputStats")
);
updateStats(
  document.getElementById("outputText"),
  document.getElementById("outputStats")
);
