'use strict';

const knex = require('../knex');

//get request given ID parameter
/////////////////////////////////////////////////////////////////
//returns object with note if given valid ID
//returns undefined if ID is not valid
// let id = '1002';
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (id) {
//       queryBuilder.where('id', `${id}`);
//     } else {
//       throw new Error('Does not exist');
//     }
//   })
//   .then(([result]) => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.error(err);
//   });


///////////////////////////////////////////////////////////////////////
//update note by ID accepts ID, {newData}, and returns updated note as object
// const id = '1002';
// const newData = {title:'Updated Title'};
// knex('notes')
//   .where('id', `${id}`)
//   .update(newData)
//   .returning(['id', 'title', 'content'])
//   .then( ([result]) => {
//     console.log(result);
//   });




///////////////////////////////////////////////////////////////////////
//create a note, accepts an object with the note properties
//and inserts into database. returns new note (including id)
//as an object
// const newObj = {
//   title:'Some random title',
//   content:'Some random content'
// };
// knex('notes')
//   .insert(newObj)
//   .returning(['id', 'title', 'content'])
//   .then( ([result]) => {
//     console.log(result);
//   })
//   .catch( err => {
//     console.log(err);
//   });



///////////////////////////////////////////////////////////////////////
//Delete note by ID; returns nothing
// const id = '1004';
// knex('notes')
//   .where('id', id)
//   .del('')
//   .then(res => console.log(res))
//   .catch(err => console.log(err));



// SELECT ALL to show current state of database
// knex('notes')
//   .select()
//   .then(result => console.log(result));

