// ”cassandra-driver” is in the node_modules folder. Redirect if necessary.
const cassandra = require('cassandra-driver');
// Replace 'Username' and 'Password' with the username and password from your cluster settings
const authProvider = new cassandra.auth.PlainTextAuthProvider('', '');
// Replace the PublicIPs with the IP addresses of your clusters
const contactPoints = ['127.0.0.1'];
// Replace DataCenter with the name of your data center, for example: 'AWS_VPC_US_EAST_1'
const localDataCenter = 'datacenter1';

const client = new cassandra.Client({
	contactPoints: contactPoints,
	authProvider: authProvider,
	localDataCenter: localDataCenter,
	keyspace: 'notes',
});

// Define and execute the queries
const queryAllStudents = 'SELECT * FROM notes.students';
const queryInsertStudents =
	'INSERT INTO notes.students (id_student, student_name, student_age, student_genre) VALUES(?, ?, ?, ?)';
const queryDeleteStudents =
	'DELETE FROM notes.students WHERE id_student = ? IF EXISTS';
const queryOneStudent = 'SELECT * FROM notes.students WHERE id_student = ?';
// The UPDATE query does not work because CQL does not allow to modify the primary key of a table.
const queryUpdateStudent =
	'UPDATE notes.students SET id_student = ?, student_name = ?, student_age = ?, student_genre = ? WHERE id_student = ?';

const controller = {};

let alertMessage;

controller.show = (req, res) => {
	client.execute(queryAllStudents, [], (err, result) => {
		if (err) {
			res.status(404).send({ msg: err });
		} else {
			res.render('index', {
				students: result.rows,
				msg: alertMessage,
			});
			alertMessage = undefined;
		}
	});
};

function Save(student, req, res){
	client.execute(
		queryInsertStudents,
		[
			parseInt(student.id),
			student.name.toUpperCase(),
			parseInt(student.age),
			student.genre,
		],
		{ prepare: true },
		(err, result) => {
			if (err) {
				res.status(404).send({ msg: err });
			} else {
				alertMessage = {
					alert: 'success',
					class: 'alert-success',
					content: 'Student successfully added'
				};
				res.redirect('/');
			}
		}
	);
}

controller.save = (req, res) => {
	const student = req.body;
	client.execute(
		queryOneStudent,
		[parseInt(student.id)],
		{ prepare: true },
		(err, result) => {
			if (err) {
				console.log('id: ', student.id, err);
			} else {
				if (result.rows[0]) {
					alertMessage = {
						alert: 'error',
						class: 'alert-danger',
						content: `The student already exists`,
						student: {
							id: result.rows[0].id_student, 
							name: result.rows[0].student_name
						}
					};
					res.redirect('/');
				} else {
					Save(student, req, res);
				}
			}
		}
	);
};

controller.edit = (req, res) => {
	const { id } = req.params;
	client.execute(
		queryOneStudent,
		[id],
		{ prepare: true },
		(err, student) => {
			if (err) {
				res.status(404).send({ msg: err });
			} else {
				res.render('studentEdit', {
					data: student.rows[0],
				});
			}
		}
	);
};

controller.update = (req, res) => {
	const student = req.body;
	const { id } = req.params;
	client.execute(
		queryInsertStudents,
		[
			parseInt(student.id),
			student.name.toUpperCase(),
			parseInt(student.age),
			student.genre,
		],
		{ prepare: true },
		(err, student) => {
			console.log(student);
			if (err) {
				res.status(404).send({ msg: err });
			} else {
				alertMessage = {
					alert: 'success',
					class: 'alert-success',
					content: 'Student successfully updated',
				};
				res.redirect('/');
			}
		}
	);
};

controller.delete = (req, res) => {
	const { id } = req.params;
	client.execute(
		queryDeleteStudents,
		[id],
		{ prepare: true },
		(err, result) => {
			if (err) {
				res.status(404).send({ msg: err });
			} else {
				alertMessage = {
					alert: 'success',
					class: 'alert-success',
					content: 'Student successfully eliminated',
				};
				res.redirect('/');
			}
		}
	);
};

module.exports = controller;
