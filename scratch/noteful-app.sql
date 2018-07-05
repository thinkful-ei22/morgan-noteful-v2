DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;


CREATE TABLE folders (
  id serial PRIMARY KEY, 
  name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;



CREATE TABLE notes (
  id serial PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created TIMESTAMP WITH TIME ZONE default current_timestamp,
  folder_id int REFERENCES folders(id) ON DELETE SET NULL
);

ALTER SEQUENCE notes_id_seq RESTART WITH 1000;


--Populating the 'folders' data list
INSERT INTO folders (name) VALUES 
('Archive'),
('Drafts'),
('Personal'),
('Work');


--Populating the 'notes' data list
INSERT INTO notes (title, content, folder_id) VALUES ('Pretend Note 1', 'This is pretend content #1', NULL),
('Pretend Note 2', 'This is pretend content #2', 100),
('Third note', 'This is pretend content #3', 101),
('Fourth note', 'This is pretend content #4', 102),
('5th note', 'This is pretend content #5', 103),
('Pretend Note 6', 'This is pretend content #6', NULL),
('Pretend Note 7', 'This is pretend content #7', 100),
('Lucky 8''s', NULL, 101)
;



