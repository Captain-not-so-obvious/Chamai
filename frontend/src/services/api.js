const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Função centralizada para fazer chamadas à API usando fetch.
 * Ela automaticamente adiciona a URL base, credenciais, e trata a resposta como JSON.
 * @param {string} endpoint - O caminho da API (ex: '/chamados').
 * @param {object} options - As opções do fetch (method, headers, body, etc.).
 * @returns {Promise<any>} - Os dados da resposta em formato JSON.
 */
const apiFetch = async (endpoint, options = {}) => {
  // Monta a URL completa
  const url = `${API_BASE_URL}${endpoint}`;

  // Configurações padrão para todas as requisições
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  if (defaultOptions.body && typeof defaultOptions.body === 'object') {
    defaultOptions.body = JSON.stringify(defaultOptions.body);
  }

  try {
    const response = await fetch(url, defaultOptions);

    // Se a resposta não for bem-sucedida (ex: 404, 500), lança um erro
    if (!response.ok) {
      // Tenta extrair a mensagem de erro do corpo da resposta
      const errorData = await response.json().catch(() => ({
        message: `Erro HTTP: ${response.status} ${response.statusText}`
      }));
      // Lança um erro com a mensagem da API ou um fallback
      throw new Error(errorData.message || errorData.erro || `Erro HTTP: ${response.status}`);
    }

    // Retorna a resposta como JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return; // Retorna undefined se não houver corpo JSON

  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error.message);
    throw error; // Propaga o erro para ser tratado no componente que fez a chamada
  }
};

export default apiFetch;