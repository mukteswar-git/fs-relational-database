create table blogs (
  id serial primary key,
  author text,
  url text not null,
  title text not null,
  likes integer default 0
);

insert into blogs (author, url, title)
values (
  'Mukteswar',
  'https://example.com/postgres',
  'Learning PostgreSQL'
);

insert into blogs (author, url, title, likes)
values (
  'Mukteswar',
  'https://example.com/sequelize',
  'Learning Sequelize',
  5
);
