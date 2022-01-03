#!/usr/bin/env node
import express from 'express';
import path from "path";
import { Customer } from "./Customer";
import { MovieCollection, MovieCode, MoveTypes, MovieType } from "./Movie";

import { Command } from "commander";
import { statement } from "./statement";
import { htmlStatement, htmlStatementFlexible } from "./html-statement";

const app = express();

const program: Command = require("commander");
const version: string = require("../package.json").version;

const customer: Customer = require("./data/customer.json");
const movies: MovieCollection = require("./data/movies.json");
const bodyParser = require("body-parser");
const ejs = require('ejs');

let movieCodes = Object.values(MovieCode);
let movieTypes = Object.values(MoveTypes);

program
  .version(version)
  .description("A CLI for generating customer statements");

program
  .command("statement")
  .description("Prints out a plain-text statement for the customer")
  .action(() => console.log(statement(customer, movies)));

program
  .command("html-statement")
  .description("Prints out a plain-text statement for the customer");

program.parse(process.argv);

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  let html = htmlStatement(customer, movies);
  res.write(`
  <html>
    <body>
      ${html}
    </body>
  </html>
  `);
});

app.get('/movies', function(req, res) {
  res.render('movies', {
    movieTypes: movieTypes,
    movieStatement: ''
  });
});

app.post("/movies", (req, res) => {
  let movieType = new MovieType(req.body.movietype, +req.body.movieprice, +req.body.moviepoints, +req.body.moviemultiple)
  movieTypes.push(movieType);
  res.render('movies', {
    movieTypes: movieTypes,
    movieStatement: ''
  });
  res.end();
});

app.post("/moviesDelete", (req, res) => {
  movieTypes = movieTypes.filter(type => type.name !== req.body.movietype);
  res.render('movies', {
    movieTypes: movieTypes,
    movieStatement: ''
  });
  res.end();
});

app.post("/moviesUpdate", (req, res) => {
  if (req.body.moviename !== '' 
      || req.body.movieprice !== '' 
      || req.body.moviepoints !== ''
      || req.body.moviemultiple !== '') {

    movieTypes.map((type)=> {
      if (req.body.moviename.length > 0 
        && req.body.movieprice.length > 0 
        && req.body.moviepoints.length > 0 
        && req.body.moviemultiple.length > 0 
        && type.name === req.body.movietype) {
         type.name = req.body.moviename;
         type.price = +req.body.movieprice;
         type.points = +req.body.moviepoints;
         type.dayMultiple = +req.body.moviemultiple;
      }
      
      if (req.body.movieprice.length > 0 &&  type.name === req.body.movietype) {
        type.price = +req.body.movieprice;
      }

      if (req.body.moviename.length > 0 && type.name === req.body.movietype) {
        type.name = req.body.moviename;
     }

     if (req.body.moviepoints.length > 0 && type.name === req.body.movietype) {
        type.points = +req.body.moviepoints;
     }

     if (req.body.moviemultiple.length > 0 && type.name === req.body.movietype) {
        type.dayMultiple = +req.body.moviemultiple;
     }
   });
  }
  res.render('movies', {
    movieTypes: movieTypes,
    movieStatement: ''
  });
  res.end();
});

app.get("/movieStatement", (req, res) => {
  let html = htmlStatementFlexible(customer, movies, movieTypes);
  res.render('movies', {
    movieTypes: movieTypes,
    movieStatement: `
    <html>
      <body>
        ${html}
      </body>
    </html>
    `
  });
  res.end();
});

app.listen(3000, ()=> {
  console.log('Application is listening on Port 3000')
});
