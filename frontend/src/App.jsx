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
  CircularProgress,
  Chip,
  Fade,
  Slide,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  MenuBook as BookIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      console.error('Error al cargar libros:', _error);
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
        showSnackbar('Libro actualizado exitosamente', 'success');
      } else {
        await axios.post(`${API_URL}/books`, bookData);
        showSnackbar('Libro creado exitosamente', 'success');
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
      showSnackbar('Libro eliminado exitosamente', 'success');
      fetchBooks();
      handleCloseDeleteDialog();
    } catch (_error) {
      console.error('Error al eliminar:', _error);
      showSnackbar('Error al eliminar el libro', 'error');
    }
  };

  const handleViewDetails = async (bookId) => {
    try {
      const response = await axios.get(`${API_URL}/books/${bookId}`);
      setSelectedBook(response.data);
      setOpenDetailsDialog(true);
    } catch (_error) {
      console.error('Error al ver detalles:', _error);
      showSnackbar('Error al cargar los detalles', 'error');
    }
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedBook(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pb: 4
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar>
          <BookIcon sx={{ mr: 2, fontSize: 32, color: 'white' }} />
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              color: 'white',
              letterSpacing: 1
            }}
          >
            Biblioteca Digital
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Nuevo Libro
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Stats Card */}
        <Fade in timeout={800}>
          <Card 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BookIcon sx={{ fontSize: 40, color: '#667eea' }} />
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#667eea">
                    {books.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Libros en la colección
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Table Container */}
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 400,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)'
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
          </Box>
        ) : (
          <Fade in timeout={1000}>
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(102, 126, 234, 0.08)' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#667eea' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#667eea' }}>Título</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#667eea' }}>Autor</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#667eea' }}>Año</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#667eea' }}>Género</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#667eea' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <BookIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No hay libros registrados
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Comienza agregando tu primer libro
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    books.map((book) => (
                      <TableRow 
                        key={book.id} 
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.04)',
                            transition: 'all 0.2s ease'
                          }
                        }}
                      >
                        <TableCell>
                          <Chip 
                            label={`#${book.id}`} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600,
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleViewDetails(book.id)}
                            sx={{ 
                              textTransform: 'none', 
                              textAlign: 'left',
                              fontWeight: 600,
                              color: '#667eea',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.08)'
                              }
                            }}
                          >
                            {book.title}
                          </Button>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {book.author}
                        </TableCell>
                        <TableCell>
                          {book.year ? (
                            <Chip 
                              label={book.year} 
                              size="small" 
                              variant="outlined"
                              sx={{ borderColor: '#667eea', color: '#667eea' }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.disabled">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {book.genre ? (
                            <Chip 
                              label={book.genre} 
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(118, 75, 162, 0.1)',
                                color: '#764ba2',
                                fontWeight: 500
                              }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.disabled">-</Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalles">
                            <IconButton
                              onClick={() => handleViewDetails(book.id)}
                              sx={{ 
                                color: '#667eea',
                                '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' }
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => handleOpenDialog(book)}
                              sx={{ 
                                color: '#764ba2',
                                '&:hover': { bgcolor: 'rgba(118, 75, 162, 0.1)' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => handleOpenDeleteDialog(book)}
                              sx={{ 
                                color: '#f44336',
                                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Fade>
        )}
      </Container>

      {/* Dialog para crear/editar */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon />
            <span>{currentBook ? 'Editar Libro' : 'Nuevo Libro'}</span>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Título del libro"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                }
              }}
            />
            <TextField
              label="Autor"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                }
              }}
            />
            <TextField
              label="Año de publicación"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                }
              }}
            />
            <TextField
              label="Género literario"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#666',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              }
            }}
          >
            {currentBook ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles */}
      <Dialog 
        open={openDetailsDialog} 
        onClose={handleCloseDetailsDialog}
        TransitionComponent={Transition}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon />
            <span>Detalles del Libro</span>
          </Box>
          <IconButton onClick={handleCloseDetailsDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 3 }}>
          {selectedBook && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  ID
                </Typography>
                <Typography variant="h6" fontWeight={600} color="#667eea">
                  #{selectedBook.id}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  TÍTULO
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                  {selectedBook.title}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  AUTOR
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedBook.author}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    AÑO
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedBook.year || 'No especificado'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    GÉNERO
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedBook.genre || 'No especificado'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDetailsDialog}
            variant="contained"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.2,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#f44336',
          fontWeight: 600
        }}>
          <DeleteIcon />
          Confirmar Eliminación
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            ¿Está seguro de que desea eliminar el libro{' '}
            <strong>"{selectedBook?.title}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              color: '#666'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            sx={{
              bgcolor: '#f44336',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: '#d32f2f',
              }
            }}
          >
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            fontWeight: 500
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;