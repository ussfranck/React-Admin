import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useGetList } from 'react-admin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { data: users, total: totalUsers } = useGetList('users');
  const { data: posts, total: totalPosts } = useGetList('posts');

  // Préparer les données pour le graphique en barres (nombre de posts par utilisateur)
  const postsPerUser = users?.map(user => ({
    name: user.name,
    posts: posts?.filter(post => post.authorId === user.id).length,
  }));

  // Préparer les données pour le graphique en camembert (répartition des posts publiés vs brouillons)
  const postStatusDistribution = [
    { name: 'Published', value: posts?.filter(post => post.status === 'published').length },
    { name: 'Draft', value: posts?.filter(post => post.status === 'draft').length },
  ];

  // Couleurs pour le graphique en camembert
  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Dashboard
        </Typography>

        {/* Cartes de statistiques rapides */}
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">
                  Total Users
                </Typography>
                <Typography variant="h4">
                  {totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">
                  Total Posts
                </Typography>
                <Typography variant="h4">
                  {totalPosts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Graphique en barres : Nombre de posts par utilisateur */}
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Posts per User
        </Typography>
        <BarChart width={500} height={300} data={postsPerUser}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="posts" fill="#8884d8" />
        </BarChart>

        {/* Graphique en camembert : Répartition des posts publiés vs brouillons */}
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Post Status Distribution
        </Typography>
        <PieChart width={400} height={300}>
          <Pie
            data={postStatusDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {postStatusDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default Dashboard;