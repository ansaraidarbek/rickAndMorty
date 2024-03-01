export function toggleFavourite(id) {
    const obj = JSON.parse(localStorage.getItem('localCache')) || {};
    if (obj && obj?.storage && id) {
        const currFav = JSON.parse(localStorage.getItem('favourites')) || {indexes:{}, storage:{results:[]}};
        if (currFav.indexes[id]) {
            delete currFav.indexes[id];
            currFav.storage.results.forEach((el, i) => {
                if (el.id === +id) {
                    currFav.storage.results.splice(i, 1);
                    return;
                }
            })
        } else {
            currFav.indexes[id] = true;
            obj.storage.results.forEach(el => {
                if (el.id === +id) {
                    currFav.storage.results.push(el);
                    return;
                }
            })
        }
        localStorage.setItem("favourites", JSON.stringify(currFav));
    }
}