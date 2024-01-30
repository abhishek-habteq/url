const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.post('/urls', (req, res, next) => {
  const { originalUrl, shortName, customShortName } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required.' });
  }

  const timestamp = new Date().toISOString();
  const id = Date.now();

  const newUrl = {
    id,
    originalUrl,
    shortName: shortName || customShortName || generateRandomShortName(),
    timestamp,
  };

  router.db.get('urls').push(newUrl).write();
  res.status(201).json(newUrl);
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});

function generateRandomShortName() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
