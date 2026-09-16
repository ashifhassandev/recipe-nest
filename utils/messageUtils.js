const showFlashMessages = ({
  req,
  res,
  type = "error",
  message = null,
  status,
  redirectUrl = null,
  isJson = false,
  success = false,
}) => {
  req.flash(type, message);

  if (isJson) {
    return res.status(status).json({ success });
  }

  return res.status(status).redirect(redirectUrl);
};

module.exports = showFlashMessages;