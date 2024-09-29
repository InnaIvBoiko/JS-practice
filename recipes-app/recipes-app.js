const categoriesList = document.querySelector('.meal-categories-list');
const randomMeal = document.querySelector('.random-meal');
const searchQuery = document.getElementById('search');
const resultSearch = document.querySelector('.search-result-list');
const mainFavouriteBtn = document.querySelector('#main-favourite');

const key = 'FAVOURITE_MEALS';

let favouriteListLS = JSON.parse(localStorage.getItem(key)); 

if ( favouriteListLS === null) {
    localStorage.setItem(key, '[ ]');
    favouriteListLS = JSON.parse(localStorage.getItem(key));
}  else if (favouriteListLS.length !== 0) {
    mainFavouriteBtn.firstChild.nextElementSibling.classList.add('fa-solid');
};


const getCategoriesList = async () => {
    const result = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await result.json();
    return data.categories;
};

const getRandomMeal = async () => {
    const result = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await result.json();
    return data.meals[0];
};

const getMealById = async (id) => {
    const result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await result.json();
    return data.meals[0];
};

const getMealByName = async (query) => {
    const result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await result.json();
    return data.meals;
};

const getMealByCategory = async (category) => {
    const result = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await result.json();
    return data.meals;
};


const startPage = () => {
    markUpCategories();
    getRandomMeal()
        .then((res) => {
            markUpMeal(res);
        }).catch((err) => {
            randomMeal.innerHTML = `<h3>Not found</h3>`;
            console.log(err)
        });
};


const markUpCategories = () => {
    const categories = getCategoriesList().then((res) => {
        const list = res.map(({ strCategoryThumb, strCategory }) => {
            return (
                `<li class="swiper-slide meal-categories-item">
                        <img
                        class="meal-categories-img"
                        src=${strCategoryThumb}
                        alt=${strCategory}
                        />
                        <span class="meal-categories-text">${strCategory}</span>
                    </li>`)
        }).join('');
             
        return categoriesList.insertAdjacentHTML('afterbegin', list);
    });
};

const markUpMealList = (arr) => {
    let mealsList = '';
    let htmlItem = '';
    
    arr.map(el => {
        const id = Number(`${el.idMeal}`);

        htmlItem = favouriteListLS.includes(id) ?
            `<li class="search-result-item" id=${el.idMeal}>
            <img class="search-result-img" src=${el.strMealThumb} alt=${el.strMeal}>
            <h2 class="search-result-text">${el.strMeal}</h2>
            <button type="button" class="is-favourite">
                <i class="fa-regular fa-heart fa-xl fa-solid"
                    style="color: #a0e7e5"
                ></i>
            </button>
        </li>` :
            `<li class="search-result-item" id=${el.idMeal}>
            <img class="search-result-img" src=${el.strMealThumb} alt=${el.strMeal}>
            <h2 class="search-result-text">${el.strMeal}</h2>
            <button type="button" class="is-favourite">
                <i class="fa-regular fa-heart fa-xl"
                    style="color: #a0e7e5"
                ></i>
            </button>
        </li>`;

        return mealsList += htmlItem
    });
    
    resultSearch.innerHTML = mealsList;
};

const markUpMeal = (data) => {
    const ingredientsList = markUpIngredients(data);
    const {
        idMeal,
        strMeal,
        strArea = '',
        strMealThumb,
        strYoutube,
        strCategory,
        strTags,
        strInstructions
    } = data;

    randomMeal.innerHTML = `<div
        id=${idMeal}
            class="random-meal-container"
            style="
                background-image: url(${strMealThumb});
            "
            >
            <h3 class="random-meal-title">
                ${strMeal}  (${strArea})
                <button type="button" class="is-favourite">
                    <i class="fa-regular fa-heart fa-xl"
                    style="color: #a0e7e5"
                    ></i>
                </button>
            </h3>
        </div>
        <div class="random-meal-info">
            <h3>
                Category: ${strCategory}
            </h3>
            <h5> # ${strTags} </h5>
            <h3>
            Ingredients:
            <h3>
            <ul class="ingredients-list">
                ${ingredientsList}
            </ul>
            Instructions:
            <span class="info-text"> ${strInstructions} </span>
            </h3>
        </div>`;
    
    const idCard = Number(`${idMeal}`);

    if (favouriteListLS.includes(idCard)) {
        randomMeal.childNodes[0].firstElementChild.childNodes[1].childNodes[1].classList.add('fa-solid');
    };

    if (strYoutube) {
        document.querySelector('.random-meal-container').insertAdjacentHTML('beforeend', `
            <a
             class="link-youtube"
             href=${strYoutube}
             target="_blank"
             >
             <i
             class="fa-solid fa-square-caret-right fa-2xl"
             style="color: #a0e7e5"
             ></i>
         </a>`);
    };

    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
};

const markUpIngredients = (data) => {
    let htmlInfo = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = `strIngredient${i}`;
        const measure = `strMeasure${i}`;
  
        if (data[ingredient] && data[measure]) {
            htmlInfo += `<li class="ingredients-item info-text"><span class="mark">
            <i class="fa-solid fa-check" style="color: #a0e7e5;"></i>
            </span> ${data[ingredient]}  (${data[measure]})</li>`
        };
    };

    return htmlInfo;  
};


searchQuery.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = event.target[0].value;

    getMealByName(query)
        .then((res) => {
            randomMeal.innerHTML = '';
            resultSearch.innerHTML = '';
            markUpMealList(res);
    })
        .catch((err)=> {
            randomMeal.innerHTML = `<h3>Not found</h3>`;
            console.log(err)
        });
});

categoriesList.addEventListener('click', (event) => {
    if (event.target.parentNode.parentNode.className === 'swiper-wrapper meal-categories-list'){
    const category = event.target.parentNode.innerText;
    getMealByCategory(category)
        .then((res) => {
            randomMeal.innerHTML = '';
            markUpMealList(res);
        })
        .catch((err) => {
            randomMeal.innerHTML = `<h3>Not found</h3>`;
            console.log(err);
        });
    };
});

resultSearch.addEventListener('click', (event) => {
    let id;

    if (event.target.className === 'search-result-item') {
        id = event.target.id;
        getMealById(id)
            .then((res) => {
                resultSearch.innerHTML = '';
                markUpMeal(res);
            })
            .catch((err) => {
                randomMeal.innerHTML = `<h3>Not found</h3>`;
                console.log(err)
            });
    } else if (event.target.parentNode.className === 'search-result-item') {
        id = event.target.parentNode.id;
        getMealById(id)
            .then((res) => {
                resultSearch.innerHTML = '';
                markUpMeal(res);
            })
            .catch((err) => {
                randomMeal.innerHTML = `<h3>Not found</h3>`;
                console.log(err)
            });
    };

    if (event.target.tagName === 'I') {
        const idFavourite = Number(event.target.parentNode.parentNode.id);
        event.target.classList.toggle('fa-solid');
        
        const newFavouriteListLS = favouriteListLS.includes(idFavourite) ? favouriteListLS.filter(el => el !== idFavourite) : [...favouriteListLS, idFavourite];
        
        localStorage.setItem(key, JSON.stringify(newFavouriteListLS));
        favouriteListLS = JSON.parse(localStorage.getItem(key));

        favouriteListLS.length === 0 ? mainFavouriteBtn.firstChild.nextElementSibling.classList.remove('fa-solid') : mainFavouriteBtn.firstChild.nextElementSibling.classList.add('fa-solid');
    };
});

mainFavouriteBtn.addEventListener('click', () => {
    let favouriteList = '';

    if (favouriteListLS) {
        resultSearch.innerHTML = '';
        randomMeal.innerHTML = '';

        for (let i = 0; i < favouriteListLS.length; i++) {
            const element = favouriteListLS[i];

            getMealById(element)
                .then((el) => { 
                    favouriteList += `
                        <li 
                            class="search-result-item" id=${el.idMeal}>
                            <img class="search-result-img" src=${el.strMealThumb} alt=${el.strMeal}>
                            <h2 class="search-result-text">${el.strMeal}</h2>
                            <button type="button" class="is-favourite">
                                <i class="fa-regular fa-heart fa-xl fa-solid"
                                    style="color: #a0e7e5"
                                ></i>
                            </button>
                        </li>`
    
                    return resultSearch.innerHTML = favouriteList;
                 }) 
                .catch((err) => console.log(err));
        };
    };
});

randomMeal.addEventListener('click', (event) => {
    if (event.target.tagName === 'I' &&  event.target.parentNode.className === 'is-favourite') {

        const idFavourite = Number(event.target.parentNode.parentNode.parentNode.id);
        event.target.classList.toggle('fa-solid');

        const newFavouriteListLS = favouriteListLS.includes(idFavourite) ? favouriteListLS.filter(el => el !== idFavourite) : [...favouriteListLS, idFavourite];
        
        localStorage.setItem(key, JSON.stringify(newFavouriteListLS));
        favouriteListLS = JSON.parse(localStorage.getItem(key));
        
        favouriteListLS.length === 0 ? mainFavouriteBtn.firstChild.nextElementSibling.classList.remove('fa-solid') : mainFavouriteBtn.firstChild.nextElementSibling.classList.add('fa-solid');
    };
});

const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 0,
    a11y: true,
    allowTouchMove: true,
    keyboard: true,
    mousewheel: true,
    nested: true,
    centeredSlides: false,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next'
    },
    breakpoints: {
        375: {
            slidesPerView: 4,
        },
        425: {
            slidesPerView: 5,
        },
        500: {
            slidesPerView: 6,
        }
    }
});


startPage();