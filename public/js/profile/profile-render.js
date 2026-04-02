import { RenderView } from "../vanilla-core/vanilla-render.js";
import { fetchProfile } from "./profile-network.js"; 
import { LoadingState, PaymentMethodItem, ProfileHeader, ProfileMain, ProfileNotFound, SaveButtonDefault, SaveButtonSuccess } from "./profile-viewgen.js";
import { createProfileViewModel } from "./profile-viewmodel.js";

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
    return {
        onTabClick: (e, tabId) => {
            e.preventDefault();
            
            document.querySelectorAll('.profile-tab-panel').forEach(panel => {
                panel.classList.add('hidden');
                panel.classList.remove('block');
            });

            document.querySelectorAll('.profile-nav-link').forEach(link => {
                link.classList.remove('active');
            });

            const targetPanel = $(`tab-${tabId}`);
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
                targetPanel.classList.add('block');
            }

            e.currentTarget.classList.add('active');
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

        onSave: (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = {};
            const paymentTitles = [];
            const paymentDetails = [];

            formData.forEach((value, key) => {
                if (key === 'paymentMethodTitle[]') {
                    paymentTitles.push(value);
                } else if (key === 'paymentMethodDetails[]') {
                    paymentDetails.push(value);
                } else {
                    data[key] = value;
                }
            });

            data.paymentMethods = paymentTitles.map((title, index) => ({
                title: title,
                details: paymentDetails[index]
            }));

            // Raw Source of Truth
            console.log('Dados guardados cruamente:', data);

            // Atualização de UI via Viewgen puro
            const saveButton = $('saveProfileButton');
            
            saveButton.textContent = '';
            saveButton.appendChild(SaveButtonSuccess());
            
            saveButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            saveButton.classList.add('bg-green-600');

            setTimeout(() => {
                saveButton.textContent = '';
                saveButton.appendChild(SaveButtonDefault());

                saveButton.classList.remove('bg-green-600');
                saveButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }, 2000);
        }
    };
};