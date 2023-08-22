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

