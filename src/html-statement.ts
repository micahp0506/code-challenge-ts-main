import { MovieCode, MovieTypeInterface } from "./Movie";

export const htmlStatement = (customer: any, movies: any): string => {
    let totalAmount = 0;
    let frequentRenterPoints = 0;
    let html = '';
    let header = `<h1>Rental Record for <em>${customer.name}</em></h1>`;
    let list= `<ul>`;
    let amountOwed = '';
    let points = '';

    for (let r of customer.rentals) {
        let movie = movies[r.movieID];
        let thisAmount = 0;

        switch (movie.code) {
        case MovieCode.REGULAR:
            thisAmount = 2;
            if (r.days > 2) {
            thisAmount += (r.days - 2) * 1.5;
            }
            break;
        case MovieCode.NEW:
            thisAmount = r.days * 3;
            break;
        case MovieCode.CHILDRENS:
            thisAmount = 1.5;
            if (r.days > 3) {
            thisAmount += (r.days - 3) * 1.5;
            }
            break;
        }

        frequentRenterPoints++;
        if (movie.code === MovieCode.NEW && r.days > 2) frequentRenterPoints++;
        list = list.concat(`<li>${movie.title} - ${thisAmount}</li>`);
        totalAmount += thisAmount;
  }

    list = list.concat('</ul>');
    amountOwed= `<p>Amount owed is <em>${totalAmount}</em></p>`;
    points= `<p>You earned <em>${frequentRenterPoints}</em> frequent renter points</p>`;
    return html.concat(header, list, amountOwed, points);
};

export const htmlStatementFlexible = (customer: any, movies: any, movieTypes: any): string => {
    let totalAmount = 0;
    let frequentRenterPoints = 0;
    let html = '';
    let header = `<h1>Rental Record for <em>${customer.name}</em></h1>`;
    let list= `<ul>`;
    let amountOwed = '';
    let points = '';

    for (let r of customer.rentals) {
        let movie = movies[r.movieID];
        let thisAmount = 0;
        movieTypes.map((type: MovieTypeInterface)=> {
            if (type.name.toLowerCase() === movie.code.toLowerCase()) {
                thisAmount = type.price;
                if (r.days > type.dayMultiple) {
                    thisAmount += (r.days - type.dayMultiple) * 1.5;
                }
                frequentRenterPoints += type.points;
                if (movie.code === MovieCode.NEW && r.days > type.dayMultiple) frequentRenterPoints++;
            }
        });

        list = list.concat(`<li>${movie.title} - ${thisAmount}</li>`);
        totalAmount += thisAmount;
  }

    list = list.concat('</ul>');
    amountOwed= `<p>Amount owed is <em>${totalAmount}</em></p>`;
    points= `<p>You earned <em>${frequentRenterPoints}</em> frequent renter points</p>`;
    return html.concat(header, list, amountOwed, points);
};