import { RenderView } from "../vanilla-core/vanilla-render.js";
import { fetchProfile } from "./profile-network.js";
import { LoadingState, PaymentMethodItem, ProfileHeader, ProfileMain, ProfileNotFound, SaveButtonDefault, SaveButtonSuccess } from "./profile-viewgen.js";
import { createProfileViewModel } from "./profile-viewmodel.js";

const $ = (id) => document.getElementById(id);

export async function loadProfileByURL() {
    try {
        const loadingDiv = LoadingState();
        RenderView(loadingDiv);

        const response = await fetchProfile();

        loadingDiv.classList.add("hidden");

        renderSuccessState(response.data);
    } catch (error) {
        renderErrorState(error);
    }
}

function renderErrorState(error) {
    if (error.status === 404) {
        RenderView(ProfileNotFound());
    } else {
        console.error(error);
        alert("Erro genérico ao carregar o perfil da empresa.");
    }
}

function renderSuccessState(profileData) {
    const profileUi = setupProfileModule(profileData);

    RenderView(
        profileUi.headerWidget,
        profileUi.mainWidget
    );
}

export function setupProfileModule(profileData) {
    profileData = profileData || {};

    const viewModel = createProfileViewModel(profileData);
    const events = setupProfileEvents(profileData);

    const headerWidget = ProfileHeader(viewModel, events);
    const mainWidget = ProfileMain(viewModel, events);

    return { headerWidget, mainWidget };
}

const setupProfileEvents = (profileData) => {
    // Arrays declarados fora do closure de clique para evitar recriação constante em memória
    const activeClasses = ['bg-blue-50', 'text-blue-700', 'border-blue-200', 'ring-1', 'ring-blue-100'];
    const inactiveClasses = ['bg-white', 'text-gray-500', 'border-gray-100', 'hover:border-gray-200', 'hover:bg-gray-50', 'hover:text-gray-800'];

    return {
        onTabClick: (e, tabId) => {
            e.preventDefault();
            const currentLink = e.currentTarget;

            // Previne execução extra se já estiver na tab activa
            if (currentLink.classList.contains('bg-blue-50')) return;

            // 1. Ocultar apenas o painel actualmente activo (O(1) vs O(N))
            const activePanel = document.querySelector('.profile-tab-panel.block');
            if (activePanel) {
                activePanel.classList.remove('block');
                activePanel.classList.add('hidden');
            }

            // 2. Restaurar o aspecto inativo apenas no link que estava activo (O(1) vs O(N))
            const activeLink = document.querySelector('.profile-nav-link.bg-blue-50');
            if (activeLink) {
                for (let i = 0; i < activeClasses.length; i++) {
                    activeLink.classList.remove(activeClasses[i]);
                }
                for (let i = 0; i < inactiveClasses.length; i++) {
                    activeLink.classList.add(inactiveClasses[i]);
                }
            }

            // 3. Mostrar o novo painel
            const targetPanel = $(`tab-${tabId}`);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
                targetPanel.classList.add('block');
            }

            // 4. Aplicar o estado activo ao novo link clicado (Loops directos evitam Spread Operator)
            for (let i = 0; i < inactiveClasses.length; i++) {
                currentLink.classList.remove(inactiveClasses[i]);
            }
            for (let i = 0; i < activeClasses.length; i++) {
                currentLink.classList.add(activeClasses[i]);
            }
        },

        onLogoUpload: (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    const preview = $('logoPreview');
                    const icon = $('logoUploadIcon');

                    if (preview && icon) {
                        preview.style.backgroundImage = `url(${imageUrl})`;
                        icon.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        },

        onAddPaymentMethod: () => {
            const container = $('paymentMethodsContainer');
            if (container) {
                const itemEvents = {
                    onRemovePaymentMethod: (e) => {
                        const itemToRemove = e.currentTarget.closest('.payment-method-item');
                        if (itemToRemove) {
                            itemToRemove.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
                            itemToRemove.style.opacity = '0';
                            itemToRemove.style.transform = 'translateY(-5px)';
                            setTimeout(() => itemToRemove.remove(), 200);
                        }
                    }
                };

                container.appendChild(PaymentMethodItem(itemEvents));
            }
        },

        onTriggerSave: () => {
            const form = $('profileForm');

            if (form && form.reportValidity()) {
                form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
            }
        },

        onSave: (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = {};
            const paymentTitles = [];
            const paymentDetails = [];

            // Loop for...of nativo é mais performático do que callbacks .forEach()
            for (const [key, value] of formData.entries()) {
                if (key === 'paymentMethodTitle[]') {
                    paymentTitles.push(value);
                } else if (key === 'paymentMethodDetails[]') {
                    paymentDetails.push(value);
                } else {
                    data[key] = value;
                }
            }

            // Alocação linear direta mais rápida que .map()
            const methodsLength = paymentTitles.length;
            data.paymentMethods = new Array(methodsLength);
            
            for (let i = 0; i < methodsLength; i++) {
                data.paymentMethods[i] = {
                    title: paymentTitles[i],
                    details: paymentDetails[i]
                };
            }

            console.log('Dados guardados cruamente:', data);

            // Abstração de alteração visual para garantir escalabilidade
            const setButtonState = (btn, isSuccess) => {
                if (!btn) return;
                
                btn.textContent = '';
                btn.Append(isSuccess ? SaveButtonSuccess() : SaveButtonDefault());

                if (isSuccess) {
                    btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                    btn.classList.add('bg-green-600', 'hover:bg-green-700');
                } else {
                    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                }
            };

            const saveBtnTop = $('saveProfileButton');
            const saveBtnFab = $('saveProfileFAB');

            setButtonState(saveBtnTop, true);
            setButtonState(saveBtnFab, true);

            setTimeout(() => {
                setButtonState(saveBtnTop, false);
                setButtonState(saveBtnFab, false);
            }, 2000);
        }
    };
};