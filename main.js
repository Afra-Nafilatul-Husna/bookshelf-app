// awalll bgt  KUDU BEGINI untuk menghindari reload ketika form telah di submit 
document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('bookForm');
    form.addEventListener('submit', function(event){
        event.preventDefault();
        tambahBuku();        
    })
})
// WEB STORAGE
function saveDataToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(objectBuku));
}

function loadDataFromLocalStorage() {
    const serializedData = localStorage.getItem('books');
    if (serializedData !== null) {
        const data = JSON.parse(serializedData);

        for (let buku of data) {
            delete buku.selesai;
        }
        
        objectBuku.push(...data);
    }
}

window.addEventListener('load', function () {
    if (typeof (Storage) !== 'undefined') {
        loadDataFromLocalStorage();
        document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
        alert('Browser tidak mendukung Web Storage');
    }
});

function tambahBuku(){
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);

    // object buku
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const buku = identitasBuku(title, author, year, isComplete);    
    objectBuku.push(buku);

    // custom event beserta pemanggilanny
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataToLocalStorage();
        
};

function identitasBuku(title, author, year, isComplete){
    return{
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    }
}

// array tempat setiap objectBuku dimasukkan 
const objectBuku = [];
const RENDER_EVENT = 'render-buku'; //Sebuah custom event yang digunakan untuk memicu pembaruan tampilan daftar buku.

document.addEventListener(RENDER_EVENT, function () {
    console.log(objectBuku);

    const belumSelesaiBaca = document.getElementById('incompleteBookList');
    belumSelesaiBaca.innerHTML = ''; //Mengosongkan elemen HTML "Belum selesai dibaca" sebelum menambahkan elemen baru.

    const isComplete = document.getElementById('completeBookList');
    isComplete.innerHTML = '';
  
    for (const setiapBuku of objectBuku){
        const bukuElement = buatBukuElement(setiapBuku);     

        if (!setiapBuku.isComplete){
            belumSelesaiBaca.append(bukuElement);
        }else{
            isComplete.append(bukuElement);
        }
    }
});

function buatBukuElement(identitasBuku) {
    // Membuat elemen untuk title, author, dan year
    const elementtitle = document.createElement('h3');
    elementtitle.setAttribute('data-testid', 'bookItemTitle')
    elementtitle.innerText = `Judul: ${identitasBuku.title}`;

    const elementauthor = document.createElement('p');
    elementauthor.setAttribute('data-testid', 'bookItemAuthor')
    elementauthor.innerText = `Penulis: ${identitasBuku.author}`;

    const elementyear = document.createElement('p');
    elementyear.setAttribute('data-testid', 'bookItemYear')
    elementyear.innerText = `Tahun: ${identitasBuku.year}`;

   
        // Membuat tombol SELESAI baca
        const buttonSelesaiBaca = document.createElement('button');
        buttonSelesaiBaca.innerText = 'Selesai dibaca';
        buttonSelesaiBaca.setAttribute('id', 'btnSelesaiBaca');
        buttonSelesaiBaca.setAttribute('data-testid', 'bookItemIsCompleteButton');
        buttonSelesaiBaca.addEventListener('click', function () {
            console.log(`Buku "${identitasBuku.title}" selesai dibaca.`);
            identitasBuku.isComplete = !identitasBuku.isComplete;            document.dispatchEvent(new Event(RENDER_EVENT));
            saveDataToLocalStorage();

        });

    // Membuat tombol HAPUS buku
    const buttonHapusBuku = document.createElement('button');
    buttonHapusBuku.innerText = 'Hapus Buku';
    buttonHapusBuku.setAttribute('id', 'btnHapusBuku');
    buttonHapusBuku.setAttribute('data-testid', 'bookItemDeleteButton');
    buttonHapusBuku.addEventListener('click', function () {
        console.log(`Buku "${identitasBuku.title}" dihapus.`);
    const index = objectBuku.findIndex((buku) => buku.id === identitasBuku.id);
        if (index !== -1){
            objectBuku.splice(index, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveDataToLocalStorage();

        }
    });

    // Membuat tombol EDIT buku
    const buttonEditBuku = document.createElement('button');
    // buttonEditBuku.innerText = 'Edit Buku';
    buttonEditBuku.setAttribute('id', 'btnEditBuku');
    buttonEditBuku.setAttribute('data-testid', 'bookItemEditButton');
    buttonEditBuku.addEventListener('click', function () {
        console.log(`Buku "${identitasBuku.title}" diedit.`);
        // Tambahkan logika untuk mengedit data buku
    });

    // Menempatkan tombol-tombol ke dalam satu container tombol
    const buttonContainer = document.createElement('div');
    buttonContainer.append(buttonSelesaiBaca, buttonHapusBuku);

    // Membuat container utama untuk buku
    const container = document.createElement('div');
    container.setAttribute('data-bookid', identitasBuku.id); // Menyimpan ID buku
    container.setAttribute('data-testid', 'bookItem');
    container.append(elementtitle, elementauthor, elementyear, buttonContainer);

    // Menambahkan buku ke daftar "Belum selesai dibaca"
    const containerBlmSelesai = document.getElementById('incompleteBookList');
    containerBlmSelesai.append(container);

    return container;
}