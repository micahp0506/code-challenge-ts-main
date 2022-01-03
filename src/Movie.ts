export enum MovieId {
  F001 = "F001",
  F002 = "F002",
}

export enum MovieCode {
  CHILDRENS = "childrens",
  REGULAR = "regular",
  NEW = "new",
}

interface MovieDetails {
  title: string;
  code: MovieCode;
}

export type MovieCollection = {
  [MovieID in MovieId]: MovieDetails;
};

export let MoveTypes: MovieTypeInterface[] = [
  {name: 'childrens', price: 1.5, points: 1, dayMultiple: 2},
  {name: 'regular', price: 2, points: 1, dayMultiple: 3},
  {name: 'new', price: 3, points: 1, dayMultiple: 4}
]

export interface MovieTypeInterface {
  name: string;
  price: number;
  points: number;
  dayMultiple: number;
}

export class MovieType implements MovieTypeInterface {
  name: string
  price: number
  points: number
  dayMultiple: number

  constructor(name: string, price: number, points: number, dayMultiple: number) {
    this.name = name
    this.price = price
    this.points = points
    this.dayMultiple = dayMultiple
  }
}


