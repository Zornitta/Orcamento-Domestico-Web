import { getElement, formatCurrencyInput, fixCoin } from "./utils.js";

export const incomeInput = getElement('income');
export const housingInput = getElement('housing-cost');
export const energyInput = getElement('energy-cost');
export const waterInput = getElement('water-cost');
export const internetInput = getElement('internet-cost');
export const educationInput = getElement('education-cost');
export const healthInsuranceInput = getElement('health-insurance-cost');
export const gymMembershipInput = getElement('gym-membership-cost');
export const streamingInput = getElement('streaming-cost');
export const transportationInput = getElement('transportation-cost');
export const carInsuranceInput = getElement('car-insurance-cost');
export const groceriesInput = getElement('groceries-cost');
export const restaurantInput = getElement('restaurant-cost');
export const fuelInput = getElement('fuel-cost');
export const parkingInput = getElement('parking-cost');
export const vehicleMaintenanceInput = getElement('vehicle-maintenance-cost');
export const houseMaintenanceInput = getElement('house-maintenance-cost');
export const leisureInput = getElement('leisure-cost');
export const turismInput = getElement('turism-cost');
export const clothingInput = getElement('clothing-cost');
export const beautyInput = getElement('beauty-cost');
export const medicinesInput = getElement('medicines-cost');
export const hospitalInput = getElement('hospital-cost');

// Tabela de associação entre os inputs da tela e as propriedades do state
export const inputMap = [
    { input: incomeInput, key: 'income', label: 'Renda' },
    { input: housingInput, key: 'housing', label: 'Moradia' },
    { input: energyInput, key: 'energy', label: 'Energia' },
    { input: waterInput, key: 'water', label: 'Água' },
    { input: internetInput, key: 'internet', label: 'Internet' },
    { input: educationInput, key: 'education', label: 'Educação' },
    { input: healthInsuranceInput, key: 'healthInsurance', label: 'Seguro de Vida/Saúde' },
    { input: gymMembershipInput, key: 'gymMembership', label: 'Academia' },
    { input: streamingInput, key: 'streaming', label: 'Streamings' },
    { input: transportationInput, key: 'transportation', label: 'Transporte' },
    { input: carInsuranceInput, key: 'carInsurance', label: 'Seguro de Veículo' },
    { input: groceriesInput, key: 'groceries', label: 'Supermercado' },
    { input: restaurantInput, key: 'restaurant', label: 'Comer Fora' },
    { input: fuelInput, key: 'fuel', label: 'Combustível' },
    { input: parkingInput, key: 'parking', label: 'Estacionamento' },
    { input: vehicleMaintenanceInput, key: 'vehicleMaintenance', label: 'Manutenção de Veículo' },
    { input: houseMaintenanceInput, key: 'houseMaintenance', label: 'Manutenção da Moradia' },
    { input: leisureInput, key: 'leisure', label: 'Lazer' },
    { input: turismInput, key: 'turism', label: 'Turismo' },
    { input: clothingInput, key: 'clothing', label: 'Vestuário' },
    { input: beautyInput, key: 'beauty', label: 'Beleza' },
    { input: medicinesInput, key: 'medicines', label: 'Medicamentos' },
    { input: hospitalInput, key: 'hospital', label: 'Emergências' }
];

// Anexa os escutadores de evento nos inputs
export function setupInputListeners(state, onUpdate) {
    inputMap.forEach(({ input, key, label }) => {
        if (input) {
            formatCurrencyInput(input, (value) => {
                state[key] = value;
                onUpdate();
                console.log(`${label} atualizado:`, value);
            });
        }
    });
}
// Preenche os campos de texto com os valores já salvos no state
export function hydrateInputs(state) {
    inputMap.forEach(({ input, key }) => {
        if (input && state[key] > 0) {
            input.value = 'R$ ' + fixCoin(state[key]);
        }
    });
}