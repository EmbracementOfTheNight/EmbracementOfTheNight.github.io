exports.handler = async (event) => {
  const PASSWORD = 'p422w0rd'; // <-- Set your password here
  const { password } = JSON.parse(event.body || '{}');

  if (password === PASSWORD) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } else {
    return {
      statusCode: 403,
      body: JSON.stringify({ success: false })
    };
  }
};