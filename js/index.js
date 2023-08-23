const fruitsList = document.querySelector('.fruits__list');
const shuffleButton = document.querySelector('.shuffle__btn');
const filterButton = document.querySelector('.filter__btn');
const sortKindLabel = document.querySelector('.sort__kind');
const sortTimeLabel = document.querySelector('.sort__time');
const sortChangeButton = document.querySelector('.sort__change__btn');
const sortActionButton = document.querySelector('.sort__action__btn');
const kindInput = document.querySelector('.kind__input');
const colorInput = document.querySelector('.color__input');
const weightInput = document.querySelector('.weight__input');
const addActionButton = document.querySelector('.add__action__btn');
const minWeightInput = document.querySelector('.minweight__input');
const maxWeightInput = document.querySelector('.maxweight__input');

const colorTranslations = {
  'фиолетовый': 'violet',
  'зеленый': 'green',
  'розово-красный': 'carmazin',
  'желтый': 'yellow',
  'светло-коричневый': 'lightbrown'
};

let fruitsJSON = `[{"kind": "Мангустин", "color": "фиолетовый", "weight": 13},{"kind": "Дуриан", "color": "зеленый", "weight": 35},{"kind": "Личи", "color": "розово-красный", "weight": 17},{"kind": "Карамбола", "color": "желтый", "weight": 28},{"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}]`;

let fruits = JSON.parse(fruitsJSON);

const comparationColor = (a, b) => {
  return a.color.localeCompare(b.color);
};

const displayFruits = () => {
  fruitsList.innerHTML = '';

  fruits.forEach((fruit, i) => {
    const li = document.createElement('li');
    li.classList.add('fruit__item', `fruit_${colorTranslations[fruit.color].toLowerCase()}`);

    const div = document.createElement('div');
    div.classList.add('fruit__info');

    const indexDiv = document.createElement('div');
    indexDiv.textContent = `index: ${i}`;
    const kindDiv = document.createElement('div');
    kindDiv.textContent = `kind: ${fruit.kind}`;
    const colorDiv = document.createElement('div');
    colorDiv.textContent = `color: ${fruit.color}`;
    const weightDiv = document.createElement('div');
    weightDiv.textContent = `weight (кг): ${fruit.weight}`;

    div.appendChild(indexDiv);
    div.appendChild(kindDiv);
    div.appendChild(colorDiv);
    div.appendChild(weightDiv);

    li.appendChild(div);
    fruitsList.appendChild(li);
  });

  updateFruitBorders();
};

const updateFruitBorders = () => {
  const fruitItems = document.querySelectorAll('.fruit__item');

  fruitItems.forEach(item => {
    const colorClass = [...item.classList].find(cls => cls.startsWith('fruit_'));
    const computedStyle = getComputedStyle(document.documentElement);
    const borderColorVar = `--${colorTranslations[colorClass.replace('fruit_', '')]}`; // Правильное получение имени цвета
    item.style.borderColor = computedStyle.getPropertyValue(borderColorVar);
    item.style.borderStyle = 'solid';
  });
};

displayFruits();

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    const randomFruit = fruits.splice(randomIndex, 1)[0];
    result.push(randomFruit);
  }

  fruits = result;
  displayFruits(); 
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
});

const filterFruits = () => {
  const minWeight = parseInt(document.querySelector('.minweight__input').value);
  const maxWeight = parseInt(document.querySelector('.maxweight__input').value);
  
  fruits = fruits.filter((item) => {
    return item.weight >= minWeight && item.weight <= maxWeight;
  });
  
  displayFruits();
};

filterButton.addEventListener('click', () => {
  filterFruits();
  displayFruits();
});

const sortAPI = {
  bubbleSort(arr, comparation) {
    arr = [...arr]; 
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < arr.length - 1; i++) {
        if (comparation(arr[i], arr[i + 1]) > 0) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
    return arr; 
  },

  quickSort: function(arr, comparation) {
    const self = this;

    const quickSortRecursive = function(arr, comparation) {
      if (arr.length <= 1) {
        return arr;
      }

      const pivot = arr[0];
      const left = [];
      const right = [];

      for (let i = 1; i < arr.length; i++) {
        if (comparation(arr[i], pivot) < 0) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
      }

      const sortedLeft = quickSortRecursive(left, comparation);
      const sortedRight = quickSortRecursive(right, comparation);

      return [...sortedLeft, pivot, ...sortedRight];
    };

    return quickSortRecursive(arr, comparation);
  },

  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    const sortedArr = sort([...arr], comparation); 
    const end = new Date().getTime();
    sortTimeLabel.textContent = `Sorting time: ${end - start} ms`;
    
    const selectedColor = colorInput.value.trim().toLowerCase();
    const selectedIndex = sortedArr.findIndex(fruit => fruit.color.toLowerCase() === selectedColor);
    
    if (selectedIndex !== -1 && selectedIndex !== 0) {
      const temp = sortedArr[0];
      sortedArr[0] = sortedArr[selectedIndex];
      sortedArr[selectedIndex] = temp;
    }
    
    fruits = [...sortedArr]; 
    displayFruits();
  },
};

let sortKind = 'bubbleSort'; 

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'Sorting time: ...';
  const sortFunction = sortKind === 'bubbleSort' ? sortAPI.bubbleSort : sortAPI.quickSort;
  sortAPI.startSort(sortFunction, fruits, comparationColor);
  displayFruits(); 
});

addActionButton.addEventListener('click', () => {
  const newKind = kindInput.value.trim();
  const newColor = colorInput.value.trim();
  const newWeight = parseInt(weightInput.value);

  if (newKind && newColor && !isNaN(newWeight)) {
    const newFruit = {
      kind: newKind,
      color: newColor,
      weight: newWeight
    };
    fruits.push(newFruit);

    const li = document.createElement('li');
    li.classList.add('fruit__item', 'fruit_black'); // Добавляем класс fruit_black

    const div = document.createElement('div');
    div.classList.add('fruit__info');

    const indexDiv = document.createElement('div');
    indexDiv.textContent = `index: ${fruits.length - 1}`;
    const kindDiv = document.createElement('div');
    kindDiv.textContent = `kind: ${newKind}`;
    const colorDiv = document.createElement('div');
    colorDiv.textContent = `color: ${newColor}`;
    const weightDiv = document.createElement('div');
    weightDiv.textContent = `weight (кг): ${newWeight}`;

    div.appendChild(indexDiv);
    div.appendChild(kindDiv);
    div.appendChild(colorDiv);
    div.appendChild(weightDiv);

    li.appendChild(div);
    fruitsList.appendChild(li);
  } else {
    alert('Заполните все поля корректно!');
  }
});