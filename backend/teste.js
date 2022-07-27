let options = { year: "numeric", month: "long", day: "numeric", weekday: 'long' };
const date = new Date(2020, 11, 31, 2, 30, 10) // 2020-12-31T03:00:00.000Z

console.log(date.toLocaleDateString("pt-br", options));
console.log(date.toLocaleDateString("pt-br", {...options, month: "numeric"}));


// sometimes even the US needs 24-hour time
options = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
};
console.log(new Intl.DateTimeFormat('pt-br', options).format(date));
