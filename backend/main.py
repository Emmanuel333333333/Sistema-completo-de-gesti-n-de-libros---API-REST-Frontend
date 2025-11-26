from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from contextlib import contextmanager
import sqlite3
import uvicorn

app = FastAPI(title="Books API", version="1.0.0")

# Define el orden de tags
tags_metadata = [
    {
        "name": "Books",
        "description": "Operaciones con libros",
    },
]

app.openapi_tags = tags_metadata

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=100)
    year: Optional[int] = Field(None, ge=1000, le=9999)
    genre: Optional[str] = Field(None, max_length=50)

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class Book(BookBase):
    id: int

    class Config:
        from_attributes = True

# Gestión de base de datos
DATABASE_NAME = "books.db"

@contextmanager
def get_db_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                year INTEGER,
                genre TEXT
            )
        """)
        conn.commit()

# Inicializar base de datos al arrancar
init_db()

# Endpoints
@app.post("/books", response_model=Book, status_code=status.HTTP_201_CREATED, tags=["Books"])
def create_book(book: BookCreate):
    # POST /books: Crear un nuevo libro
    try:
        with get_db_connection() as conn:
            cursor = conn.execute(
                "INSERT INTO books (title, author, year, genre) VALUES (?, ?, ?, ?)",
                (book.title, book.author, book.year, book.genre)
            )
            conn.commit()
            book_id = cursor.lastrowid
            row = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
            return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating book: {str(e)}")

@app.get("/books", response_model=List[Book], tags=["Books"])
def get_books():
    # GET /books: Obtener la lista de todos los libros
    try:
        with get_db_connection() as conn:
            rows = conn.execute("SELECT * FROM books").fetchall()
            return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching books: {str(e)}")

@app.get("/books/{book_id}", response_model=Book, tags=["Books"])
def get_book(book_id: int):
    # GET /books/{id}: Obtener detalles de un libro específico
    try:
        with get_db_connection() as conn:
            row = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail=f"Book with id {book_id} not found")
            return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching book: {str(e)}")

@app.put("/books/{book_id}", response_model=Book, tags=["Books"])
def update_book(book_id: int, book: BookUpdate):
    # PUT /books/{id}: Actualizar información de un libro
    try:
        with get_db_connection() as conn:
            existing = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
            if existing is None:
                raise HTTPException(status_code=404, detail=f"Book with id {book_id} not found")
            conn.execute(
                "UPDATE books SET title = ?, author = ?, year = ?, genre = ? WHERE id = ?",
                (book.title, book.author, book.year, book.genre, book_id)
            )
            conn.commit()
            row = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
            return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating book: {str(e)}")

@app.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Books"])
def delete_book(book_id: int):
    # DELETE /books/{id}: Eliminar un libro
    try:
        with get_db_connection() as conn:
            existing = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
            if existing is None:
                raise HTTPException(status_code=404, detail=f"Book with id {book_id} not found")
            conn.execute("DELETE FROM books WHERE id = ?", (book_id,))
            conn.commit()
            return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting book: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)