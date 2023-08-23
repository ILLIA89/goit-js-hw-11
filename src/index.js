// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";

// ------- створення HTML запиту через axios----------

const KEY = '38992865-c049898a3c4114f4b25977ee3';
const respAPI = '&image_type=photo&orientation=horizontal&safesearch=true'
const perPage = 40; 
let page = 1;
let namePhoto = ' ';

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function searchPhoto(namePhoto, page = 1, perPage = 40) {
    const response = await axios('?key=${KEY}&q=${namePhoto}${respAPI}&page=${page}&per_page=${perPage}');
    
    return response;
}

// створюємо слайдер для картинок за допомогою SimpleLightbox

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
})

const searchFormPhoto = document.querySelector('#search-form');
const galleryPhoto = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchFormPhoto.addEventListener('submit', onSubmitPhoto);
loadMoreBtn.addEventListener('click', onLoadMore);

//  кнопка пошуку фотографій
async function onSubmitPhoto(e) {
    e.preventDefault();
    galleryPhoto.innerHTML = '';
    loadMoreBtn.style.display = 'none';
// введена назва картинки в поле пошуку і перевірка на то чи така назва картинки існує
    // як ні то видає повідомлення (зроблено з використанням бібліотеки notiflix)
    namePhoto = e.target.elements.searchQuery.value.trim(); 
    if (!namePhoto) {
        return Notify.failure(
'Sorry, the search field cannot be empty. Please enter information to search.'
        );
    }
    const { data } = await searchFormPhoto(namePhoto);

    // створення картки з фотографією
    cardPhoto(data); 
    // створення повідомлення
    mssageinfo(data);
    // всі зображення знайдені
    stopSearch(data);
    // чистка інпуту
    e.target.reset();

    // кнопка завантаження

    async function onLoadMore() {
        page += 1;
        const { data } = await searchPhoto(namePhoto, page, perPage);
        cardPhoto(data);
        stopSearch(data);
        // прокрутка зображення
        smoothScroll(); 
    }

} 

// функція для створення картки  
function cardPhoto(arr) {
    const markUp = arr.hits
        .map(el => {
            return ` <div class="photo-card">
    <a class="gallery-link" href="${el.largeImageURL}">
    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
    </a>
    <div class="info">
    <p class="info-item"><b>Likes</b>${el.likes}
    </p>
    <p class="info-item"><b>Views</b>${el.views}
    </p>
    <p class="info-item"><b>Comments</b>${el.comments}
    </p>
    <p class="info-item"><b>Downloads</b>${el.downloads}
    </p>
    </div>
    </div>`
        }).join('');
    galleryPhoto.insertAdjacentHTML('beforeend', markUp);
    lightbox.refresh();
}

// функції всіх повідомлень
