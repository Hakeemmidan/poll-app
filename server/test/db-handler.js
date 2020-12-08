const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

// @fileDesc : this file is used to create a mock database for testing
// the db is cleared and removed after testing

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  const uri = await mongod.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.createConnection(uri, mongooseOpts);
};

/**
 * Seed database.
 */
module.exports.seed = async () => {
  await seedUsers();
  await seedFriendsForFirstThreeUsers();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * reference(s) :
 *  https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
 */

// Helpers :
seedUsers = async () => {
  const User = mongoose.model('users');

  let name;
  let email;
  let password = '12345678';
  let newUser;

  for (let i = 0; i < 10; i++) {
    name = `seed user ${i}`;
    email = `seedEmail${i}@gmail.com`;

    newUser = new User({ name, email, password });
    try {
      await newUser.save();
    } catch (err) {
      throw err;
    }
  }
};

seedFriendsForFirstThreeUsers = async () => {
  const User = mongoose.model('users');
  // get first three records
  const firstThree = await User.find().sort({ _id: 1 }).limit(3);
  // get last three user ids
  let lastThreeIds = await User.find().sort({ _id: -1 }).distinct('_id');
  lastThreeIds = lastThreeIds.slice(7);

  // make first three all be friends with last three
  for (let i = 0; i < firstThree.length; i++) {
    firstThree[i].friendIds = lastThreeIds;
    await firstThree[i].save();
  }
};
