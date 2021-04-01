import { Injectable } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: string): Movie {
    return this.movies.find((movie) => movie.id === parseInt(id, 10));
  }

  deleteOne(id: string): boolean {
    const prevLength = this.movies.length;
    this.movies = this.movies.filter((movie) => movie.id !== parseInt(id, 10));
    const nextLength = this.movies.length;
    return prevLength > nextLength;
  }

  create(movieData): void {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
  }

  update(id: string, updateData): void {
    this.movies = this.movies.map((movie) =>
      movie.id === parseInt(id, 10) ? { id: id, ...updateData } : movie,
    );
  }
}
