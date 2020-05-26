const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const router = express.Router({ mergeParams: true });
const User = require('../../../models/user');

// @route:  GET /users/:userId/friends
// @desc:   Find and return array of friends of specified userId
// @access: Public
router.get('/', async (req, res) => {
  let user = await User.findById(req.params.userId)
    .populate('friendIds')
    .exec();
  let friends = user.friendIds;
  // filter out only wanted fields
  friends = friends.map((friend) => {
    return (({ _id, email, name }) => ({ _id, email, name }))(friend);
  });

  res.json({ friends: user.friendIds });
});

// @route:  GET /users/:userId/friends/suggestions?name=<query>
// @desc:   Gets a list of suggested friends (random). Can take a name query parameter
// @access: Private
router.get(
  '/suggestions',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const nameQuery = req.query.name;
    let suggestions;

    if (nameQuery) {
      suggestions = await User.find({
        name: new RegExp(nameQuery, 'i'),
      });
    } else {
      suggestions = await User.find({});
    }

    return res.status(200).json({ suggestions });
  }
);

// @route:  POST /users/:userId/friends/:friendId/follow
// @desc:   Make current user follow user at friendId
// @access: Private
router.post(
  '/:friendId/follow',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const currUser = await User.findOne({ _id: req.params.userId });
    const followeeId = req.params.friendId;
    const followeeIdIsValid = await mongoose.isValidObjectId(followeeId);

    if (!followeeIdIsValid) {
      return res
        .status(404)
        .json({ message: 'Invalid provided friendId param' });
    }

    const followeeExists = await User.exists({ _id: followeeId });

    if (!followeeExists) {
      return res
        .status(404)
        .json({ message: 'No user at provided friendId param' });
    } else if (currUser.friendIds.includes(followeeId)) {
      return res.status(401).json({ message: 'User already followed' });
    }

    currUser.friendIds.push(followeeId);
    await currUser.save();

    res.json({
      message: 'Success! User followed',
      updatedRequestAuthor: currUser,
    });
  }
);

// @route:  DELETE /users/:userId/friends/:friendId/follow
// @desc:   Make current user unfollow user at friendId
// @access: Private
router.delete(
  '/:friendId/follow',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const currUser = await User.findOne({ _id: req.params.userId });
    const unfolloweeId = req.params.friendId;
    const unfolloweeIdIsValid = await mongoose.isValidObjectId(unfolloweeId);

    if (!unfolloweeIdIsValid) {
      return res
        .status(404)
        .json({ message: 'Invalid provided friendId param' });
    }

    const followeeExists = await User.exists({ _id: unfolloweeId });

    if (!followeeExists) {
      return res
        .status(404)
        .json({ message: 'No user at provided friendId param' });
    } else if (!currUser.friendIds.includes(unfolloweeId)) {
      return res.status(401).json({ message: 'User already unfollowed' });
    }

    currUser.friendIds = currUser.friendIds.filter(
      (el) => el._id.toString() !== unfolloweeId
    );
    await currUser.save();

    res.json({
      message: 'Success! User unfollowed',
      updatedRequestAuthor: currUser,
    });
  }
);

module.exports = router;
