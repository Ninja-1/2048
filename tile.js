/*Создадим в Классе Tile Конструктор, который в аргументе будет принимать grid-Элемент, 
чтобы мы могли добавить плиточку во внутрь div game board*/
export class Tile {
  constructor(gridElement) {
    /*создаем пустой div элемент и сохраняем в tile-элемент
    указываем через this, т.к. пригодится в дальнейшем*/
    this.tileElement = document.createElement("div");
    /*добавляем этому div Класс tile*/
    this.tileElement.classList.add("tile");
    /*По правилам у плиточки должно быть при создании случайное значение 2 или 4
    this.valeu = Math.random() > 0.5 ? 2 : 4; - перенесено в отдельный метод setValue
    полученное случайное значение добавляем Текстом внутрь div-элемента
    с помощью textContent
    this.tileElement.textContent = this.valeu; - перенесено в отдельный метод setValue
    Добавим созданный div-элемент внутрь div game board*/
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    gridElement.append(this.tileElement);
  }
    
  /*Метод меняет Значение плиточки, Текст и Цвет*/
  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;
    
    /*логика изменения "светлости"
    число на плиточке - 2 в "степени"
    Math.log2 - вычисляет эту "степень"
    если Значение плиточки равно 2, то 100-1*9=91 => плиточка почти белая
    если Значение 2048, то 100-11*9=1 => плиточка черная
    если соберем больше чем 2048, то плитка остается черной*/
    const bgLightness = 100 - Math.log2(value) * 9;
    
    /*Вычисленное значение записываем вместо --bg-lightness и добавляем знак %*/
    this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`);
    
    /*Цвет текста высиляется немного иначе:
    для светлых плиточек, когда --bg-lightness <50% - почти черный
    если >50% - почти белый*/
    
    /*___________ОБРАТНЫЕ КАВЫЧКИ ИМЕЮТ ЗНАЧЕНИЕ!!!_________*/
    this.tileElement.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`);
  }
  
    /*описываем метод setXY - он меняет значение х и у на новые
  а так же будет менять переменные --х и --у в CSS-стилях
  для этого указываем^
  this.tileElement.style.setProperty, где "--x"меняем на x*/ 
  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty("--x", x);
    this.tileElement.style.setProperty("--y", y);
  }
  
  /*Удаляем tillElement с помощью метода remove*/
  removeFromDOM() {
    this.tileElement.remove();
  }
  
  /*Этот метод возвращаем Промис, который завершится, после завершения анимации перемещения плиточки
  Чтобы впоймать момент завершения анимации мы в tileElement с помощью addEventLisnener подпишемся на событие transitionend
  В конце допишем , т.к. нам нужно подписаться на событие 1 раз*/
  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener("transitionend", resolve, { once: true });
    });
  }
  
  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener("animationend", resolve, { once: true });
    });
  }
}



