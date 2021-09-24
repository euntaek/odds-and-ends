import { Injectable, NotFoundException } from '@nestjs/common';
import { v1 as uuid } from 'uuid';

import { Board } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  getAllBoards(): Board[] {
    return this.boards;
  }
  createBoard(createBoardDto: CreateBoardDto) {
    const { title, description } = createBoardDto;
    const board: Board = {
      id: uuid(),
      title,
      description,
      status: 'PUBLIC',
    };
    this.boards.push(board);
    return board;
  }

  getBoardById(id: string) {
    const found = this.boards.find((board) => board.id === id);
    if (!found) throw new NotFoundException();
    return found;
  }

  deleteBoard(id: string) {
    const found = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== found.id);
  }

  updateBoardStatus(id: string, status: 'PUBLIC' | 'PRIVATE') {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }
}
