export function NotFoundPage(onGoHome) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "min-h-screen flex items-center justify-center bg-gray-50";

  wrapper.innerHTML = `
        <div class="text-center p-8 bg-white rounded-2xl shadow-md max-w-md w-full">
            <h1 class="text-6xl font-extrabold text-gray-800 mb-4">Oops!</h1>
            
            <h2 class="text-2xl font-bold text-gray-700 mb-2">
                Página não encontrada
            </h2>
            
            <p class="text-gray-500 mb-6">
                A página que você está procurando não existe ou foi removida.
            </p>

            <button 
                id="goHomeBtn"
                class="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
                Voltar à página principal
            </button>
        </div>
    `;

  wrapper.querySelector("#goHomeBtn").addEventListener("click", onGoHome);

  return wrapper;
}
