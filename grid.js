/*добавляем созданный Класс (в отдельном файле) с помощю ИМПОРТА*/
import { Cell } from "./cell.js";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

/*Объявим класс Grid
создадим Конструктор внутри этого Класса, который в параметрах принимает gridElement
Конструктор вызывается 1 раз в момент создания Экземпляра класса
Внутри конструктора создадим 16 ячеек и сохраним в массив cells
Для этого объявим Объект Класса cells"*/
export class Grid {
  /*объявим Объект Класса cells с пустым массивом, а затем циклом for заполним этот массив*/
  constructor(gridElement) {
    this.cells = [];
    for (let i = 0; i < CELLS_COUNT; i++) {
      /*на каждой итерации добавляем новую ячейку, которая экземпляр Класса cell (новый файл)
      Этот Класс в качестве аргумента будет принимать gridElement, х, у
      *gridElement нужен, чтобы мы могли добавить ячейку внутрь div game-board,
      а х и у нужны чтобы понимать положение ячейки*/
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );      
    }
    
    /*Свойство cellsGroupedByColumn - еговычисление сделаем в Методе groupCellsByColum
    ниже, но внутри Класса опишем этот метод*/
    this.cellsGroupedByColumn = this.groupCellsByColumn();
    /*собирает в колонку и переворачивает*/
    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column =>[...column].reverse());
    this.cellsGroupedByRow = this.groupCellsByRow();
    /*с помощью методов map и reverse поменяем в каждой стркое порядок ячеек наоборот*/
    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(row => [...row].reverse());
  }
  
  /*добавляем метод, внутри которого будем искать ВСЕ пустые ячейки*/
  getRandomEmptyCell() {
    /*фильтруем ячейки и записываем в константу только пустые ячейки
    Чтобы понять, что ячейка пустая, позже опишем Метод isEmpty*/
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    /*достаем случайную ячейку среди всех пустых
    для этого MathRandon умножаем на длину массива и возьмем целую часть - 
    єто будет случайное число, не включая длину массива - єто и будет Случайный Индекс*/
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    /*Важно не забыть вернуть случайную пустую ячейку в конце метода:*/
    return emptyCells[randomIndex];
  }
  
  groupCellsByColumn() {
    /*Группируем ячейки в новый массив, для этого воспользуемся методом reduce по нашим 16ти ячейкам
    из this.cells, тогда получим новый массив и оставим нетронутыми наши ячейки 
    Метод reduce принимает в качестве аргумента ф-цию, где пишем группировку и начальный элемент
    (в нашем случае это пустой массив [])
    У ф-ции будет 2 параметра:
    groupedCells - аккумулятор метода reduce? для него у нас начальное значение, равное пустому массиву
    cell - очередная ячейка из массива this.cells*/
    return this.cells.reduce((groupedCells, cell) => {
    /*Далее логика и группировка (время ролика 21:30):*/
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, []);
  }
  
  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, []);
  }
}