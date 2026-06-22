export const STATIC_NETWORK = {
    stations: [
        { id: 1, name: "Sesto" },
        { id: 2, name: "Loreto" },
        { id: 3, name: "Lima" },
        { id: 4, name: "Duomo" },
        { id: 5, name: "Cadorna" },
        { id: 6, name: "Pagano" },
        { id: 7, name: "Molino" },
        { id: 8, name: "Cologno" },
        { id: 9, name: "Centrale" },
        { id: 10, name: "Gioia" },
        { id: 11, name: "Famagosta" },
        { id: 12, name: "Maciachini" },
        { id: 13, name: "Missori" },
        { id: 14, name: "Brenta" },
        { id: 15, name: "Lodi" },
        { id: 16, name: "San Babila" },
        { id: 17, name: "Sant'Ambrogio" },
        { id: 18, name: "Solari" },
        { id: 19, name: "Romolo" },
        { id: 20, name: "Bicocca" },
        { id: 21, name: "Bignami" }
    ],
    lines: [
        {
            id: 1,
            name: "M1",
            color: "#FF0000",
            stations: [
                { id: 1, name: "Sesto" },
                { id: 2, name: "Loreto" },
                { id: 3, name: "Lima" },
                { id: 4, name: "Duomo" },
                { id: 5, name: "Cadorna" },
                { id: 6, name: "Pagano" },
                { id: 7, name: "Molino" }
            ]
        },
        {
            id: 2,
            name: "M2",
            color: "#0000FF",
            stations: [
                { id: 8, name: "Cologno" },
                { id: 2, name: "Loreto" },
                { id: 9, name: "Centrale" },
                { id: 10, name: "Gioia" },
                { id: 11, name: "Famagosta" }
            ]
        },
        {
            id: 3,
            name: "M3",
            color: "#00FF00",
            stations: [
                { id: 12, name: "Maciachini" },
                { id: 9, name: "Centrale" },
                { id: 4, name: "Duomo" },
                { id: 13, name: "Missori" },
                { id: 14, name: "Brenta" },
                { id: 15, name: "Lodi" }
            ]
        },
        {
            id: 4,
            name: "M4",
            color: "#FFD700",
            stations: [
                { id: 16, name: "San Babila" },
                { id: 4, name: "Duomo" },
                { id: 17, name: "Sant'Ambrogio" },
                { id: 18, name: "Solari" },
                { id: 19, name: "Romolo" }
            ]
        },
        {
            id: 5,
            name: "M5",
            color: "#800080",
            stations: [
                { id: 20, name: "Bicocca" },
                { id: 10, name: "Gioia" },
                { id: 9, name: "Centrale" },
                { id: 3, name: "Lima" },
                { id: 21, name: "Bignami" }
            ]
        }
    ],
    segments: [
        { from: "Sesto", to: "Loreto" },
        { from: "Loreto", to: "Lima" },
        { from: "Lima", to: "Duomo" },
        { from: "Duomo", to: "Cadorna" },
        { from: "Cadorna", to: "Pagano" },
        { from: "Pagano", to: "Molino" },
        { from: "Cologno", to: "Loreto" },
        { from: "Loreto", to: "Centrale" },
        { from: "Centrale", to: "Gioia" },
        { from: "Gioia", to: "Famagosta" },
        { from: "Maciachini", to: "Centrale" },
        { from: "Centrale", to: "Duomo" },
        { from: "Duomo", to: "Missori" },
        { from: "Missori", to: "Brenta" },
        { from: "Brenta", to: "Lodi" },
        { from: "San Babila", to: "Duomo" },
        { from: "Duomo", to: "Sant'Ambrogio" },
        { from: "Sant'Ambrogio", to: "Solari" },
        { from: "Solari", to: "Romolo" },
        { from: "Bicocca", to: "Gioia" },
        { from: "Centrale", to: "Lima" },
        { from: "Lima", to: "Bignami" }
    ]
};
