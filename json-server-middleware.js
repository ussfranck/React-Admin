import fs from "fs";

const middleware = (req, res, next) => {
  if (req.method === "GET") {
    console.log({ Query: req.query });
    // Récupérer la ressource depuis l'URL
    const resources = req.path.split("/")[1];
    if (resources) {
      let data = JSON.parse(fs.readFileSync("./db.json"))[resources] || [];

      // Gestion du filtre (recherche) : on vérifie sur req.query.filter d'abord et pas sur req.q ou ce que t'avais d'abord mis la. on le fais car le format des requette quittant du front n'est pas valide lors de la lecture par ton "backend"
      let searchTerm = null;
      if (req.query.filter) {
        try {
          const filter = JSON.parse(req.query.filter); // il faut parser pour avoir les donnes clairement visible et exploitable.
          if (filter.q) {
            searchTerm = filter.q.toLowerCase(); // simplifié
          }
        } catch (error) {
          // Il faut parser cela car la requête arrive dans un format que JSON Server ne supporte peut-être pas directement.
          console.error("Erreur lors du parsing du filtre:", error);
        }
      } else if (req.query.q) {
        searchTerm = req.query.q.toLowerCase(); //...
      }

      if (searchTerm) {
        data = data.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchTerm)
          )
        );
      }

      // Gestion d'un éventuel filtre par "status"
      if (req.query.status) {
        data = data.filter((item) => item.status === req.query.status);
      }

      // Gestion de la pagination
      let start = 0,
        end = data.length;

      // Priorité sur paramètre 'range' parce que c'es ce qui est envoyé par React‑Admin au format JSON (ex: "[0,4]")
      if (req.query.range) {
        try {
          const range = JSON.parse(req.query.range); // ex: [0,4]
          start = parseInt(range[0], 10);
          // Ajout de +1 car slice est exclusif sur la borne supérieure (la doc le dis.)
          end = parseInt(range[1], 10) + 1;
        } catch (error) {
          console.error("Erreur lors du parsing de range:", error);
        }
      }
      // Sinon, si `page` et `perPage` sont présents
      else if (req.query.page && req.query.perPage) {
        const perPage = parseInt(req.query.perPage, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        start = (page - 1) * perPage;
        end = start + perPage;
      }
      // Sinon, on regarde _start et _end (car tu vois c'est le cas par défaut)
      else {
        start = parseInt(req.query._start, 10) || 0;
        end = parseInt(req.query._end, 10) || data.length;
      }

      const paginatedData = data.slice(start, end);

      // On definit les headers pour la pagination
      res.setHeader("Content-Range", `${resources} ${start}-${end - 1}/${data.length}`);
      res.setHeader("X-Total-Count", data.length); // Apparement avec React Admin il faut peut-etre specifier ceci aussi
      res.header("Access-Control-Expose-Headers", "Content-Range, X-Total-Count"); // Idem ici

      return res.json(paginatedData);
    }
  }

  // Gestion des PUT requests
  if (req.method === "PUT") {
    const resources = req.path.split("/")[1];
    const id = req.path.split("/")[2];
    const data = JSON.parse(fs.readFileSync("./db.json"));
    const index = data[resources].findIndex((item) => String(item.id) === id);
    if (index !== -1) {
      data[resources][index] = { ...data[resources][index], ...req.body };
      fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
    }
  }

  // Gestion des DELETE requests
  if (req.method === "DELETE") {
    const resources = req.path.split("/")[1];
    const id = req.path.split("/")[2];
    const data = JSON.parse(fs.readFileSync("./db.json"));
    data[resources] = data[resources].filter((item) => String(item.id) !== id);
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  }

  // Ajouter les en-têtes pour toutes les requêtes
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Origin", "*");

  // Gérer les requêtes preflight
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
};

export default middleware;
