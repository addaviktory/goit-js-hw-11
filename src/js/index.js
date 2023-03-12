import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PicsApiService from './axiosPics';



const refs = {
    formEl: document.querySelector('.search-form'),
    galleryComponent: document.querySelector('.gallery'),
    buttonSearch: document.querySelector('.btn-submit'),
    buttonLoadMore: document.querySelector('[data-action="load-more"]'),
    containerForLoadBtn: document.querySelector('.btn-load-container'),
  };


refs.formEl.addEventListener('submit', onSubmit)
refs.buttonLoadMore.addEventListener('click', onLoadMore)


async function onLoadMore() {
  serviceApi.incrementPage();
await insertMarkup();

if (serviceApi.page === serviceApi.totalPages) {
  refs.buttonLoadMore.classList.add('hidden');
  Notiflix.Notify.info('Your search result comes to an end:((');
  return;
}
}
const slider = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  scrollZoom: false,
});

let valueSearch = '';
let isPrevious;

const serviceApi = new PicsApiService();

async function onSubmit(event) {
    event.preventDefault();
    valueSearch = refs.formEl.elements.searchQuery.value.trim();
  
    if (valueSearch === '') {
      onErrorNotify();
      return;
    }
  
    refs.containerForLoadBtn.classList.add('hidden');
    refs.buttonLoadMore.classList.add('hidden');
    refs.galleryComponent.innerHTML = '';
    serviceApi.resetPage();
  
    const previousWord = event.currentTarget.elements.searchQuery.value.trim();
  
    if (isPrevious === previousWord) {
      Notiflix.Notify.info('Enter new word to search');
      return;
    }
  
    await insertMarkup();
    if (serviceApi.arrRespLength === 0) {
      Notiflix.Notify.failure('Try to Enter another word');
      return;
    }
    if (serviceApi.respDataTotal !== 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${serviceApi.respDataTotal} images for you.`
      );
    }
    if (serviceApi.totalPages === 1) {
      return;
    }
  
    refs.containerForLoadBtn.classList.remove('hidden');
    refs.buttonLoadMore.classList.remove('hidden');
    refs.buttonLoadMore.classList.add('btn');
  
    return (isPrevious = previousWord);
  }

  async function insertMarkup() {
    valueSearch = refs.formEl.elements.searchQuery.value.trim();
    serviceApi.searchQuery = valueSearch;
  
    refs.buttonLoadMore.classList.remove('hidden');
    refs.galleryComponent.insertAdjacentHTML(
      'beforeend',
      createMarkup(await serviceApi.fetchPics())
    );
    slider.refresh();
  }
  
  function onErrorNotify() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  function createMarkup(arr) {
    const markup = arr
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<a class="gallery__item" href='${largeImageURL}'><div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" class='img'/>
          <div class="info">
            <p class="info-item">
              <b>Likes<br>${likes}</br></b>
            </p>
            <p class="info-item">
              <b>Views<br>${views}</br></b>
            </p>
            <p class="info-item">
              <b>Comments<br>${comments}</br></b>
            </p>
            <p class="info-item">
              <b>Downloads<br>${downloads}</br></b>
            </p>
          </div>
        </div></a>`
      )
      .join('');
    return markup;
  }