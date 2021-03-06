/**
 * Module dependencies.
 */

// Redirect users to /#!/app (forcing Angular to reload the page)

exports.play = function (req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = function (req, res) {
  return res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });
};
