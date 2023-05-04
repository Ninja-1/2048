"use strict";
/*Подключаем Класс Grid с помощью import*/
import { Grid } from "./grid.js";
import { Tile } from "./tile.js";


/*в константу сохнаним div-элемент, который достанем с помощью document.getElementById*/
const gameBoard = document.getElementById("game-board");

/*Grid - это Класс, который хранит все ячейки, опишем его в файле Grid.js*/
const grid = new Grid(gameBoard);  

/*Добавляем плиточку с цыфрой. Для этого нужна случайная ячейка
Это делаем с помощбю метода getRendomCell у экземпляра Класса grid
Патом к ячейке привяжем плиточку с помощью метода linkTile() 
и обязательно создадим саму плиточку с помощбю new Tile (см. отдельный файл)*/
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

/*Подписываемся на событие нажатия клавиши
Подписываемся 1 раз, патом просчитываем логику и просчитываем событие заново*/
setupInputOnce();

function setupInputOnce() {
  /*подписываемся на однократное нажатие клавиши
  после нажатия клавиши будет вызвана ф-ция handleInput*/
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(event) {
  /*подписываемся только на нажатие стрелочных*/
  switch (event.key) {
    case "ArrowUp":
      
      /*Т.к. при нажатии кнопок если даже не смещаются плиточки происходит появление новых,
      то чтобы это избежать, будем перед функцией moveUp проверять, что нам есть куда двигаться
      с помощью новой функции canMoveUp
      Если двигаться некуда. то еще раз подписываемся га гажание клавищи setupInputOnce*/
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;
    default:
      
      /*setupInputOnce - чтобы снова подписаться на нажатие новой*/
      setupInputOnce();
      
      /*return пишем, т.к. не должны реагировать на нажатие других клавиш*/
      return;
  }
  
  /*после каждого перемещения добавляем новую плиточку в случайную ячейку*/
  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);
  
  /*Последний штрих
  После добавления новой плиточки делаем проверку что мы можем ХОТЬ КУДАТО двигаться
  Если никуда не можем, то показывам сообщение "Try again"*/
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd()
    alert("Try again!")
    return;
  }
  
  
  /*Чтобы подписаться после нажатия еще раз на нажатие новой, записываем ф-цию setupInputOnce();*/
  setupInputOnce();
}

/*В ф-ции moveUp будем сдвигать плиточки по сгруппированным по колонкам ячейкам*/
async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

/*методу slideTiles, который группировал колонки, будем передавать массив, который сгрупировал строки*/
async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
  /*т.к. при перемещении и объединении во премя анимации идет сразу объединение
  чтобы видеть сначала перемещение, а затем объединение создаем ПРОМИСЫ при каждом перемещении
  Каждый промис будет дожидаться окончания анимации перемещения своей плиточки
  Все эти промисы добавим в масив promises
  дождемся их выполнения и только после этого выполним объединение плиточек*/
  const promises = [];
  
  
  /*Логика смещения плиточек вверх
  С помощью метода forEath пробежимся по сгруппированным ячейкам
  И для каждой группы вызовем slideTilsInGroup - для каждого столбца с ячейками*/
  groupedCells.forEach(group => slideTilesInGroup(group, promises));
  
  /*Здесь мы дождемся окончания анимации всех плиточек и после этого перейдем к объединению плиточек
  т.к. мы добавили await, то делаем ф-цию АСИНХРОННОЙ*/
  await Promise.all(promises);
 
  /*Код объединения плиточек
  Для этого пробежэимся по всем ячейкам с помощью forEach
  если в ячейке есть плиточка для объединения, то обединим с помощбю метода mergeTiles*/
  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles()
  });
}

function slideTilesInGroup(group, promises) {
  /*Пробежимся по всем ячейкам в столбце, но самую верхнюю не учитываем, поэтому начинаем с i=1*/
  for (let i = 1; i < group.length; i++) {
    /*т.к. смещать будет тлько плиточки, то проверяем ячейку на пустоту
    Если пустая, то пишем continue - прерываем текущую итерацию*/
    if (group[i].isEmpty()) {
      continue;
    }
    
    /*теперь надо найти место, куда можем сместить плиточку с нашей текущей ячейки*/
    /*cellWithTile - это ячейка с плиточкой*/
    const cellWithTile = group[i];
    
    let targetCell; 
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      /*в targetCell сохраняем проверяемую ячейку*/
      targetCell = group[j];
      j--;
    }
    
    /*если мы не нашли целевую ячейку для перемещения - соседняя была с плиточкой с другим значением
    то в этом случае мы снова пишем continue*/
    if (!targetCell) {
      continue;
    }
    
    /*После того, как нашли целевую ячейку мі в массив promises добавляем Промис ожидания окончания анимации
    для этого используем метод waitForTransitionEnd*/
    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());
    
    /*Теперь мы в состоянии, когда мы нашли целевую ячейку для перемещения
    Если ячейка пустая, то мы привязываем нашу плиточку с помощью метода linkedTile*/
    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
    /*Если целевая ячейка с плиточкой, то привязываем нашу плиточку
    с помощью метода linkedTileForMerge - сначало перемещаем, патом объединяем*/
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    } 
    
    /*Когда перелинковали нашу плиточку, то предыдущую ее ячейку надо от нее освободить 
    с помощью метода unlinkTile()*/
    cellWithTile.unlinkTile();
  }
}

/*тут мы работаем с ячейками, сгрупированными по столбцам и аналогично slideTiles */
function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}
function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}
function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}

/*Ф-ция canMove будем пробегать по массиву, сгрупированному в столбцы ячеек и с помощью метода
some будет проверять, что хоть в каком-то из столбцов можно двигаться вверх - это будем проверять с помощью метода
canMoveInGroup*/
function canMove(groupedCells) {
return groupedCells.some(group => canMoveInGroup(group));
};

/*Эта Ф будет принимать массив ячеек (4 ячейки в столбце)
Далее Ф будет пробегать по всем ячейкам и с помощью метода some определять, что хоть какая-то ячека может
сдвинуться вверх*/
function canMoveInGroup(group) {
  return group.some((cell, index) => {
    /*логика, которая определяет, еслть ли куда двигаться плиточке?
    для этого внутри Метода some пишем Ф, которая в аргументах принимает ячейку cell и ее порядковый Индекс
    если index=0, то это самая верхняя ячейка и вышее нее двигаться некуда, поэтому возвращаем false
    Если ячейка пустая(isEmpty), то в ней нет плиточки и нечему двигаться, поэтому возвращаем false*/
    if (index === 0) {
      return false;
    }
    
    if (cell.isEmpty()) {
      return false;
    }
    
    /*Теперь не проверяем все ячейки
    если мы можем передвинуться хотя бы в соседнюю, то нам этого уже достаточно
    для этого, т.е. это ячейка с индексом на 1 меньше должна вернуть результат проверки*/
    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}