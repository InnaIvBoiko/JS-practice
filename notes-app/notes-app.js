const notesWrap = document.querySelector('.swiper');
const notesList = document.querySelector('.notes-list');
const addNew = document.querySelector('.add-note');

const key = 'NOTES_LIST';

let notesListLS = JSON.parse(localStorage.getItem(key));

const markupNote = (id, text) => {
    return (`<li 
        class="notes-item swiper-slide" id =${id} >
            <div class="notes-header">
                <button type="button" class="edit">
                    <i
                        class="fa-regular fa-pen-to-square"
                        style="color: #fff"
                    ></i>
                </button>
                <button type="button" class="delete">
                    <i class="fa-regular fa-trash-can" style="color: #fff"></i>
                </button>
            </div>
            <div class="note-text">
                <p class="main">${text}</p>
                <textarea class="text hidden" name="note" id="1"></textarea>
            </div>
                <button type="button" class="save hidden">
                <i class="fa-solid fa-check" style="color: #9181ff"></i>
            </button>    
        </li>`);
};

if (notesListLS === null) {
    
    localStorage.setItem(key, '[ ]');
    notesListLS = JSON.parse(localStorage.getItem(key));

} else if (notesListLS.length !== 0) {
    
    const notesListHtml = notesListLS.map(({ id, text }) => {
        return markupNote(`${id}`, `${text}`);
    }).join('');

    notesList.innerHTML = notesListHtml;
    notesWrap.classList.remove('hidden');
};

addNew.addEventListener('click', () => {
    const id = Date.now();

    if (notesListLS.length === 0) {
        notesWrap.classList.remove('hidden');
    } else {
        const htmlItem = markupNote(id, '');
        notesList.insertAdjacentHTML('beforeend', htmlItem);
    };
});

notesList.addEventListener('click', (event) => {
    const currentId = event.target.offsetParent.id ? event.target.offsetParent.id : event.target.parentElement.offsetParent.id;    
    const noteById = document.getElementById(`${currentId}`);
    const textArea = noteById.querySelector('.text');
    const mainText = noteById.querySelector('.main');
    const editBtn = noteById.querySelector('.edit');
    const deleteBtn = noteById.querySelector('.delete');
    const saveBtn = noteById.querySelector('.save');

    textArea.addEventListener('input', (e) => {
        mainText.textContent= e.target.value;   
    });
    
    if (event.target.className === 'fa-solid fa-check' && mainText.textContent) {
        const toLS = {
            id: currentId,
            text: String(mainText.textContent)
        };

        if (notesListLS.length > 0) {
            const editNotesListLS = notesListLS.filter(el => el.id !== currentId);

            localStorage.setItem(key, JSON.stringify(editNotesListLS));
            notesListLS = JSON.parse(localStorage.getItem(key));
        };
        
        notesListLS.push(toLS);

        localStorage.setItem(key, JSON.stringify(notesListLS));
    
        saveBtn.classList.add('hidden');
        editBtn.classList.remove('hidden');
        mainText.classList.remove('hidden');
        textArea.classList.add('hidden');

    } else if (event.target.className === 'fa-solid fa-check') {
        alert('You need to create some note before save it');
    };

    if (event.target.className === 'fa-regular fa-pen-to-square') {
        textArea.value = mainText.textContent;
        saveBtn.classList.remove('hidden');
        editBtn.classList.add('hidden');
        mainText.classList.add('hidden');
        textArea.classList.remove('hidden');
    };

    if (event.target.className === 'fa-regular fa-trash-can') {
        const newNotesListLS = notesListLS.filter(el => el.id !== currentId);
       
        localStorage.setItem(key, JSON.stringify(newNotesListLS));
        document.location.reload();
    };
});
