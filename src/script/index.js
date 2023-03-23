/*
  Cria um array de cards salvos
*/
let savedCards = [];

/*
  Pega os elementos da DOM
*/
const [
  titleInputElement, 
  urlInputElement, 
  submitInputElement
] = document.querySelectorAll("input");
const [
  titleErrorElement, 
  urlErrorElement, 
  descriptionErrorElement
] = document.querySelectorAll(".error");
const descriptionInputElement = document.querySelector("textarea");
const headerContainerElement = document.querySelector("#headerContainerCards h1");
const formElement = document.getElementById("cadastro");
const containerCardsElement = document.getElementById("containerCards");
const errorElement = document.getElementById("error");

/*
  Cria o elemento html do card
*/
const createCardElement = ({ id, url, title, description }) => {
  return (`
    <div class="card" id="${id}">
      <div 
        class="cardHeader"
        style="
          background: url('${url}');
          background-size: cover;
          background-position: center;
        "
      >
        <div class="close-box" onclick="removeCard('${id}')">
          <span class="material-symbols-outlined">
            disabled_by_default
          </span>
        </div>
      </div>
      <div class="cardBody">
        <span class="title"> ${title} </span>
        <p> ${description} </p>
      </div>
    </div>
  `);
};

/*
  Exibe a mensagem de erro
*/
const showError = (error = "", element) => {
  element.style.display = "block";
  element.innerText = error;
};

/*
  Esconde a mensagem de erro
*/
const hideError = (element) => {
  element.style.display = "none";
};

/*
  Salva os cards no localStorage
*/
const saveToLocalStorage = (card) => {
  // Adiciona o card no array de cards salvos
  savedCards.push(card);

  // Transforma o array de cards em JSON
  const jsonString = JSON.stringify(savedCards);
  
  // Salva o JSON no localStorage
  localStorage.setItem("savedCards", jsonString);
};

/*
  Carrega os cards salvos no localStorage
*/
const getFromLocalStorage = () => {
  // Pega os cards salvos no localStorage
  const jsonString = localStorage.getItem("savedCards");
  
  // Transforma o JSON em um array de objetos
  const cards = JSON.parse(jsonString);
  
  // Se não houver cards, retorna (fim da função)
  if (!cards) return;
  
  // Se houver cards, adiciona no array de cards salvos
  savedCards = cards;

  // Adiciona os cards na DOM
  savedCards.forEach(card => {
    const cardElement = createCardElement(card);
    containerCardsElement.innerHTML += cardElement;
  });
};

/*
  Adiciona o card na DOM e no localStorage
*/
const handleSubmit = (event) => {
  // Previne o comportamento padrão do submit
  event.preventDefault();

  const title = titleInputElement.value;
  const url = urlInputElement.value;
  const description = descriptionInputElement.value;
  
  // Cria um objeto com os dados do card
  const card = {
    // Cria um id "único" para o card
    id: url + title + description,
    title,
    url,
    description,
  };
  
  // Cria o elemento html do card
  const cardElement = createCardElement(card);

  // Adiciona o card na DOM
  containerCardsElement.innerHTML += cardElement;
  
  // Salva o card no localStorage
  saveToLocalStorage(card);
  
  // Limpa o formulário
  formElement.reset();
  
  // Exibe o título "Cards Salvos"
  headerContainerElement.innerText = "🔹 Cards Salvos";
};

/*
  Remove o card da DOM e do localStorage
*/
const removeCard = (id) => {
  // Pega o elemento do card
  let cardElement = document.getElementById(id);

  // Remove o card da DOM
  cardElement.remove();
  
  // Pega o index do card no array de cards salvos
  const indexToBeRemoved = savedCards.findIndex(
    (card) => card.id === id
  );
  
  // Remove o card do array de cards salvos
  savedCards.splice(indexToBeRemoved, 1);
  
  // Transforma o array de cards em JSON
  const jsonString = JSON.stringify(savedCards);
  
  // Salva o JSON no localStorage
  localStorage.setItem("savedCards", jsonString);

  // Se não houver mais cards, exibe o título "Nada por aqui..."
  if (savedCards.length === 0) {
    headerContainerElement.innerText = "🍃 Nada por aqui...";
  }
};

/*
  Chama a função de salvamento no evento de submit do formulário
*/
formElement.addEventListener("submit", handleSubmit);

/*
  Valida os campos do formulário
*/
const validateForm = () => {
  const isTitleValid = titleInputElement.value.length >= 4;
  const isTitleEmpty = titleInputElement.value.length === 0;
  
  const isUrlValid = /(?=.)png|jpeg|jpg|gif/.test(urlInputElement.value);
  const isUrlEmpty = urlInputElement.value.length === 0;
  
  const isDescriptionValid = descriptionInputElement.value.length >= 4;
  const isDescriptionEmpty = descriptionInputElement.value.length === 0;

  // Se o campo de título não estiver vazio, e for inválido, exibe a mensagem de erro
  if (!isTitleEmpty && titleInputElement.value.length < 4)
    showError(
      "O titulo não pode ser menor que 4 caracteres", 
      titleErrorElement
    );

  // Se o campo de url não estiver vazio, e for inválido, exibe a mensagem de erro
  if (!isUrlEmpty && !/(?=.)png|jpeg|jpg|gif/.test(urlInputElement.value))
    showError(
      "A url deve ser um link terminado em formato de imagem (.png | .jpeg | .gif)",
      urlErrorElement
    );

  // Se o campo de descrição não estiver vazio, e for inválido, exibe a mensagem de erro
  if (!isDescriptionEmpty && descriptionInputElement.value.length < 4)
    showError(
      "A descrição não pode ser menor que 4 caracteres", 
      descriptionErrorElement
    );

  // Remove as mensagens de erro dos campos válidos
  if (isTitleValid) hideError(titleErrorElement);
  if (isUrlValid) hideError(urlErrorElement);
  if (isDescriptionValid) hideError(descriptionErrorElement);

  // Se todos os campos forem válidos, habilita o botão de submit
  if (isTitleValid && isUrlValid && isDescriptionValid)
    submitInputElement.disabled = false;
  else 
    submitInputElement.disabled = true;
}

// Adiciona validação nos eventos de keyup dos inputs
titleInputElement.addEventListener("keyup", validateForm);
urlInputElement.addEventListener("keyup", validateForm);
descriptionInputElement.addEventListener("keyup", validateForm);

/*
  Carrega os cards salvos no localStorage ao carregar a página
*/
document.addEventListener("DOMContentLoaded", () => {
  getFromLocalStorage();
  
  // Se houver cards salvos, exibe a mensagem de "Cards Salvos"
  if (savedCards.length !== 0)
    headerContainerElement.innerHTML = "🔹 Cards Salvos";
});