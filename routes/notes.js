'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);
const knex = require('../knex');
const hydrateNotes = require('../utils/hydrateNotes');


// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const { folderId } = req.query;
  const { tagId } = req.query;

  knex
    .select('notes.id', 'title', 'content',
      'folders.id as folderId', 'folders.name as folderName',
      'notes_tags.tag_id as tagId', 'tags.name as tagName'
    )
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(queryBuilder => {
      if (folderId) {
        queryBuilder.where('folders.id', folderId);
      }
    })
    .modify(queryBuilder => {
      if (tagId) {
        queryBuilder.where('notes_tags.tag_id', tagId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      if (results) {
        //res.json(results);
        const hydrated = hydrateNotes(results);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});



// Get a single item
router.get('/:id', (req, res, next) => {
  const noteId = req.params.id;

  knex
    .select('notes.id', 'title', 'content', 
      'folders.id as folderId', 'folders.name as folderName',
      'notes_tags.tag_id as tagId', 'tags.name as tagName'
    )
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
    .where('notes.id', noteId)
    .then(result => {
      if(result.length !== 0) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});



// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const updateObj = {};
  const tags = req.body.tags;

  if (req.body.title) {
    updateObj.title = req.body.title;
    updateObj.content = req.body.content;
    updateObj.folder_id = req.body.folderId;
  }


  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .where('id', `${id}`)
    .update(updateObj)
    .returning('id')
    .then( ([id]) => {
      return knex('notes_tags')
        .where('note_id', id)
        .del();
    })
    .then( () => {
      const insertNotes_Tags = tags.map( tagId => ({note_id: id, tag_id: tagId}));
      return knex('notes_tags')
        .insert(insertNotes_Tags);
    })
    .then( () => {
      return knex('notes')
        .select('notes.id', 'title', 'content',
          'folders.id as folderId', 'folders.name as folderName',
          'notes_tags.tag_id as tagId', 'tags.name as tagName'
        )
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
        .where('notes.id', id);
    })
    .then( result => {
      if(result.length !== 0) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});





// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;

  const newItem = { 
    'title': title, 
    'content': content,
    'folder_id': folderId
  };

  let noteId;

  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then( ([id]) => {
      noteId = id;
      const tagsInsert = tags.map(tagId => ({ note_id: noteId, tag_id: tagId}));
      return knex('notes_tags').insert(tagsInsert);
    })
    .then( () => {
      return knex.select('notes.id', 'title', 'content', 
        'folder_id as folderId', 'folders.name as folderName',
        'notes_tags.tag_id as tagId', 'tags.name as tagName'
      )
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'notes_tags.tag_id', 'tags.id')
        .where('notes.id', noteId);
    })
    .then( (result) => {
      if (result.length !== 0) {
        const hydrated = hydrateNotes(result);
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(hydrated[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});




// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where('id', id)
    .del('')
    .then( (response) => {
      if(response) {
        res.sendStatus(204);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

module.exports = router;
