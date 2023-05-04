export class Cell {
  constructor (gridElement, x, y) {
    /*далее создаем пустой элемент div*/
    const cell = document.createElement("div");
    /*добавляем ДИВу Класс cell*/
    cell.classList.add("cell");
    /*Добавляем див-эдлемент внутрь div id="game-board"*/
    gridElement.append(cell);
    /*сохраняем х и у внутри Класса*/
    this.x = x;
    this.y = y;
  }
  
  /*Описываем метод linkTile
  в аргументах ринимает плиточку tile
  Этот метод будет сохранять плиточку внутри ячейки this.linkedTile
  И метод будет останавливать координаты плиточки с помощью метода setXY (опишем отдельно)*/
  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }
  
  /*перепривязывает ссылку на привязанную плиточку на null*/
  unlinkTile() {
    this.linkedTile = null;
  }
  
  /*isEmpty возвращает folse или true в зависимости от того, есть ли у ячейки привязанная плиточка или нет*/
  isEmpty() {
    return !this.linkedTile;
  }
  
  /*Меняем координаты плиточки на новые с помощью метода setXY
  и так же сохраняем ссылку на плиточку в linkedTileForMerge - отличается от существующего
  метода linkTile в том, чтобы потом после объединения удалить ее*/
  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }
  
  /*Очищаем значение linkedTileForMerge*/
  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }
  
  /*Метод показывает true когда к ячеке уже привзяали плиточку на объединение*/
  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }
  
  /*в этом методе мы проверяем, можем ли мы переместить плиточку на текущую ячейку и возвращаем
  true или folse
  Ячейка может принять плиточку, если она пустая ИЛИ если к ней не привязали другую плиточку И у текущей и новой плиточек Одинаковые значения*/
  canAccept(newTile) {
    return (
      this.isEmpty() ||
      (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    );
  }
  
  /*этим методом заменяем значение плиточки на сумму 2х плиточек
  После удаляем 2-ю плиточку из верстки с помощью removeFromDom
  и отвязиваем вторую плиточку от ячейки с помощью umlinkTileForMerge*/
  mergeTiles() {
    
    this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }
}