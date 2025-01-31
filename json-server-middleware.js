import fs from 'fs';

const middleware = (req, res, next) => {
    // Handle GET requests with filtering and pagination
    if (req.method === 'GET' && !req.path.includes('/users/') && !req.path.includes('/posts/')) {
      const resources = req.path.split('/')[1];
      let data = JSON.parse(fs.readFileSync('./db.json'))[resources];
    
      // Handle filtering
      if (req.query.q) {
        const searchTerm = req.query.q.toLowerCase();
        data = data.filter(item => 
          Object.values(item).some(val => 
            String(val).toLowerCase().includes(searchTerm)
          )
        );
      }

      // Handle status filter
      if (req.query.status) {
        data = data.filter(item => item.status === req.query.status);
      }

      // Handle pagination
      const start = parseInt(req.query._start) || 0;
      const end = parseInt(req.query._end) || data.length;
      const paginatedData = data.slice(start, end);

      // Set Content-Range header for pagination
      res.setHeader('Content-Range', `${resources} ${start}-${end}/${data.length}`);
      res.json(paginatedData);
      return;
    }

    // Handle PUT requests
    if (req.method === 'PUT') {
      const resources = req.path.split('/')[1];
      const id = req.path.split('/')[2];
      const data = JSON.parse(fs.readFileSync('./db.json'));
      const index = data[resources].findIndex(item => item.id === id);
      if (index !== -1) {
        data[resources][index] = { ...data[resources][index], ...req.body };
        fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
      }
    }

    // Handle DELETE requests
    if (req.method === 'DELETE') {
      const resources = req.path.split('/')[1];
      const id = req.path.split('/')[2];
      const data = JSON.parse(fs.readFileSync('./db.json'));
      data[resources] = data[resources].filter(item => item.id !== id);
      fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
    }
    
    // Add headers for all requests
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    
    next();
};

export default middleware;