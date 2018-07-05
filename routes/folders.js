'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();


router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});



router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('folders')
    .select('id', 'name')
    .where('id', id)
    .then(result => {
      if (result.length === 0) {
        return next();
      }
      res.json(result[0]);
    })
    .catch(err => next(err));
});


router.put('/:id', (req, res, next) => {
  const updateObj = req.body;
  const id = req.params.id;

  if(!updateObj.name) {
    const err = new Error('Must provide a name for folder');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where('id', id)
    .update('name', updateObj.name)
    .returning(['id', 'name'])
    .then(([result]) => {
      res.json(result);
    })
    .catch(err => next(err));
});



router.post('/', (req, res, next) => {
  const newName = req.body.name;
  console.log(newName);

  if(!newName) {
    const err = new Error('Must provide valid name for folder');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .insert({'name': `${newName}`})
    .returning(['id', 'name'])
    .then( ([result]) => {
      res.json(result);
    })
    .catch(err => next(err));
});


router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('folders')
    .where('id', id)
    .del()
    .then( result => {
      if(result) {
        res.sendStatus(204);
      } else {
        return next();
      }
    })
    .catch(err => next(err));
});

module.exports = router;