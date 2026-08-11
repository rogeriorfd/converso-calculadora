// URL da API pública de economia
const API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';

// Função assíncrona responsável por buscar a cotação e fazer o cálculo
const convertCurrency = async () => {
    const amountInput = document.querySelector("#amount");
    const resultText = document.querySelector("#result-text");
    
    const brlValue = parseFloat(amountInput.value);

    // Validação moderna de input
    if (!brlValue || brlValue <= 0) {
        resultText.textContent = "Por favor, insira um valor válido maior que zero.";
        return;
    }

    try {
        resultText.textContent = "Buscando cotação atualizada...";

        const response = await fetch(API_URL);
        
        // Verifica se a requisição falhou (ex: erro 404 ou 500)
        if (!response.ok) throw new Error("Falha ao conectar com o servidor da API.");

        const data = await response.json();
        
        // Desestruturação de objeto (Destructuring) para pegar a cotação diretamente
        const { bid: dollarQuote } = data.USDBRL;
        
        // Cálculo matemático com conversão explícita para número
        const calculatedValue = brlValue / parseFloat(dollarQuote);

        // API Nativa do JavaScript para formatar moedas sem gambiarras
        const formattedUSD = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(calculatedValue);

        // Template Literals (Uso de crases e ${} ao invés de concatenação com +)
        resultText.textContent = `Resultado: ${formattedUSD}`;

    } catch (error) {
        // Tratamento de erros limpo para o usuário
        console.error(error);
        resultText.textContent = "Erro ao buscar cotação. Tente novamente mais tarde.";
    }
};

// Escutador de eventos moderno utilizando Arrow Function
document.querySelector("#convert-btn").addEventListener("click", convertCurrency);

// Adicione isso na última linha do seu app.js atual
const display = document.querySelector("#calc-display");
const calcContainer = document.querySelector(".calc-buttons");

calcContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName !== "BUTTON") return;

    const value = target.textContent;

    if (target.classList.contains("btn-num") || target.classList.contains("btn-op")) {
        display.value += value;
    } else if (target.classList.contains("btn-clear")) {
        display.value = "";
    } else if (target.id === "btn-equal") {
        try {
            const result = new Function(`return ${display.value}`)();
            display.value = result !== undefined ? result : "";
        } catch {
            display.value = "Erro";
            setTimeout(() => display.value = "", 1500);
        }
    }
});

