let allPurchases = [];
let valueInput = '';
let valueInputSum = '';
let input1 = null;
let input2 = null;
let activeEditTask = null;
const link = 'http://localhost:8000';
let activDirection = null;
let activeSum = null;
let now = new Date().toLocaleDateString();
now = now.split('/').join('.');
let finalSum = null;


const getTasks = async () => {
  const resp = await fetch(`${link}/allTasks`, {
    method: 'GET'
  });
  let result = await resp.json();
  allPurchases = result.data;
  render();
  finalSum = 0;

}

window.onload = async function init() {
  input1 = document.getElementById('add-task');
  input2 = document.getElementById('add-task-sum');
  input1.addEventListener('change', updateValue);
  input2.addEventListener('change', updateValueSum);

  getTasks();

}

updateValue = (event) => {
  valueInput = event.target.value;
}

updateValueSum = (event) => {
  valueInputSum = event.target.value;
}

onClickButton = async () => {
  if (valueInput && valueInputSum) {
    const resp = await fetch(`${link}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        purchases: valueInput,
        sum: valueInputSum,
        date: now,
      })
    })

    const result = await resp.json()
      .then((resp) => {
        allPurchases.push(resp);
        valueInput = '';
        valueInputSum = '';
        input1.value = '';
        input2.value = '';
        render();
        finalSum = 0;
      });
  } else {
    alert('Поле не может быть пустым')
  }
}

render = () => {
  const content = document.getElementById('content-page');

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allPurchases

  // let initialValue = 0;
  // finalSum = allPurchases.reduce(function(sum, currentSum) {
  //   return sum+ currentSum.cost;
  // },initialValue)

    .map((item, index) => {
      
      const container = document.createElement('div');
      container.id = `task-${index}`;
      container.className = 'task-container';
      const numberPosition = document.createElement("p");
      numberPosition.innerText = index+1 + ")";
      container.appendChild(numberPosition);
      const conteinerBox = document.createElement('div');
      conteinerBox.className = 'task-c';
      const conteinerImg = document.createElement('div');
      conteinerImg.className = 'box-img';

      if (item._id === activeEditTask) {

        const inputTask = document.createElement('input');
        inputTask.className = 'add-task';
        const inputTaskSum = document.createElement('input');
        inputTaskSum.className = 'add-task-sum';
        inputTask.type = 'text';
        inputTaskSum.type = 'number';
        inputTask.value = item.purchases;
        inputTaskSum.value = item.sum;
        inputTask.addEventListener('change', setActivePurchases)
        inputTaskSum.addEventListener('change', setActiveSum)
        container.appendChild(inputTask)
        container.appendChild(inputTaskSum)
      } else {
        const text = document.createElement('p');
        text.className = "text-card";
        const textSum = document.createElement('p');
        textSum.className = "sum-card";
        const daTe = document.createElement('p');
        daTe.className = "date-kard"
        const sumIndex = document.createElement('p');
        sumIndex.className = "date-kard"
        sumIndex.innerText = "р";
        daTe.innerText = now;
        text.innerText = item.purchases;
        textSum.innerText = item.sum;
        container.appendChild(text);
        conteinerBox.appendChild(daTe);
        conteinerBox.appendChild(textSum);
        conteinerBox.appendChild(sumIndex);
        container.appendChild(conteinerBox);
      }
      if (item._id === activeEditTask) {
        const imageDone = document.createElement('img');
        imageDone.src = 'images/gal.svg';
        imageDone.onclick = function () {
          updateTaskText(item._id, item.purchases, item.sum);
          doneEditTask();
        };
        container.appendChild(imageDone);
      } else {
        const imageEdit = document.createElement('img');
        imageEdit.src = 'images/kar.svg'
        imageEdit.onclick = function () {
          activeEditTask = item._id;
          render();
        };
        conteinerImg.appendChild(imageEdit); 
        document.getElementById("demo").innerHTML = finalSum;
      }               

      const imageDelete = document.createElement('img');
      imageDelete.src = 'images/urn.svg';
      imageDelete.onclick = function () {
        onDeleteTask(item._id,item);
      }
      conteinerImg.appendChild(imageDelete);
      conteinerBox.appendChild(conteinerImg)
      content.appendChild(container);
    });
    
}

onDeleteTask = async (index,item) => {
  const resp = await fetch(`${link}/deleteTask?id=${index}`, {
    method: 'DELETE',
  });
  getTasks();
}

setActivePurchases = (e) => {
  activDirection = e.target.value;
}
setActiveSum = (e) => {
  activeSum = e.target.value;
}

updateTaskText = async (_id, text, price) => {
  const resp = await fetch(`${link}/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      _id: activeEditTask,
      purchases: activDirection ? activDirection : text,
      sum: activeSum ? activeSum : price,
    })
  });

  getTasks();
}

doneEditTask = () => {
  activeEditTask = null;
  activDirection = null;
  activeSum = null;
  render();
}