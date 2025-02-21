const equationList = document.getElementById('equationList');
const subjectListEl = document.getElementById('subjectList');
const variableListEl = document.getElementById('variableList');

let equations = []; // Will be loaded from equations.json
let sortOrder = 'asc'; // 'asc' for ascending, 'desc' for descending

// Fetch equations from the external JSON file
function fetchEquations() {
  fetch('equations.json')
    .then(response => response.json())
    .then(data => {
      equations = data.equations;
      populateFilters();      // Populate filter checkboxes based on fetched data
      updateEquationList();   // Render equations
    })
    .catch(err => console.error("Failed to load equations:", err));
}

// Populate the subject and variable filters dynamically
function populateFilters() {
  // Use sets to get unique values
  const subjectSet = new Set();
  const variableSet = new Set();
  
  equations.forEach(eq => {
    if (eq.subject) {
      subjectSet.add(eq.subject);
    }
    if (eq.variables && Array.isArray(eq.variables)) {
      eq.variables.forEach(variable => variableSet.add(variable));
    }
  });
  
  // Clear existing content (if any)
  subjectListEl.innerHTML = "";
  variableListEl.innerHTML = "";
  
  // Create checkboxes for subjects
  subjectSet.forEach(subject => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="checkbox" class="subject-checkbox" value="${subject}" onchange="updateEquationList()">
        ${subject}
      </label>
    `;
    subjectListEl.appendChild(li);
  });
  
  // Create checkboxes for variables
  variableSet.forEach(variable => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="checkbox" class="variable-checkbox" value="${variable}" onchange="updateEquationList()">
        ${variable}
      </label>
    `;
    variableListEl.appendChild(li);
  });
}

// Update displayed equations based on selected filters and sort order
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
    return sortOrder === 'asc'
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
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
    .then(() => console.log("Equations rendered successfully!"))
    .catch(err => console.error("MathJax rendering failed: ", err));
}

// Function to sort equations by title when header is clicked
function sortEquations(criteria) {
  if (criteria === 'title') {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    document.getElementById('sortArrow').innerHTML = sortOrder === 'asc' ? '&#8593;' : '&#8595;';
  }
  updateEquationList();
}

// Fetch equations when the page loads
fetchEquations();
