const equationList = document.getElementById('equationList');

// Dummy JSON data for equations with LaTeX format for MathJax
const equations = [
  {
    title: "Newton's Second Law",
    equation: "F = m \\cdot a",
    subject: "Physics",
    variables: ["Force", "Acceleration"]
  },
  {
    title: "Kinetic Energy",
    equation: "KE = \\frac{1}{2} m v^2",
    subject: "Physics",
    variables: ["Velocity"]
  },
  {
    title: "Area of a Circle",
    equation: "A = \\pi r^2",
    subject: "Mathematics",
    variables: ["Area"]
  },
  {
    title: "Pythagorean Theorem",
    equation: "a^2 + b^2 = c^2",
    subject: "Mathematics",
    variables: []
  }
];

// Initial sort order
let sortOrder = 'asc'; // or 'desc'

// Function to update displayed equations based on selected filters
function updateEquationList() {
  const selectedSubjects = Array.from(document.querySelectorAll('.subject-checkbox:checked'))
    .map(checkbox => checkbox.value);
  const selectedVariables = Array.from(document.querySelectorAll('.variable-checkbox:checked'))
    .map(checkbox => checkbox.value);

  equationList.innerHTML = '';

  const filteredEquations = equations.filter(eq => {
    const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(eq.subject);
    const matchesVariables = selectedVariables.length === 0 || selectedVariables.every(variable => eq.variables.includes(variable));
    return matchesSubject && matchesVariables;
  });

  // Sort equations by title
  const sortedEquations = filteredEquations.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (sortOrder === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });

  // Display sorted equations in table format
  sortedEquations.forEach(eq => {
    const row = document.createElement('div');
    row.classList.add('equation-row');

    const title = document.createElement('div');
    title.classList.add('equation-title');
    title.innerText = eq.title;

    const expression = document.createElement('div');
    expression.classList.add('equation-expression');
    expression.innerHTML = `\\(${eq.equation}\\)`; // Insert LaTeX expression

    const variables = document.createElement('div');
    variables.classList.add('equation-variables');
    variables.innerText = eq.variables.join(', ');

    const subject = document.createElement('div');
    subject.classList.add('equation-subject');
    subject.innerText = eq.subject;

    row.appendChild(title);
    row.appendChild(expression);
    row.appendChild(variables);
    row.appendChild(subject);

    equationList.appendChild(row);
  });

  // Re-render MathJax after updating the content
  MathJax.typesetPromise()
    .then(() => {
      console.log("Equations rendered successfully!");
    })
    .catch((err) => console.error("MathJax rendering failed: ", err));
}

// Function to sort equations by title
function sortEquations(criteria) {
  if (criteria === 'title') {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    document.getElementById('sortArrow').innerHTML = sortOrder === 'asc' ? '&#8593;' : '&#8595;'; // Change arrow direction
  }
  updateEquationList();
}

// Load all equations initially
updateEquationList();
