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

let fruitsJSON = `[{"kind": "Мангустин", "color": "фиолетовый", "weight": 13},{"kind": "Дуриан", "color": "зеленый", "weight": 35},{"kind": "Личи", "color": "розово-красный", "weight": 17},{"kind": "Карамбола", "color": "желтый", "weight": 28},{"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}]`;

let fruits = JSON.parse(fruitsJSON);

const comparationColor = (a, b) => {
  return a.color.localeCompare(b.color);
};

const displayFruits = () => {
  fruitsList.innerHTML = '';

  fruits.forEach((fruit, i) => {
    const colorClass = `fruit_${fruit.color.toLowerCase()}`;
    const li = document.createElement('li');
    li.classList.add('fruit__item', colorClass);
    li.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruit.kind}</div>
        <div>color: ${fruit.color}</div>
        <div>weight (кг): ${fruit.weight}</div>
      </div>
    `;
    fruitsList.appendChild(li);
  });
};

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

const updateFruitBorders = () => {
  const fruitItems = document.querySelectorAll('.fruit__item');

  fruitItems.forEach((item, index) => {
    const colorClass = `fruit_${fruits[index].color.toLowerCase()}`;
    item.className = `fruit__item ${colorClass}`;
  });
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
    displayFruits();
  } else {
    alert('Заполните все поля корректно!');
  }
});