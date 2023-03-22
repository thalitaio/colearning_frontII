//Manipulação de elementos com JS

const DATA = [];
const [tituloInput, urlInput, submitInput] = document.querySelectorAll("input");
const descricaoInput = document.querySelector("textarea");
const headerContainerCards = document.getElementById("headerContainerCards");
const formElement = document.getElementById("cadastro");
const containerCards = document.getElementById("containerCards");
const errorElement = document.getElementById("error");

//Criação do Card

const createCard = (container, data) => {
  container.innerHTML = "";
  //fazendo uso de nodes
  // criação do card usando o método .map(), utilizado em arrays para criar um novo array a partir do original

  data.map((element, index) => {
    container.innerHTML += `
            <div class="card" id="${index}">
                <div class="cardHeader"
                    style="background: url('${element.url}');
                    background-size: cover;
                    background-position: center;
                ">
                    <div class="close-box" onclick="removeSavedCards(this)">
                        <span class="material-symbols-outlined">
                        disabled_by_default
                        </span>
                    </div>
                </div>
                    <div class="cardBody">
                        <span class="title">
                            ${element.title}
                        </span>
                        <p>
                            ${element.description}
                        </p>
                    </div>
            </div>
    `;
  });
};

//essa função é refente à mensagem de erro do span

const showError = (error = "") => {
  errorElement.style.display = "block";
  errorElement.innerText = error;

  setTimeout(() => {
    errorElement.innerText = "";
    errorElement.style.display = "none";
  }, 1000);
};

//guargando o card

const storageCard = (titulo, url, descricao) => {
  return {
    title: titulo,
    url: url,
    description: descricao,
  };
};

const toLocalStorage = () => {
  let objetString = JSON.stringify(
    storageCard(tituloInput.value, urlInput.value, descricaoInput.value)
  );
  localStorage.setItem(tituloInput.value, objetString);
};

const getLocalStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    try {
      const object = JSON.parse(value);
      DATA.push(object);
      DATA.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title == b.title) {
          return 0;
        } else {
          return 1;
        }
      });

      createCard(containerCards, DATA);
    } catch (e) {
      console.error(e);
    }
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  DATA.push(
    storageCard(tituloInput.value, urlInput.value, descricaoInput.value)
  );
  createCard(containerCards, DATA);
  DATA.sort((a, b) => {
    if (a.title < b.title) return -1;
    else if (a.title == b.title) return 0;
    else return 1;
  });

  toLocalStorage();
  formElement.reset();

  headerContainerCards.style.display = "flex";
};

const removeSavedCards = (e) => {
  let item = e.parentNode.parentNode.querySelector(".title").innerHTML.trim();
  localStorage.removeItem(`${item}`);
  window.location.reload();
};

descricaoInput.addEventListener("click", () => {
  if (tituloInput.value.length < 4) {
    showError("O titulo não pode ser menor que 4 caracteres");
  } else if (!/(?=.)png|jpeg|jpg|gif/.test(urlInput.value)) {
    showError(
      "A url deve ser um link terminado em formato de imagem (.png | .jpeg | .gif)"
    );
  } else if (descricaoInput.value < 4) {
    showError("A descrição não pode ser menor que 4 caracteres");
  } else {
    submitInput.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getLocalStorage();
  if (DATA == 0) {
    headerContainerCards.style.display = "none";
  } else {
    headerContainerCards.style.display = "block";
  }

  formElement.addEventListener("submit", handleSubmit);
});
