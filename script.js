let allPurchases = [];
let valueInput = '';
let valueInputSum = '';
let inputText = null;
let inputTextSum = null;
let activeEditCard = null;
const link = 'http://localhost:8000';
let activDirection = null;
let activeSum = null;
let now = new Date().toLocaleDateString();
now = now.split('/').join('.');
let finalSum = 0;


const getPurchases = async () => {
  const resp = await fetch(`${link}/allPurchases`, {
    method: 'GET'
  });
  let result = await resp.json();
  allPurchases = result.data;
  render();

}

window.onload = async function init() {
  inputText = document.getElementById('add');
  inputTextSum = document.getElementById('add-sum');
  inputText.addEventListener('change', updateValue);
  inputTextSum.addEventListener('change', updateValueSum);

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
        if(resp.status !== 500){
        allPurchases.push(resp);
        valueInput = '';
        valueInputSum = '';
        inputText.value = '';
        inputTextSum.value = '';
        render();}else{alert("Операция не может быть выполненна")}
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

  finalSum = allPurchases.reduce((sum, item) => {
    return sum + item.sum;
  }, 0);

  allPurchases
    .map((item, index) => {
      
      const container = document.createElement('div');
      container.className = 'purchases-container';
      const numberPosition = document.createElement("p");
      numberPosition.innerText = index + 1 + ') ';
      container.appendChild(numberPosition);
      const conteinerBox = document.createElement('div');
      conteinerBox.className = 'box-content';
      const conteinerImg = document.createElement('div');
      conteinerImg.className = 'box-img';

      if (item._id === activeEditCard) {

        const inputPurchases = document.createElement('input');
        inputPurchases.className = 'add';
        const inputPurchasesSum = document.createElement('input');
        inputPurchasesSum.className = 'add-sum';
        inputPurchases.type = 'text';
        inputPurchasesSum.type = 'number';
        inputPurchases.value = item.purchases;
        inputPurchasesSum.value = item.sum;
        inputPurchases.addEventListener('change', setActivePurchases);
        inputPurchasesSum.addEventListener('change', setActiveSum);
        container.appendChild(inputPurchases);
        container.appendChild(inputPurchasesSum);
        const imageDone = document.createElement('img');
        imageDone.src = 'images/gal.svg';
        imageDone.onclick = function () {
          updateShopingList(item._id, item.purchases, item.sum);
          doneEditPurchases();
        };
        container.appendChild(imageDone);
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
      imageDelete.onclick = () => onDelete(item._id, allPurchases.length);
      conteinerImg.appendChild(imageDelete);
      conteinerBox.appendChild(conteinerImg)
      content.appendChild(container);
    });

    document.getElementById("demo").innerHTML = finalSum;
}

const onDelete = async (id, length) => {
  const resp = await fetch(`${link}/deletePurchases?id=${id}`, {
    method: 'DELETE',
  });

  if (resp.status === 200) {
    allPurchases = allPurchases.filter(purchases => purchases._id !== id);
    render();
  } else {
    alert('Операция не может быть выполнена')
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

  if (resp.status === 200) {
    allPurchases = allPurchases.map(item => {
      const newTask = {...item};
      if (item._id === _id) {
        newTask.purchases = updateActivDirection ? updateActivDirection : text;
        newTask.sum = Number(updateActiveSum ? updateActiveSum : price);
      }
      return newTask
    })
    render();
  }else{
    alert('Операция не может быть выполнена')
  }
}

const doneEditPurchases = () => {
  activeEditCard = null;
  activDirection = null;
  activeSum = null;
  render();
}