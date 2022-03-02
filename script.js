const animeContainer = document.querySelector(".top_anime");
const searchForm = document.querySelector(".search_anime");
const searchInput = document.querySelector(".search_input");
const home = document.querySelector(".home_item");
const myAnime = document.querySelector(".my_anime");
const animeInfo = document.querySelector(".anime_info");
const animeImage = document.querySelector(".anime_image").querySelector("img");
const url = `https://api.jikan.moe/v3`;

let storedAnime = Object.values(localStorage)
  ? Object.values(localStorage)
  : [];

// CARD HTML
const template = function (img, id, type) {
  return `
<div class="card_container ">
 <div class="card_front">
  <img src="${img}" alt="" />
 </div>
 <div class="card_back">
 <span id="${id}" class="more">See More!</span>
 <span id="${id}" class="${type}">${
    type[0].toUpperCase() + type.slice(1).replace("_", " ")
  }!</span>
 </div>
</div>
`;
};

// TOP 10 ANIME LOADER
const loadTopAnime = async function (url) {
  try {
    const data = await fetch(`${url}/top/anime/1/favorite`).then((res) =>
      res.json()
    );
    const top10 = data.top.slice(0, 10);
    animeContainer.innerHTML = "";

    top10.forEach((anime) => {
      animeContainer.insertAdjacentHTML(
        "beforeend",
        template(anime.image_url, anime.mal_id, "watch_later")
      );
    });

    showAnimeInfo(top10[0].mal_id);
  } catch (err) {
    alert(err);
  }
};

loadTopAnime(url);

// SEARCHING ANIME

const searchedAnime = async function (url, query) {
  try {
    const data = await fetch(
      `${url}/search/anime?q=${query}&limit=10&sort=asc`
    ).then((res) => res.json());

    data.results.forEach((anime) => {
      animeContainer.insertAdjacentHTML(
        "beforeend",
        template(anime.image_url, anime.mal_id, "watch_later")
      );
    });
    animeContainer.classList.remove("slided");
    showAnimeInfo(data.results[0].mal_id);
  } catch (err) {
    alert(err);
  }
};

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  animeContainer.innerHTML = "";
  searchedAnime(url, searchInput.value);
  searchInput.value = "";
});

// INFO DISPLAY

const showAnimeInfo = async function (id) {
  try {
    getAnime(url, id).then((anime) => infoShowUp(anime));
  } catch (err) {
    alert(err);
  }
};

animeContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("more")) {
    showAnimeInfo(e.target.id);
  }
  if (e.target.classList.contains("watch_later")) {
    if (storedAnime.length === 5) return;

    if (localStorage.getItem(`anime${e.target.id}`)) return;

    getAnime(url, e.target.id).then((anime) => storeAnime(anime));
  }
});

myAnime.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("more")) {
    showAnimeInfo(e.target.id);
  }
  if (e.target.classList.contains("remove")) {
    e.target.closest(".card_container").outerHTML = "";
    localStorage.removeItem(`anime${e.target.id}`);
    storedAnime = Object.values(localStorage);
  }
});

home.addEventListener("click", function (e) {
  e.preventDefault();
  loadTopAnime(url);
  animeContainer.classList.remove("slided");
});

// SLIDERS

document.querySelector(".slide_right").addEventListener("click", function (e) {
  e.preventDefault();
  if (animeContainer.classList.contains("slided")) return;
  animeContainer.classList.add("slided");
});

document.querySelector(".slide_left").addEventListener("click", function (e) {
  e.preventDefault();
  if (!animeContainer.classList.contains("slided")) return;
  animeContainer.classList.remove("slided");
});

// localStorage.clear();

// SHOW STORED ANIME
storedAnime.forEach((anime) => {
  myAnime.insertAdjacentHTML("afterbegin", anime);
});

// HELPERS

const getAnime = async function (url, id) {
  const data = await fetch(`${url}/anime/${id}`).then((res) => res.json());
  return data;
};

const infoShowUp = function (anime) {
  animeInfo.querySelector("h1").textContent = anime.title;
  animeInfo.querySelector("p").textContent = anime.synopsis;
  animeInfo.querySelector("iframe").setAttribute("src", anime.trailer_url);
  animeImage.setAttribute("src", anime.image_url);
};

const storeAnime = function (anime) {
  myAnime.insertAdjacentHTML(
    "beforeend",
    template(anime.image_url, anime.mal_id, "remove")
  );
  localStorage.setItem(
    `anime${anime.mal_id}`,
    template(anime.image_url, anime.mal_id, "remove")
  );
  storedAnime = Object.values(localStorage);
};
