/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/books`);
      setBooks(response.data);
    } catch (_error) {
      console.error('view details error:', _error);
      showSnackbar('Error al cargar los libros', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setCurrentBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year || '',
        genre: book.genre || ''
      });
    } else {
      setCurrentBook(null);
      setFormData({ title: '', author: '', year: '', genre: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBook(null);
    setFormData({ title: '', author: '', year: '', genre: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author) {
      showSnackbar('Título y autor son obligatorios', 'warning');
      return;
    }

    const bookData = {
      title: formData.title,
      author: formData.author,
      year: formData.year ? parseInt(formData.year) : null,
      genre: formData.genre || null
    };

    try {
      if (currentBook) {
        await axios.put(`${API_URL}/books/${currentBook.id}`, bookData);
        showSnackbar('Libro actualizado exitosamente');
      } else {
        await axios.post(`${API_URL}/books`, bookData);
        showSnackbar('Libro creado exitosamente');
      }
      fetchBooks();
      handleCloseDialog();
    } catch (error) {
      showSnackbar(
        error.response?.data?.detail || 'Error al guardar el libro',
        'error'
      );
    }
  };

  const handleOpenDeleteDialog = (book) => {
    setSelectedBook(book);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBook(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/books/${selectedBook.id}`);
      showSnackbar('Libro eliminado exitosamente');
      fetchBooks();
      handleCloseDeleteDialog();
    } catch (_error) {
      console.error('view details error:', _error);
      showSnackbar('Error al eliminar el libro', 'error');
    }
  };

  const handleViewDetails = async (bookId) => {
    try {
      const response = await axios.get(`${API_URL}/books/${bookId}`);
      setSelectedBook(response.data);
      setOpenDetailsDialog(true);
    } catch (_error) {
      console.error('view details error:', _error);
      showSnackbar('Error al cargar los detalles', 'error');
    }
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedBook(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Gestión de Libros
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Libro
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Género</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No hay libros registrados
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.id} hover>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewDetails(book.id)}
                        sx={{ textTransform: 'none', textAlign: 'left' }}
                      >
                        {book.title}
                      </Button>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.year || '-'}</TableCell>
                    <TableCell>{book.genre || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        onClick={() => handleViewDetails(book.id)}
                        title="Ver detalles"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(book)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(book)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog para crear/editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentBook ? 'Editar Libro' : 'Nuevo Libro'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Autor"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Año"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Género"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {currentBook ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles del Libro</DialogTitle>
        <DialogContent>
          {selectedBook && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>ID:</strong> {selectedBook.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Título:</strong> {selectedBook.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Autor:</strong> {selectedBook.author}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Año:</strong> {selectedBook.year || 'No especificado'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Género:</strong> {selectedBook.genre || 'No especificado'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el libro "{selectedBook?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;