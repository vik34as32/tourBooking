const Review = require('../../Models/reviewModel')
const Factory = require('../HandleFactory/handleFactory')



exports.setTouUserId =(req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };
exports.getAllReviews   = Factory.getAll(Review)
exports.getReviews = Factory.getOne(Review)
exports.createReview =Factory.createOne(Review)
exports.updateReview = Factory.updateOne(Review)
exports.DeleteReview =Factory.deleteOne(Review)