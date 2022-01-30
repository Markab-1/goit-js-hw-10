export default function fetchCountries(name){

    const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;

    return fetch(url).then(p => {
        if (!p.ok) {
            throw new Error(p.status);
        }
        return p.json();
    })
        .then(data => {
            return data;
        });
}
