    // JS - Handle dropdowns (scale, chords, ...)

// Elements
const distance_container = document.getElementById('distances');
const notes_container = document.getElementById('notes');
const accords_container = document.getElementById('accords');
const dropdown_gamme = document.getElementById('gamme');
const dropdown_tonalite = document.getElementById('tonalite');
const label_preview = document.getElementById('preview');
const chords_dropdown = document.getElementById('chords-dropdown');
const freboard_chords = document.getElementById('chords-table');
const checkboxes_container = document.getElementById('chords-menu');

const gammes = [
    // 0 (majeure naturelle)
    [1, 1, 0.5, 1, 1, 1, 0.5],

    // 1 (mineure naturelle)
    [1, 0.5, 1, 1, 0.5, 1, 1],
]

const notes = [
    "Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si",
]

// Funcs
function updatePreview() {
    let value = notes[parseInt(dropdown_tonalite.value)];
    switch (dropdown_gamme.value) {
        case "0":
            value += " M";
            break;
    
        case "1":
            value += " m";
            break;

        default:
            value += "GAMME INCONNUE !"
            break;
    }
    label_preview.innerText = value;
}

function updateChordsDropdown(notes_gamme) {
    
    // Clear any child
    chords_dropdown.innerHTML = '';

    // Custom option
    const option_element = document.createElement('option');
    option_element.innerText = '*'
    option_element.value = notes_gamme.toString()
    chords_dropdown.appendChild(option_element);

    for (let i=0; i<notes_gamme.length; i++) {
        const current = notes_gamme[i];
        const option_element = document.createElement('option');
        
        // Name
        option_element.innerText = current;
        
        // Value
        option_element.value = current;

        // Add option
        chords_dropdown.appendChild(option_element);
    }
    updateFretBoard();
}

function getNotesFromGamme(gamme) {
    const tonalite_index = parseInt(dropdown_tonalite.value);

    let compteur = tonalite_index;
    const notes_gamme = [notes[compteur]];
    // Calcul des notes dans la gamme
    for (let i=0; i<gamme.length; i++) {
        const distance = gamme[i];
        
        if (distance === 1) {
            // 1 tons
            compteur = (compteur + 2) % notes.length;
            // console.log('On avance de 1 tons :', compteur, notes[compteur])
            
        } else if (distance === 0.5) {
            // 1/2 tons
            compteur = (compteur + 1) % notes.length;
            // console.log('On avance de 1/2 tons :', compteur, notes[compteur])
            
        }

        notes_gamme.push(notes[compteur])

    }

    return notes_gamme;

}

function updateTableDistances(gamme) {

    const distances_values = [" "]
    for (let index = 0; index < gamme.length; index++) {
        const element = gamme[index];
        distances_values.push(element.toString(), " ")
    }

    // Set distances
    let counter = 0;
    Array.from(distance_container.children).forEach( (child) => {
        child.innerText = distances_values[counter];
        counter += 1
    })
}

function updateTableNotes(notes) {
    let counter = 0;
    let index = 0;
    Array.from(notes_container.children).forEach( (child => {
        if ((counter % 2 ) === 1) {
            // Set space
            child.innerText = ' '
        } else {
            // Set value
            child.innerText = notes[index]
            index += 1;
        }
        // console.log(child);
        counter += 1;
    }))
}

function getDistanceBetweenNotes(noteA, noteB, gamme) {
    if (noteB < noteA) {
        noteB += gamme.length;
    }
    
    distance_relative = noteB - noteA;

    let total = 0;
    // console.log("a", noteA, "b", noteB, "distance:", distance_relative);

    for (let i=noteA; i<noteB; i++) {
        total += gamme[(i%gamme.length)];
    }

    return total;
}

function getAccordsClass(dist_fondamentale_tierce, dist_fondamentale_quinte) {
    // Accord majeure
    if (dist_fondamentale_tierce === 2 && dist_fondamentale_quinte === 3.5) {
        return "maj"

    // Accords mineure
    } if (dist_fondamentale_tierce === 1.5 && dist_fondamentale_quinte === 3.5) {
        return "min"
    }

    // Accord diminué
    if (dist_fondamentale_tierce === 1.5 && dist_fondamentale_quinte === 3) {
        return "mb5"
    }

    alert('Accord inconnu');
}

function getAccordsName(fondamentaleName, dist_fondamentale_tierce, dist_fondamentale_quinte) {
    
    // Accord majeure
    if (dist_fondamentale_tierce === 2 && dist_fondamentale_quinte === 3.5) {
        return fondamentaleName + " M"

    // Accords mineure
    } if (dist_fondamentale_tierce === 1.5 && dist_fondamentale_quinte === 3.5) {
        return fondamentaleName + " m"
    }

    // Accord diminué
    if (dist_fondamentale_tierce === 1.5 && dist_fondamentale_quinte === 3) {
        return fondamentaleName + "m ♭5"
    }

    alert('Accord inconnu');
}

function updateTableAccords(notes_gamme, gamme) {
    const accords_rows = Array.from(accords_container.children);
    notes_gamme.pop(); // Remove last note (same as first)

    for (let i=0; i<notes_gamme.length; i++) {
        const row = accords_rows[i];

        const fondamentale_i = (i+0) % notes_gamme.length;
        const tierce_i = (i+2) % notes_gamme.length;
        const quinte_i = (i+4) % notes_gamme.length;

        const fondamentale = notes_gamme[fondamentale_i];
        const tierce = notes_gamme[tierce_i];
        const quinte = notes_gamme[quinte_i];

        const distance_f_3 = getDistanceBetweenNotes(fondamentale_i, tierce_i, gamme);
        const distance_f_5 = getDistanceBetweenNotes(fondamentale_i, quinte_i, gamme);
        const distance_3_5 = getDistanceBetweenNotes(tierce_i, quinte_i, gamme);
        
        const accord = getAccordsName(fondamentale, distance_f_3, distance_f_5);
        const classValue = getAccordsClass(distance_f_3, distance_f_5);

        // Note des notes composant l'accord
        row.children[0].innerText = fondamentale;
        row.children[2].innerText = tierce;
        row.children[4].innerText = quinte;

        // Distance entre les notes
        row.children[1].innerText = distance_f_3;
        row.children[3].innerText = distance_3_5;

        // Nom de l'accord / sa classe (pour la couleur)
        row.children[5].innerText = accord;
        row.children[5].className = ''; // Clear any class
        row.children[5].classList.add(classValue);
    }
}

function updateTable() {

    const selection = dropdown_gamme.value;
    // Index
    const selection_index = parseInt(selection);

    // Preview
    updatePreview();

    // Current game
    const gamme = gammes[selection_index];

    // Notes de la gamme
    const notes_gamme = getNotesFromGamme(gamme);

    // Afficher notes
    updateTableNotes(notes_gamme);

    // Afficher distances
    updateTableDistances(gamme);

    // Afficher accords
    updateTableAccords(notes_gamme, gamme)

    // MAJ Dropdown accords
    updateChordsDropdown(notes_gamme);
}

function updateFretBoard() {
    // check current value
    const value = chords_dropdown.value;
    const values = value.split(',');

    rows = Array.from(freboard_chords.children);

    for (let i=0; i<rows.length; i++) {
        const row = rows[i];
            
        Array.from(row.children).forEach( (cell) => {
            // Clear classes
            cell.className = '';

            if (values.includes(cell.innerText)) {
                
                // Check if corresponding checkbox is checked
                if (checkboxes_container.children[i].children[0].checked) {
                    // Add class
                    cell.classList.add('highlight');
                }
            }
            
        })
    }
}

// Events
dropdown_gamme.addEventListener('change', updateTable);
dropdown_tonalite.addEventListener('change', updateTable);

chords_dropdown.addEventListener('change', updateFretBoard);

Array.from(checkboxes_container.children).forEach( (checkbox) => {
    const input = checkbox.children[0];
    input.addEventListener('change', updateFretBoard);
})

// Trigger once
updateTable();
updateFretBoard();