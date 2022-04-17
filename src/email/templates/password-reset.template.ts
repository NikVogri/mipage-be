export default `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title></title>
    </head>
    <body>
        <h3>Hi, ##USERNAME##!</h3>
        <p>Here's your password reset URL: <a href="##RESET_URL##">##RESET_URL##</a></p>
        <br>
        <br>
        <p>If you didn't request a password reset, please ignore this email.</p>
    </body>
</html>
`;
