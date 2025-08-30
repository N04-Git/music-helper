// Elements
const gamme_dropdown = document.getElementById('gamme-dropdown');
const variations_dropdown = document.getElementById('variations-dropdown');
const notes_table = document.getElementById('chords-table')

const VARIATIONS_MAP = {
    // Gamme majeure
    "0": [0, 1],
    // Gamme mineure
    "1": [0]
}

const GAMMES_PATTERNS = [
    // Gamme majeure
    [
        [[2, 7], [2, 5], [1, 7], [1, 6], [1, 4], [0, 7], [0, 5], [0, 4]],
        [[5, 7], [5, 5], [5, 3], [4, 7], [4, 5], [4, 3], [3, 6], [3, 5], [3, 3], [2, 6], [2, 5], [2, 3], [1, 5], [1, 3], [1, 2], [0, 5], [0, 3], [0, 2]],
    ],
    // Gamme mineure
    [
        [[5, 7], [5, 5], [5, 4], [4, 7], [4, 5], [4, 4], [3, 7], [3, 5], [2, 8], [2, 7], [2, 5], [1, 7], [1, 6], [1, 4], [0, 7], [0, 5], [0, 4]],
    ],
]

// Funcs

function clearFretboardClass() {
    rows = Array.from(notes_table.children);

    rows.forEach( (row) => {
        Array.from(row.children).forEach( (column) => {
            column.className = '';
        })
    })
}

function setFretboardClass(cell_row, cell_col, className) {
    notes_table.children[cell_row].children[cell_col].classList.add(className);
}

function update_fretboard() {
    // Current values
    const gamme_i = gamme_dropdown.value;
    const variations_i = variations_dropdown.value;

    const pattern = GAMMES_PATTERNS[parseInt(gamme_i)][parseInt(variations_i)];

    clearFretboardClass();

    // Set classes on cell
    pattern.forEach((value) => {
        const row = value[0];
        const col = value[1];
        setFretboardClass(row, col, 'highlight');
    })
}

function gamme_update () {
    // Set new variations values
    values = VARIATIONS_MAP[(gamme_dropdown.value)];
    variations_dropdown.innerHTML = '';
    
    values.forEach(variation_nb => {
        const new_option = document.createElement('option');
        new_option.value = variation_nb.toString();
        new_option.innerText = (variation_nb+1).toString();
        variations_dropdown.appendChild(new_option);
    });

    // Update fretboard
    update_fretboard();
}

function variation_update () {
    // Update fretboard
    update_fretboard();
}


// Events
gamme_dropdown.addEventListener('change', gamme_update);
variations_dropdown.addEventListener('change', variation_update);

// Init
gamme_update();