/**
 * Bruin Score Check Chrome Extension
 * @author Haechan Song, hcsong213@gmail.com
 * with code segments from:
 * https://github.com/preethamrn/BruinWalkChromeExtension
 */

/**
 * Below code segment adapted from:
 * https://github.com/preethamrn/BruinWalkChromeExtension beUclaEduMain.js
 */

//Summate upon initial load
summate();

//MyUcla often stays on the same page while reloading the DOM subtree to load
//new content. The following runs the extension's functionality upon
//each DOM modification.
var timeout = null;
document.addEventListener(
  "DOMSubtreeModified",
  function () {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(listener, 1000);
  },
  false
);

function listener() {
  var windowURL = "" + window.location.href;
  if (windowURL.includes("be.my.ucla.edu")) {
    summate();
  }
}

/**
 * @author Haechan Song
 */
console.log("Begin summate.js");
//The following if statement checks if a final grade has already been
//released. If so, it will not calculate an unofficial grade.
function summate() {
  if (
    document.getElementById("myUCLAGradesGridFoo").lastElementChild
      .lastElementChild.firstElementChild.nextElementSibling.innerHTML == "N/A"
  ) {
    var fraction = { studentScore: 0, possibleScore: 0 };

    //summate the numerator and denominator
    let currentRow = document.getElementById("myUCLAGradesGridFoo")
      .lastElementChild.firstElementChild.nextElementSibling;
    let cell;
    while (currentRow) {
      cell = currentRow.firstElementChild.nextElementSibling;
      if (cell) {
        parseAndSum(cell.innerHTML, fraction);
        console.log("fraction: ", fraction);
      }
      //"incrememnt" currentRow to the row below it
      currentRow = currentRow.nextElementSibling;
    }
    console.log("At summate.js - Final tally: ", fraction);

    //append the info
    cell.appendChild(document.createElement("br"));
    cell.appendChild(stylizedSpan(gradeAsFraction(fraction)));
    if (fraction.possibleScore != 0) {
      cell.appendChild(document.createElement("br"));
      cell.appendChild(stylizedSpan(gradeAsPercent(fraction)));
    }

    cell = cell.previousElementSibling;
    cell.appendChild(document.createElement("br"));
    cell.appendChild(stylizedSpan("Unofficial Final Grade"));
  }
}

//abstracted functions
function parseAndSum(grade, f) {
  let slash = grade.indexOf("/");
  let numberCandidate;
  numberCandidate = parseFloat(grade.substr(0, slash));
  if (!isNaN(numberCandidate)) f.studentScore += numberCandidate;
  numberCandidate = parseFloat(grade.substr(slash + 1));
  if (!isNaN(numberCandidate)) f.possibleScore += numberCandidate;
}

function stylizedSpan(textContent) {
  const res = document.createElement("span");
  res.appendChild(document.createTextNode(textContent));
  res.style.color = "#4E8DB6";
  return res;
}

function gradeAsFraction(frac) {
  return frac.studentScore.toString() + " / " + frac.possibleScore.toString();
}

function gradeAsPercent(frac) {
  let percent = (frac.studentScore / frac.possibleScore) * 100;
  return percent.toString().substr(0, 5) + "%";
}
