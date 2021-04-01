import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: string): Movie {
    const movie = this.movies.find((movie) => movie.id === parseInt(id, 10));
    if (!movie) {
      throw new NotFoundException(`Movie with ID: ${id}`);
    }
    return movie;
  }

  deleteOne(id: string): void {
    this.getOne(id);
    this.movies = this.movies.filter((movie) => movie.id !== parseInt(id, 10));
  }

  create(movieData): void {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
  }

  update(id: string, updateData): void {
    this.getOne(id);
    this.movies = this.movies.map((movie) =>
      movie.id === parseInt(id, 10) ? { id: id, ...updateData } : movie,
    );
  }
}
