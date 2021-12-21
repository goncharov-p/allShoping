let allPurchases = [];
let valueInput = '';
let valueInputSum = '';
let input1 = null;
let input2 = null;
let activeEditCard = null;
const link = 'http://localhost:8000';
let activDirection = null;
let activeSum = null;
let now = new Date().toLocaleDateString();
now = now.split('/').join('.');
let finalSum = null;


const getPurchases = async () => {
  const resp = await fetch(`${link}/allPurchases`, {
    method: 'GET'
  });
  let result = await resp.json();
  allPurchases = result.data;
  render();
  finalSum = 0;

}

window.onload = async function init() {
  input1 = document.getElementById('add');
  input2 = document.getElementById('add-sum');
  input1.addEventListener('change', updateValue);
  input2.addEventListener('change', updateValueSum);

  getPurchases();

}

updateValue = (event) => {
  valueInput = event.target.value;
}

updateValueSum = (event) => {
  valueInputSum = event.target.value;
}

 onClickButton = async () => {
  if (valueInput && valueInputSum) {
    const resp = await fetch(`${link}/createPurchases`, {
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

const render = () => {
  const content = document.getElementById('content-page');

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
  let initialValue = 0;

  finalSum = allPurchases.reduce(function(sum, currentSum) {
    return sum + currentSum.sum;
  },initialValue);
  allPurchases

    .map((item, index) => {
      
      const container = document.createElement('div');
      container.className = 'purchases-container';
      const numberPosition = document.createElement("p");
      numberPosition.innerText = index+1 + ")";
      container.appendChild(numberPosition);
      const conteinerBox = document.createElement('div');
      conteinerBox.className = 'task-c';
      const conteinerImg = document.createElement('div');
      conteinerImg.className = 'box-img';

      if (item._id === activeEditCard) {

        const inputTask = document.createElement('input');
        inputTask.className = 'add';
        const inputTaskSum = document.createElement('input');
        inputTaskSum.className = 'add-sum';
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
        daTe.className = "date-card"
        daTe.innerText = now;
        text.innerText = item.purchases;
        textSum.innerText = item.sum + "p";
        container.appendChild(text);
        conteinerBox.appendChild(daTe);
        conteinerBox.appendChild(textSum);
        container.appendChild(conteinerBox);
      }
      if (item._id === activeEditCard) {
        const imageDone = document.createElement('img');
        imageDone.src = 'images/gal.svg';
        imageDone.onclick = function () {
          updateShopingList(item._id, item.purchases, item.sum);
          doneEditTask();
        };
        container.appendChild(imageDone);
      } else {
        const imageEdit = document.createElement('img');
        imageEdit.src = 'images/kar.svg'
        imageEdit.onclick = function () {
          activeEditCard = item._id;
          render();
        };
        conteinerImg.appendChild(imageEdit); 
      }               

      const imageDelete = document.createElement('img');
      imageDelete.src = 'images/urn.svg';
      imageDelete.onclick = function () {
        onDelete(item._id,item,allPurchases.length);
      }
      conteinerImg.appendChild(imageDelete);
      conteinerBox.appendChild(conteinerImg)
      content.appendChild(container);
      document.getElementById("demo").innerHTML = finalSum;
    });
    
}

const onDelete = async (indexToDel,item,length) => {
  if(length === 1){
    finalSum = 0;
    document.getElementById("demo").innerHTML = finalSum;
  }
  const resp = await fetch(`${link}/deletePurchases?id=${indexToDel}`, {
    method: 'DELETE',
  });

  if(resp){
    allPurchases.forEach((item,index) => {
      if (item._id === indexToDel) {
        allPurchases.splice(index,1);
      }
      return allPurchases
    })
    render();
  }
}

const setActivePurchases = (e) => {
  activDirection = e.target.value;
}
const setActiveSum = (e) => {
  activeSum = e.target.value;
}

const updateShopingList = async (_id, text, price) => {
  let updateActivDirection = activDirection;
  console.log(activDirection)
  let updateActiveSum = activeSum;
  const resp = await fetch(`${link}/updatePurchases`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      _id: _id,
      purchases: activDirection ? activDirection : text,
      sum: activeSum ? activeSum : price,
    })
  });

  if(resp){
    allPurchases = allPurchases.map(item => {
      const newTask = {...item};
      if (item._id === _id) {
        newTask.purchases = updateActivDirection ? updateActivDirection : text;
        newTask.sum = Number(updateActiveSum ? updateActiveSum : price);
      }
      return newTask
    })
    render();
  }
}

const doneEditTask = () => {
  activeEditCard = null;
  activDirection = null;
  activeSum = null;
  render();
}