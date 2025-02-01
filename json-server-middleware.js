import fs from 'fs';

const middleware = (req, res, next) => {
  // On intercepte uniquement les requêtes GET pour gérer le filtrage et la pagination
  if (req.method === 'GET') {
    // Récupérer la ressource depuis l'URL
    const resources = req.path.split('/')[1];
    if (resources) {
      let data = JSON.parse(fs.readFileSync('./db.json'))[resources] || [];

      // Gestion du filtre (recherche) on ne verifie pas direct sur la query mais directemnt sur le filter
      let searchTerm = null;
      if (req.query.filter) {
        try {
          const filter = JSON.parse(req.query.filter);
          if (filter.q) {
            searchTerm = filter.q.toLowerCase();
          }
        } catch (error) {
          // Il faut faut parser cela car la requette vient dans un format que peut-etre JSON server ne supporte pas.
          console.error('Erreur lors du parsing du filtre:', error);
        }
      } else if (req.query.q) {
        searchTerm = req.query.q.toLowerCase(); // comparaison simplifié
      }

      if (searchTerm) {
        data = data.filter(item =>
          Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm)
          )
        );
      }

      // Gestion d'un éventuel filtre par "status"
      if (req.query.status) {
        data = data.filter(item => item.status === req.query.status);
      }

      // Gestion de la pagination
      // On vérifie si ReactAdmin envoie page et perPage, sinon on regarde _start/_end
      let start, end;
      if (req.query.page && req.query.perPage) {
        const perPage = parseInt(req.query.perPage) || 10;
        const page = parseInt(req.query.page) || 1;
        start = (page - 1) * perPage;
        end = start + perPage;
      } else {
        start = parseInt(req.query._start) || 0;
        end = parseInt(req.query._end) || data.length;
      }
      const paginatedData = data.slice(start, end);

      // Définir l'en-tête Content-Range pour la pagination
      res.setHeader('Content-Range', `${resources} ${start}-${end - 1}/${data.length}`);
      res.json(paginatedData);
      return;
    }
  }

  // Gestion des PUT requests
  if (req.method === 'PUT') {
    const resources = req.path.split('/')[1];
    const id = req.path.split('/')[2];
    const data = JSON.parse(fs.readFileSync('./db.json'));
    const index = data[resources].findIndex(item => String(item.id) === id);
    if (index !== -1) {
      data[resources][index] = { ...data[resources][index], ...req.body };
      fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
    }
  }

  // Gestion des DELETE requests
  if (req.method === 'DELETE') {
    const resources = req.path.split('/')[1];
    const id = req.path.split('/')[2];
    const data = JSON.parse(fs.readFileSync('./db.json'));
    data[resources] = data[resources].filter(item => String(item.id) !== id);
    fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
  }
  
  // Ajouter les en-têtes pour toutes les requêtes
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Expose-Headers', 'Content-Range');
  
  // Gérer les requêtes preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
};

export default middleware;