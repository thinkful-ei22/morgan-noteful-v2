'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();



router.get('/', (req, res, next) => {
  knex('tags')
    .select()
    .then( result => {
      res.json(result);
    })
    .catch(err => next(err));
});



router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
    .select()
    .where('id', id)
    .then( ([result]) => {
      if(!result) {
        next();
      } else {
        res.json(result);
      }
    })
    .catch(err => next(err));
});



router.post('/', (req, res, next) => {
  const {name} = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = {'name': name};
  knex
    .insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then( ([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});




router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObj = {'name': req.body.name};

  if(!updateObj.name) {
    const err = new Error('Must provide valid name for tag');
    err.status = 400;
    return next(err);
  }

  knex('tags')
    .where('id', id)
    .update(updateObj)
    .returning(['id', 'name'])
    .then( ([result]) => {
      res.json(result);
    })
    .catch(err => next(err));
});



router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('tags')
    .where('id', id)
    .del()
    .then( resultBool => {
      if (resultBool){
        res.sendStatus(204);
      } else {
        next();
      }
    })
    .catch();
});


module.exports = router;