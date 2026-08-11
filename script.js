/// ======================================================
// FAZENDA CONTROL
// SCRIPT PRINCIPAL
// ======================================================


// ======================================================
// FUNÇÕES DE BANCO DE DADOS
// ======================================================

function pegarDados(chave) {

    try {

        return JSON.parse(
            localStorage.getItem(chave)
        ) || [];

    } catch (erro) {

        console.error(erro);

        return [];

    }

}


function salvarDados(chave, dados) {

    localStorage.setItem(
        chave,
        JSON.stringify(dados)
    );

}


// ======================================================
// NAVEGAÇÃO
// ======================================================

function abrirGado() {

    window.location.href = "gado.html";

}


function abrirPastos() {

    window.location.href = "pastos.html";

}


function abrirManejo() {

    window.location.href = "manejo.html";

}


function voltarInicio() {

    window.location.href = "index.html";

}


function voltarGado() {

    window.location.href = "gado.html";

}


function cadastrarAnimal() {

    localStorage.removeItem(
        "animalEditando"
    );

    window.location.href =
        "cadastro.html";

}


// ======================================================
// LOGIN
// ======================================================

const formLogin =
    document.getElementById("formLogin");


if (formLogin) {

    formLogin.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const usuario =
                document
                .getElementById("usuario")
                .value
                .trim();


            const senha =
                document
                .getElementById("senha")
                .value;


            if (
                usuario === "admin" &&
                senha === "1234"
            ) {

                localStorage.setItem(
                    "usuarioLogado",
                    "true"
                );


                window.location.href =
                    "index.html";

            }

            else {

                alert(
                    "❌ Usuário ou senha incorretos."
                );

            }

        }
    );

}


function sair() {

    const confirmar =
        confirm(
            "Deseja sair do sistema?"
        );


    if (!confirmar) {

        return;

    }


    localStorage.removeItem(
        "usuarioLogado"
    );


    window.location.href =
        "login.html";

}


// ======================================================
// PROTEÇÃO DAS PÁGINAS
// ======================================================

const pagina =
    window.location.pathname
    .split("/")
    .pop();


if (
    pagina !== "login.html" &&
    pagina !== ""
) {

    const logado =
        localStorage.getItem(
            "usuarioLogado"
        );


    if (logado !== "true") {

        window.location.href =
            "login.html";

    }

}


// ======================================================
// ANIMAIS
// ======================================================

function pegarAnimais() {

    return pegarDados("animais");

}


// ======================================================
// CADASTRO / EDIÇÃO DE ANIMAL
// ======================================================

const formAnimal =
    document.getElementById("formAnimal");


if (formAnimal) {

    const idEditando =
        localStorage.getItem(
            "animalEditando"
        );


    // SE ESTIVER EDITANDO, CARREGAR DADOS

    if (idEditando) {

        const animais =
            pegarAnimais();


        const animal =
            animais.find(
                function(item) {

                    return item.id === idEditando;

                }
            );


        if (animal) {

            document.getElementById("brinco").value =
                animal.brinco || "";

            document.getElementById("nome").value =
                animal.nome || "";

            document.getElementById("raca").value =
                animal.raca || "";

            document.getElementById("sexo").value =
                animal.sexo || "Macho";

            document.getElementById("peso").value =
                animal.peso || "";

            document.getElementById("pasto").value =
                animal.pasto || "";

            document.getElementById("observacoes").value =
                animal.observacoes || "";

        }

    }


    formAnimal.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const brinco =
                document
                .getElementById("brinco")
                .value
                .trim();


            const nome =
                document
                .getElementById("nome")
                .value
                .trim();


            const raca =
                document
                .getElementById("raca")
                .value
                .trim();


            const sexo =
                document
                .getElementById("sexo")
                .value;


            const peso =
                document
                .getElementById("peso")
                .value;


            const pasto =
                document
                .getElementById("pasto")
                .value
                .trim();


            const observacoes =
                document
                .getElementById("observacoes")
                .value
                .trim();


            const animais =
                pegarAnimais();


            // VERIFICAR BRINCO DUPLICADO

            const duplicado =
                animais.find(
                    function(item) {

                        return (
                            item.brinco === brinco &&
                            item.id !== idEditando
                        );

                    }
                );


            if (duplicado) {

                alert(
                    "⚠️ Já existe um animal com esse número de brinco."
                );

                return;

            }


            const animal = {

                id:
                    idEditando ||
                    Date.now().toString(),

                brinco: brinco,

                nome: nome,

                raca: raca,

                sexo: sexo,

                peso: peso,

                pasto: pasto,

                observacoes: observacoes

            };


            let novosAnimais;


            if (idEditando) {

                novosAnimais =
                    animais.map(
                        function(item) {

                            if (
                                item.id ===
                                idEditando
                            ) {

                                return animal;

                            }

                            return item;

                        }
                    );

            }

            else {

                novosAnimais = [
                    ...animais,
                    animal
                ];

            }


            salvarDados(
                "animais",
                novosAnimais
            );


            localStorage.removeItem(
                "animalEditando"
            );


            alert(
                idEditando
                ? "✅ Animal atualizado!"
                : "✅ Animal cadastrado!"
            );


            window.location.href =
                "gado.html";

        }
    );

}


// ======================================================
// LISTA DE ANIMAIS
// ======================================================

function mostrarAnimais() {

    const lista =
        document.getElementById(
            "listaAnimais"
        );


    if (!lista) {

        return;

    }


    const animais =
        pegarAnimais();


    const campoBusca =
        document.getElementById(
            "buscaAnimal"
        );


    const busca =
        campoBusca
        ? campoBusca.value
            .toLowerCase()
            .trim()
        : "";


    lista.innerHTML = "";


    const filtrados =
        animais.filter(
            function(animal) {

                return (

                    String(
                        animal.brinco
                    )
                    .toLowerCase()
                    .includes(busca)

                    ||

                    String(
                        animal.nome || ""
                    )
                    .toLowerCase()
                    .includes(busca)

                    ||

                    String(
                        animal.raca || ""
                    )
                    .toLowerCase()
                    .includes(busca)

                );

            }
        );


    if (filtrados.length === 0) {

        lista.innerHTML = `

            <div class="card">

                <h2>
                    🐂 Nenhum animal encontrado
                </h2>

                <p>
                    Cadastre um animal para começar.
                </p>

            </div>

        `;

        return;

    }


    filtrados.forEach(
        function(animal) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card animal-card";


            card.innerHTML = `

                <div class="animal-icone">
                    🐂
                </div>

                <h2>
                    #${animal.brinco}
                </h2>

                <p>
                    <strong>
                        ${animal.nome || "Sem nome"}
                    </strong>
                </p>

                <p>
                    Raça:
                    ${animal.raca || "Não informada"}
                </p>

                <p>
                    Sexo:
                    ${animal.sexo || "Não informado"}
                </p>

                <p>
                    Peso:
                    ${animal.peso || "Não informado"} kg
                </p>

                <p>
                    Pasto:
                    ${animal.pasto || "Não informado"}
                </p>

                <button
                    onclick="verAnimal('${animal.id}')"
                >
                    📋 Ver ficha
                </button>

            `;


            lista.appendChild(card);

        }
    );

}


const buscaAnimal =
    document.getElementById(
        "buscaAnimal"
    );


if (buscaAnimal) {

    buscaAnimal.addEventListener(
        "input",
        mostrarAnimais
    );

}


function verAnimal(id) {

    localStorage.setItem(
        "animalSelecionado",
        id
    );


    window.location.href =
        "animal.html";

}


// ======================================================
// FICHA DO ANIMAL
// ======================================================

function mostrarFichaAnimal() {

    const ficha =
        document.getElementById(
            "fichaAnimal"
        );


    if (!ficha) {

        return;

    }


    const id =
        localStorage.getItem(
            "animalSelecionado"
        );


    const animais =
        pegarAnimais();


    const animal =
        animais.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!animal) {

        ficha.innerHTML = `

            <h2>
                Animal não encontrado.
            </h2>

        `;

        return;

    }


    ficha.innerHTML = `

        <div class="animal-foto-grande">
            🐂
        </div>

        <h1>
            #${animal.brinco}
        </h1>

        <h2>
            ${animal.nome || "Sem nome"}
        </h2>

        <p>
            <strong>Raça:</strong>
            ${animal.raca || "Não informada"}
        </p>

        <p>
            <strong>Sexo:</strong>
            ${animal.sexo || "Não informado"}
        </p>

        <p>
            <strong>Peso:</strong>
            ${animal.peso || "Não informado"} kg
        </p>

        <p>
            <strong>Pasto:</strong>
            ${animal.pasto || "Não informado"}
        </p>

        <p>
            <strong>Observações:</strong>
            ${animal.observacoes || "Nenhuma"}
        </p>

    `;

}


function editarAnimal() {

    const id =
        localStorage.getItem(
            "animalSelecionado"
        );


    if (!id) {

        return;

    }


    localStorage.setItem(
        "animalEditando",
        id
    );


    window.location.href =
        "cadastro.html";

}


function excluirAnimal() {

    const id =
        localStorage.getItem(
            "animalSelecionado"
        );


    if (!id) {

        return;

    }


    const confirmar =
        confirm(
            "⚠️ Deseja realmente excluir este animal?"
        );


    if (!confirmar) {

        return;

    }


    const animais =
        pegarAnimais();


    const novosAnimais =
        animais.filter(
            function(item) {

                return item.id !== id;

            }
        );


    salvarDados(
        "animais",
        novosAnimais
    );


    localStorage.removeItem(
        "animalSelecionado"
    );


    alert(
        "🗑️ Animal excluído."
    );


    window.location.href =
        "gado.html";

}


// ======================================================
// PASTOS
// ======================================================

function pegarPastos() {

    return pegarDados("pastos");

}


const formPasto =
    document.getElementById(
        "formPasto"
    );


if (formPasto) {

    formPasto.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nome =
                document
                .getElementById(
                    "nomePasto"
                )
                .value
                .trim();


            const area =
                document
                .getElementById(
                    "areaPasto"
                )
                .value;


            const capacidade =
                document
                .getElementById(
                    "capacidadePasto"
                )
                .value;


            const observacoes =
                document
                .getElementById(
                    "observacoesPasto"
                )
                .value
                .trim();


            const pastos =
                pegarPastos();


            const pasto = {

                id:
                    Date.now().toString(),

                nome:
                    nome,

                area:
                    area,

                capacidade:
                    capacidade,

                observacoes:
                    observacoes

            };


            pastos.push(pasto);


            salvarDados(
                "pastos",
                pastos
            );


            formPasto.reset();


            alert(
                "🌱 Pasto cadastrado!"
            );


            mostrarPastos();

            atualizarDashboard();

        }
    );

}


function mostrarPastos() {

    const lista =
        document.getElementById(
            "listaPastos"
        );


    if (!lista) {

        return;

    }


    const pastos =
        pegarPastos();


    lista.innerHTML = "";


    if (pastos.length === 0) {

        lista.innerHTML = `

            <div class="card">

                <h2>
                    🌱 Nenhum pasto cadastrado
                </h2>

                <p>
                    Cadastre o primeiro pasto acima.
                </p>

            </div>

        `;

        return;

    }


    pastos.forEach(
        function(pasto) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <h2>
                    🌱 ${pasto.nome}
                </h2>

                <p>
                    <strong>Área:</strong>
                    ${pasto.area || 0} hectares
                </p>

                <p>
                    <strong>Capacidade:</strong>
                    ${pasto.capacidade || 0}
                    animais
                </p>

                <p>
                    <strong>Observações:</strong>
                    ${pasto.observacoes || "Nenhuma"}
                </p>

                <button
                    class="botao-perigo"
                    onclick="excluirPasto('${pasto.id}')"
                >
                    🗑️ Excluir
                </button>

            `;


            lista.appendChild(card);

        }
    );

}


function excluirPasto(id) {

    const confirmar =
        confirm(
            "Deseja excluir este pasto?"
        );


    if (!confirmar) {

        return;

    }


    const pastos =
        pegarPastos();


    const novosPastos =
        pastos.filter(
            function(pasto) {

                return pasto.id !== id;

            }
        );


    salvarDados(
        "pastos",
        novosPastos
    );


    mostrarPastos();

    atualizarDashboard();


    alert(
        "🗑️ Pasto excluído."
    );

}


// ======================================================
// MANEJO
// ======================================================

function pegarManejos() {

    return pegarDados("manejos");

}


function carregarAnimaisNoManejo() {

    const select =
        document.getElementById(
            "animalManejo"
        );


    if (!select) {

        return;

    }


    const animais =
        pegarAnimais();


    select.innerHTML = `

        <option value="">
            Selecione um animal
        </option>

    `;


    animais.forEach(
        function(animal) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                animal.id;


            option.textContent =
                "#" +
                animal.brinco +
                " - " +
                (
                    animal.nome ||
                    "Sem nome"
                );


            select.appendChild(
                option
            );

        }
    );


    if (animais.length === 0) {

        select.innerHTML = `

            <option value="">
                Nenhum animal cadastrado
            </option>

        `;

    }

}


const formManejo =
    document.getElementById(
        "formManejo"
    );


if (formManejo) {

    carregarAnimaisNoManejo();


    formManejo.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const tipo =
                document
                .getElementById(
                    "tipoManejo"
                )
                .value;


            const animalId =
                document
                .getElementById(
                    "animalManejo"
                )
                .value;


            const data =
                document
                .getElementById(
                    "dataManejo"
                )
                .value;


            const descricao =
                document
                .getElementById(
                    "descricaoManejo"
                )
                .value
                .trim();


            if (!animalId) {

                alert(
                    "⚠️ Selecione um animal."
                );

                return;

            }


            const manejos =
                pegarManejos();


            const manejo = {

                id:
                    Date.now().toString(),

                tipo:
                    tipo,

                animalId:
                    animalId,

                data:
                    data,

                descricao:
                    descricao

            };


            manejos.push(
                manejo
            );


            salvarDados(
                "manejos",
                manejos
            );


            formManejo.reset();


            alert(
                "💉 Manejo registrado!"
            );


            mostrarManejos();

            atualizarDashboard();

        }
    );

}


function mostrarManejos() {

    const lista =
        document.getElementById(
            "listaManejos"
        );


    if (!lista) {

        return;

    }


    const manejos =
        pegarManejos();


    const animais =
        pegarAnimais();


    lista.innerHTML = "";


    if (manejos.length === 0) {

        lista.innerHTML = `

            <div class="card">

                <h2>
                    📋 Nenhum manejo registrado
                </h2>

                <p>
                    Registre o primeiro manejo.
                </p>

            </div>

        `;

        return;

    }


    manejos
        .slice()
        .reverse()
        .forEach(
            function(manejo) {

                const animal =
                    animais.find(
                        function(item) {

                            return (
                                item.id ===
                                manejo.animalId
                            );

                        }
                    );


                const nomeAnimal =
                    animal

                    ? "#" +
                      animal.brinco +
                      " - " +
                      (
                          animal.nome ||
                          "Sem nome"
                      )

                    : "Animal removido";


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card";


                card.innerHTML = `

                    <h2>
                        ${iconeManejo(
                            manejo.tipo
                        )}

                        ${manejo.tipo}
                    </h2>

                    <p>
                        <strong>
                            Animal:
                        </strong>

                        ${nomeAnimal}
                    </p>

                    <p>
                        <strong>
                            Data:
                        </strong>

                        ${formatarData(
                            manejo.data
                        )}
                    </p>

                    <p>
                        <strong>
                            Descrição:
                        </strong>

                        ${
                            manejo.descricao ||
                            "Nenhuma"
                        }
                    </p>

                    <button
                        class="botao-perigo"
                        onclick="excluirManejo('${manejo.id}')"
                    >
                        🗑️ Excluir
                    </button>

                `;


                lista.appendChild(
                    card
                );

            }
        );

}


function iconeManejo(tipo) {

    switch (tipo) {

        case "Vacinação":
            return "💉";

        case "Vermifugação":
            return "💊";

        case "Pesagem":
            return "⚖️";

        case "Consulta veterinária":
            return "🩺";

        case "Medicação":
            return "💊";

        default:
            return "📋";

    }

}


function excluirManejo(id) {

    const confirmar =
        confirm(
            "Deseja excluir este manejo?"
        );


    if (!confirmar) {

        return;

    }


    const manejos =
        pegarManejos();


    const novosManejos =
        manejos.filter(
            function(manejo) {

                return manejo.id !== id;

            }
        );


    salvarDados(
        "manejos",
        novosManejos
    );


    mostrarManejos();

    atualizarDashboard();


    alert(
        "🗑️ Manejo excluído."
    );

}


// ======================================================
// DASHBOARD
// ======================================================

function atualizarDashboard() {

    const animais =
        pegarAnimais();


    const pastos =
        pegarPastos();


    const manejos =
        pegarManejos();


    const totalBovinos =
        document.getElementById(
            "totalBovinos"
        );


    const totalPastos =
        document.getElementById(
            "totalPastos"
        );


    const totalManejos =
        document.getElementById(
            "totalManejos"
        );


    if (totalBovinos) {

        totalBovinos.textContent =
            animais.length;

    }


    if (totalPastos) {

        totalPastos.textContent =
            pastos.length;

    }


    if (totalManejos) {

        totalManejos.textContent =
            manejos.length;

    }

}


// ======================================================
// UTILIDADES
// ======================================================

function formatarData(data) {

    if (!data) {

        return "Não informada";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

mostrarAnimais();

mostrarFichaAnimal();

mostrarPastos();

mostrarManejos();

atualizarDashboard();