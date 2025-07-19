function isValidEmail(email = null) {
  var email_str = email;
  const email_regex_test = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
    email_str
  );

  if (email_str !== undefined) {
    if (email_str.length > 0 && email_regex_test) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isGmail(email = null) {
  var email_str = email;
  const email_regex_test = /([a-zA-Z0-9]+[\.|_|\-]*)*@gmail\.(com|es)?/g.test(
    email_str
  );

  if (email_str !== undefined) {
    if (email_str.length > 0 && email_regex_test) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export {
  isValidEmail,
  isGmail
};
