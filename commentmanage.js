
const mysql = require('mysql');
const moment = require('moment');
class User {
  constructor(id) {
    this.myId = id;
    this.loggedIn = false;
    this.lastLoggedInAt = null;
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "commenting_roles",
      password: ""
    });
  }
  logIn() {
    this.lastLoggedInAt = moment().format('YYYY-MM-DD HH:mm:ss');
    this.loggedIn = true;
  }
  logOut() {
    this.loggedIn = false
  }

  addNumbers(a, b) {
    return a + b;
  }
  connectToDataBase() {
    this.connection.connect();
  }
  closeConnection() {
    this.connection.end();
  }
  createComment(message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    this.connectToDataBase();
    const sql = `INSERT INTO comment (author, timestamp, message) VALUES (${this.myId},'${timestamp}','${message}')`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("The comment created");
      resalt = result;
    });
    this.closeConnection();
  }

  createReply(parent, message) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    this.connectToDataBase();
    const sql = `INSERT INTO reply (parent_id, timestamp, message) VALUES (${parent}, '${timestamp}','${message}')`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
    });
    this.closeConnection();
  }

  editComment(commentId, message) {
    this.connectToDataBase();
    const sql = `UPDATE comment SET message = '${message}' WHERE comment_id = ${commentId} AND author = ${this.myId}`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("The comment edited");
    });
    this.closeConnection();
  }

  deleteComment(commentId) {
    this.connectToDataBase();
    const sql = `DELETE FROM comment WHERE comment_id = ${commentId} AND author = ${this.myId}`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("The comment deleted");
    });
    this.closeConnection();
  }

  getAllComments() {
    this.connectToDataBase();
    const sql = `SELECT * FROM comment WHERE author = ${this.myId}`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      result.forEach(comment => {
        console.log(comment.message);
      });
    });
    this.closeConnection();
  }
}

class moderator extends User {
  constructor(id) {
    super(id);
  }
  deleteComment(commentId) {
    this.connectToDataBase();
    const sql = `DELETE FROM comment WHERE comment_id = ${commentId}`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("The comment deleted");
    });
    this.closeConnection();
  }
}
class Admin extends moderator {
  constructor(id) {
    super(id);
  }
  createUser(name, role) {
    this.connectToDataBase();
    const sql = `INSERT INTO users (name, role) VALUES ('${name}',${role})`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
    });
    console.log('User created');
    this.closeConnection();
  }

  editComment(commentId, message) {
    this.connectToDataBase();
    const sql = `UPDATE comment SET message = '${message}' WHERE comment_id = ${commentId}`;
    this.connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log("The comment edited");
    });
    this.closeConnection();
  }

}
const user = new User(3);



const admin = new Admin(1);


user.editComment(17, "This is edited!");



module.exports = User;