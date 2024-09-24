const categoriesList = document.querySelector('.meal-categories-list');
const randomMeal = document.querySelector('.random-meal');

let htmlRandomMeal = null;
let data = {};

const getCategoriesList = () => {
    const result = fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    return result.then(res =>  res.json());
};

const getRandomMeal = () => {
    const result = fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    return result.then(res => res.json());
};

// const getMealById = (id) => {
//     const result = fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
//     return result.then(res => res.json());
// }

const markUpCategories = () => {
    getCategoriesList()
        .then((res) => res.categories)
        .then((categories) => {
            categoriesList.innerHTML = null;

            const list = categories.map(({ strCategoryThumb, strCategory }) => {
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
        })
        .catch((error) => {
            categoriesList.innerHTML = `<h3>Not found</h3>`;
        });    
};

const markUpRandomMeal = () => {
    getRandomMeal()
        .then((res) => res.meals)
        .then((meals) => {
            randomMeal.innerHTML = htmlRandomMeal;
            data = meals[0];
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

            if (strYoutube !== '') {
                htmlRandomMeal =
                `<div
                    id=${idMeal}
                    class="random-meal-container"
                    style="
                        background-image: url(${strMealThumb});
                    "
                    >
                    <h3 class="random-meal-title">
                        ${strMeal}  (${strArea})
                        <span>
                        <i class="fa-regular fa-heart"></i>
                        </span>
                    </h3>
                    <a
                        class="link-youtube"
                        href=${strYoutube}
                        target="_blank"
                        >
                        <i
                        class="fa-solid fa-square-caret-right fa-2xl"
                        style="color: #b197fc"
                        ></i>
                    </a>
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
            } else {
            htmlRandomMeal =
                `<div
                    id=${idMeal}
                    class="random-meal-container"
                    style="
                        background-image: url(${strMealThumb});
                    "
                    >
                    <h3 class="random-meal-title">
                        ${strMeal}  (${strArea})
                        <span>
                        <i class="fa-regular fa-heart"></i>
                        </span>
                    </h3>
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
                    </div>
                </div>`;
            };   
            
            return randomMeal.innerHTML = htmlRandomMeal;
        })
        .catch((err) => {
            randomMeal.innerHTML = `<h3>Not found</h3>`;
            console.log(err)
        });    
};

const markUpIngredients = (data) => {
    let htmlInfo = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = `strIngredient${i}`;
        const measure = `strMeasure${i}`;
  
        if (data[ingredient] && data[measure]) {
            htmlInfo += `<li class="ingredients-item info-text"><span class="mark">
            <i class="fa-solid fa-check" style="color: #b197fc;"></i>
            </span> ${data[ingredient]}  (${data[measure]})</li>`
        };
    };

    return htmlInfo;  
};

markUpCategories();
markUpRandomMeal();



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
