/// ======================================================
//  AgroNexo
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

// ========================================
// MENU LATERAL
// ========================================

function abrirMenu() {

    const menu = document.getElementById("menuLateral");
    const fundo = document.getElementById("fundoMenu");

    if (!menu || !fundo) {
        console.log("Menu não encontrado");
        return;
    }

    menu.classList.add("aberto");
    fundo.classList.add("aberto");
}


function fecharMenu() {

    const menu = document.getElementById("menuLateral");
    const fundo = document.getElementById("fundoMenu");

    if (!menu || !fundo) {
        return;
    }

    menu.classList.remove("aberto");
    fundo.classList.remove("aberto");
}


// ========================================
// NAVEGAÇÃO DO MENU
// ========================================

function irPara(pagina) {

    window.location.href = pagina;

}


// ========================================
// BOTÃO SAIR
// ========================================

function sair() {

    // Se você ainda não tem login,
    // volta para a página inicial.

    window.location.href = "index.html";

}
// ======================================================
// COMPRA DE GADO
// ======================================================


function pegarCompras() {

    return pegarDados("compras");

}


// ======================================================
// FORMULÁRIO DE COMPRA
// ======================================================

const formCompra =
    document.getElementById("formCompra");


if (formCompra) {


    const dataCompra =
        document.getElementById("dataCompra");


    // Coloca a data atual automaticamente

    if (dataCompra && !dataCompra.value) {

        const hoje =
            new Date();

        const ano =
            hoje.getFullYear();

        const mes =
            String(
                hoje.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                hoje.getDate()
            ).padStart(2, "0");

        dataCompra.value =
            `${ano}-${mes}-${dia}`;

    }


    formCompra.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const tipo =
                document
                .getElementById("tipoGado")
                .value;


            const quantidade =
                Number(
                    document
                    .getElementById(
                        "quantidadeGado"
                    )
                    .value
                );


            const pesoInicial =
                Number(
                    document
                    .getElementById(
                        "pesoInicial"
                    )
                    .value
                );


            const precoCompraKg =
                Number(
                    document
                    .getElementById(
                        "precoCompraKg"
                    )
                    .value
                );


            const data =
                document
                .getElementById(
                    "dataCompra"
                )
                .value;


            const racaoDia =
                Number(
                    document
                    .getElementById(
                        "racaoDia"
                    )
                    .value
                );


            const precoRacao =
                Number(
                    document
                    .getElementById(
                        "precoRacao"
                    )
                    .value
                );


            const diasEngorda =
                Number(
                    document
                    .getElementById(
                        "diasEngorda"
                    )
                    .value
                );


            const medicamentos =
                Number(
                    document
                    .getElementById(
                        "medicamentos"
                    )
                    .value
                ) || 0;


            const transporte =
                Number(
                    document
                    .getElementById(
                        "transporte"
                    )
                    .value
                ) || 0;


            const outrosGastos =
                Number(
                    document
                    .getElementById(
                        "outrosGastos"
                    )
                    .value
                ) || 0;


            const pesoVenda =
                Number(
                    document
                    .getElementById(
                        "pesoVenda"
                    )
                    .value
                );


            const precoVendaKg =
                Number(
                    document
                    .getElementById(
                        "precoVendaKg"
                    )
                    .value
                );


            // ==================================================
            // VALIDAÇÕES
            // ==================================================

            if (
                quantidade <= 0 ||
                pesoInicial <= 0 ||
                precoCompraKg < 0 ||
                racaoDia < 0 ||
                precoRacao < 0 ||
                diasEngorda < 0 ||
                pesoVenda <= 0 ||
                precoVendaKg < 0
            ) {

                alert(
                    "⚠️ Verifique os valores informados."
                );

                return;

            }


            // ==================================================
            // CÁLCULOS
            // ==================================================

            const pesoTotalInicial =
                quantidade *
                pesoInicial;


            const valorCompra =
                pesoTotalInicial *
                precoCompraKg;


            const racaoTotalAnimal =
                racaoDia *
                diasEngorda;


            const racaoTotalLote =
                racaoTotalAnimal *
                quantidade;


            const custoRacao =
                racaoTotalLote *
                precoRacao;


            const outrosCustos =
                medicamentos +
                transporte +
                outrosGastos;


            const investimentoTotal =
                valorCompra +
                custoRacao +
                outrosCustos;


            const pesoTotalVenda =
                quantidade *
                pesoVenda;


            const receitaVenda =
                pesoTotalVenda *
                precoVendaKg;


            const lucroPrejuizo =
                receitaVenda -
                investimentoTotal;


            let margem = 0;


            if (investimentoTotal > 0) {

                margem =
                    (
                        lucroPrejuizo /
                        investimentoTotal
                    ) * 100;

            }


            const custoPorAnimal =
                investimentoTotal /
                quantidade;


            const receitaPorAnimal =
                receitaVenda /
                quantidade;


            const compra = {

                id:
                    Date.now().toString(),

                tipo:
                    tipo,

                quantidade:
                    quantidade,

                pesoInicial:
                    pesoInicial,

                precoCompraKg:
                    precoCompraKg,

                data:
                    data,

                racaoDia:
                    racaoDia,

                precoRacao:
                    precoRacao,

                diasEngorda:
                    diasEngorda,

                racaoTotalLote:
                    racaoTotalLote,

                custoRacao:
                    custoRacao,

                medicamentos:
                    medicamentos,

                transporte:
                    transporte,

                outrosGastos:
                    outrosGastos,

                pesoVenda:
                    pesoVenda,

                precoVendaKg:
                    precoVendaKg,

                pesoTotalInicial:
                    pesoTotalInicial,

                valorCompra:
                    valorCompra,

                outrosCustos:
                    outrosCustos,

                investimentoTotal:
                    investimentoTotal,

                pesoTotalVenda:
                    pesoTotalVenda,

                receitaVenda:
                    receitaVenda,

                lucroPrejuizo:
                    lucroPrejuizo,

                margem:
                    margem,

                custoPorAnimal:
                    custoPorAnimal,

                receitaPorAnimal:
                    receitaPorAnimal

            };


            const compras =
                pegarCompras();


            compras.push(
                compra
            );


            salvarDados(
                "compras",
                compras
            );


            mostrarResultadoCompra(
                compra
            );


            mostrarCompras();


            alert(
                "✅ Compra registrada com sucesso!"
            );


            formCompra.reset();


            if (dataCompra) {

                const hoje =
                    new Date();

                const ano =
                    hoje.getFullYear();

                const mes =
                    String(
                        hoje.getMonth() + 1
                    ).padStart(2, "0");

                const dia =
                    String(
                        hoje.getDate()
                    ).padStart(2, "0");

                dataCompra.value =
                    `${ano}-${mes}-${dia}`;

            }

        }
    );

}


// ======================================================
// MOSTRAR RESULTADO
// ======================================================

function mostrarResultadoCompra(compra) {

    const resultado =
        document.getElementById(
            "resultadoCompra"
        );


    if (!resultado) {

        return;

    }


    const positivo =
        compra.lucroPrejuizo >= 0;


    const classeResultado =
        positivo
        ? "resultado-lucro"
        : "resultado-prejuizo";


    const textoResultado =
        positivo
        ? "LUCRO ESTIMADO"
        : "PREJUÍZO ESTIMADO";


    resultado.innerHTML = `

        <div class="resultado-cabecalho">

            <h2>
                📊 Resultado da compra
            </h2>

        </div>


        <div class="resultado-status ${classeResultado}">

            <span>
                ${positivo ? "🟢" : "🔴"}
            </span>

            <div>

                <strong>
                    ${textoResultado}
                </strong>

                <h2>
                    ${formatarMoeda(
                        compra.lucroPrejuizo
                    )}
                </h2>

                <p>
                    Margem estimada:
                    ${compra.margem.toFixed(2)}%
                </p>

            </div>

        </div>


        <div class="resultado-grid">


            <div class="resultado-card">

                <span>
                    🐂 Animais
                </span>

                <strong>
                    ${compra.quantidade}
                </strong>

            </div>


            <div class="resultado-card">

                <span>
                    ⚖️ Peso inicial
                </span>

                <strong>
                    ${compra.pesoTotalInicial.toFixed(2)} kg
                </strong>

            </div>


            <div class="resultado-card">

                <span>
                    💰 Compra
                </span>

                <strong>
                    ${formatarMoeda(
                        compra.valorCompra
                    )}
                </strong>

            </div>


            <div class="resultado-card">

                <span>
                    🌾 Ração
                </span>

                <strong>
                    ${compra.racaoTotalLote.toFixed(2)} kg
                </strong>

            </div>


            <div class="resultado-card">

                <span>
                    💵 Custo da ração
                </span>

                <strong>
                    ${formatarMoeda(
                        compra.custoRacao
                    )}
                </strong>

            </div>


            <div class="resultado-card">

                <span>
                    📦 Investimento total
                </span>

                <strong>
                    ${formatarMoeda(
                        compra.investimentoTotal
                    )}
                </strong>

            </div>


            <div class="resultado-card">

                <span>
                    ⚖️ Peso para venda
                </span>

                <strong>
                    ${compra.pesoTotalVenda.toFixed(2)} kg
                </strong>

            </div>


            <div class="resultado-card">

                <span>
                    💰 Receita estimada
                </span>

                <strong>
                    ${formatarMoeda(
                        compra.receitaVenda
                    )}
                </strong>

            </div>


        </div>


        <div class="detalhes-custos">

            <h3>
                💸 Detalhamento dos gastos
            </h3>


            <p>
                Compra dos animais:
                <strong>
                    ${formatarMoeda(
                        compra.valorCompra
                    )}
                </strong>
            </p>


            <p>
                Ração:
                <strong>
                    ${formatarMoeda(
                        compra.custoRacao
                    )}
                </strong>
            </p>


            <p>
                Medicamentos/vacinas:
                <strong>
                    ${formatarMoeda(
                        compra.medicamentos
                    )}
                </strong>
            </p>


            <p>
                Transporte:
                <strong>
                    ${formatarMoeda(
                        compra.transporte
                    )}
                </strong>
            </p>


            <p>
                Outros gastos:
                <strong>
                    ${formatarMoeda(
                        compra.outrosGastos
                    )}
                </strong>
            </p>


            <hr>


            <p class="total-destaque">

                Investimento total:

                <strong>
                    ${formatarMoeda(
                        compra.investimentoTotal
                    )}
                </strong>

            </p>


        </div>

    `;

}


// ======================================================
// HISTÓRICO DE COMPRAS
// ======================================================

function mostrarCompras() {

    const lista =
        document.getElementById(
            "listaCompras"
        );


    if (!lista) {

        return;

    }


    const compras =
        pegarCompras();


    lista.innerHTML = "";


    if (compras.length === 0) {

        lista.innerHTML = `

            <div class="card">

                <h2>
                    🛒 Nenhuma compra registrada
                </h2>

                <p>
                    Cadastre sua primeira compra de gado.
                </p>

            </div>

        `;

        return;

    }


    compras
        .slice()
        .reverse()
        .forEach(
            function(compra) {


                const positivo =
                    compra.lucroPrejuizo >= 0;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "compra-historico-card";


                card.innerHTML = `

                    <div class="compra-historico-topo">

                        <div>

                            <h3>
                                🐂 ${compra.tipo}
                            </h3>

                            <p>
                                ${compra.quantidade}
                                animal(is)
                            </p>

                        </div>


                        <span
                            class="${
                                positivo
                                ? "tag-lucro"
                                : "tag-prejuizo"
                            }"
                        >

                            ${
                                positivo
                                ? "🟢 Lucro"
                                : "🔴 Prejuízo"
                            }

                        </span>

                    </div>


                    <div class="compra-historico-dados">

                        <p>

                            <strong>
                                Compra:
                            </strong>

                            ${formatarMoeda(
                                compra.valorCompra
                            )}

                        </p>


                        <p>

                            <strong>
                                Investimento:
                            </strong>

                            ${formatarMoeda(
                                compra.investimentoTotal
                            )}

                        </p>


                        <p>

                            <strong>
                                Receita:
                            </strong>

                            ${formatarMoeda(
                                compra.receitaVenda
                            )}

                        </p>


                        <p>

                            <strong>
                                Resultado:
                            </strong>

                            ${formatarMoeda(
                                compra.lucroPrejuizo
                            )}

                        </p>

                    </div>


                    <div class="compra-acoes">

                        <button
                            onclick="verRelatorioCompra('${compra.id}')"
                        >
                            📊 Ver relatório
                        </button>


                        <button
                            class="botao-perigo"
                            onclick="excluirCompra('${compra.id}')"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                `;


                lista.appendChild(
                    card
                );

            }
        );

}


// ======================================================
// VER RELATÓRIO
// ======================================================

function verRelatorioCompra(id) {

    const compras =
        pegarCompras();


    const compra =
        compras.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!compra) {

        alert(
            "Compra não encontrada."
        );

        return;

    }


    mostrarResultadoCompra(
        compra
    );


    const resultado =
        document.getElementById(
            "resultadoCompra"
        );


    if (resultado) {

        resultado.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// EXCLUIR COMPRA
// ======================================================

function excluirCompra(id) {

    const confirmar =
        confirm(
            "⚠️ Deseja realmente excluir esta compra?"
        );


    if (!confirmar) {

        return;

    }


    const compras =
        pegarCompras();


    const novasCompras =
        compras.filter(
            function(compra) {

                return compra.id !== id;

            }
        );


    salvarDados(
        "compras",
        novasCompras
    );


    mostrarCompras();


    const resultado =
        document.getElementById(
            "resultadoCompra"
        );


    if (resultado) {

        resultado.innerHTML = "";

    }


    alert(
        "🗑️ Compra excluída."
    );

}


// ======================================================
// FORMATAÇÃO DE DINHEIRO
// ======================================================

function formatarMoeda(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ======================================================
// INICIALIZAR HISTÓRICO
// ======================================================

mostrarCompras();