export const AssetTypes = Object.freeze({
    FIXED_INCOME: 'fixed_income',
    NATIONAL_SHARES: 'national_shares',
    INTERNATIONAL_SHARES: 'international_shares',
    REAL_ESTATE: 'real_estate',
    CRYPTOCURRENCIES: 'cryptocurrencies'
});

export class Asset {
    #name;
    #value;
    #type;

    constructor(name, value, type) {
        if (!Object.values(AssetTypes).includes(type)) {
            throw new Error(`Tipo de ativo inválido: "${type}"`);
        }

        this.#name = name;
        this.#value = value < 0 ? 0 : value;
        this.#type = type;
    }

    // Getters
    get name() { return this.#name; }
    get value() { return this.#value; }
    get type() { return this.#type; }

    // Setters
    set name(newName) {
        this.#name = newName;
    }

    set value(newValue) {
        this.#value = newValue < 0 ? 0 : newValue;
    }

    set type(newType) {
        if (!Object.values(AssetTypes).includes(newType)) {
            throw new Error(`Tipo de ativo inválido: "${newType}"`);
        }
        this.#type = newType;
    }

    toJSON() {
        return {
            name: this.#name,
            value: this.#value,
            type: this.#type
        };
    }
}