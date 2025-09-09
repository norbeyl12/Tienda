import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import { obtenerProductos, type Producto } from "../routes/products";

const ProductCards: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await obtenerProductos();
      if (res.success && res.data) {
        setProductos(res.data);
      } else {
        setError(res.error || "Error desconocido");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" component="div">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center" component="h1" color="black" fontFamily={"cursive"}>
        Tienda del Gimnasio
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {productos.map((product) => (
          <Grid item key={product.id}>
            <Card sx={{ maxWidth: 300, borderRadius: 3, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="180"
                image={product.image_url}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  {product.category} - {product.brand}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }} component="div">
                  {product.currency} {product.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} component="div">
                  {product.description}
                </Typography>
                <Typography
                  variant="body2"
                  color={product.stock > 0 ? "green" : "red"}
                  sx={{ mt: 1 }}
                  component="div"
                >
                  Stock: {product.stock > 0 ? product.stock : "Agotado"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" size="small" color="primary">
                  Comprar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductCards;
