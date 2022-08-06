-- CREATE KEYSPACE notes WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1'};

CREATE TABLE notes.students(
    id_student int,
    student_name text,
    student_age int,
    student_genre text,
    PRIMARY KEY (id_student)
);