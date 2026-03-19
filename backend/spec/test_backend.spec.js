import { validationResult } from 'express-validator';

// Import validazioni
import { validationSignup } from '../middleware/validation/validationAuth.js'; 
import { validationCreateProperties } from '../middleware/validation/validationProperties.js';

// Import controller
import { propertiesController } from '../controllers/propertiesController.js';

// Helper per eseguire i middleware di express-validator nei test
async function runValidationChain(req, validationChain) {
    for (const validation of validationChain) {
        await validation.run(req);
    }
}

describe("Suite Completa di Unit Test - DietiEstates2024", () => {

    // ============================================================
    // 1. VALIDAZIONE REGISTRAZIONE (Scenario Multiplo)
    // ============================================================
    describe("Funzionalità: Validazione Signup (validationSignup)", () => {
        
        it("TC_01_A (Negativo) - Dovrebbe fallire con email malformata", async () => {
            const req = { body: { email: "mario.rossi@", password: "Password123!", username: "mario", name: "M", surname: "R", role: "user" } };
            await runValidationChain(req, validationSignup);
            const errors = validationResult(req);
            expect(errors.array().some(e => e.msg === "Inserisci una email valida.")).toBeTrue();
        });

        it("TC_01_B (Negativo) - Dovrebbe fallire con password troppo debole", async () => {
            const req = { body: { email: "test@test.it", password: "123", username: "mario", name: "M", surname: "R", role: "user" } };
            await runValidationChain(req, validationSignup);
            const errors = validationResult(req);
            expect(errors.array().some(e => e.msg.includes("minimo 8 caratteri"))).toBeTrue();
        });

        it("TC_01_C (Negativo) - Dovrebbe fallire se il ruolo non è tra quelli previsti", async () => {
            const req = { body: { email: "test@test.it", password: "Password123!", role: "hacker_role", username: "m", name: "n", surname: "s" } };
            await runValidationChain(req, validationSignup);
            const errors = validationResult(req);
            expect(errors.array().some(e => e.msg === "Ruolo non valido.")).toBeTrue();
        });

        it("TC_01_D (Positivo) - Dovrebbe passare con dati tutti corretti", async () => {
            const req = { body: { username: "mario88", name: "Mario", surname: "Rossi", email: "mario@gmail.com", password: "Password123!", role: "user" } };
            await runValidationChain(req, validationSignup);
            const errors = validationResult(req);
            expect(errors.isEmpty()).toBeTrue();
        });
    });

    // ============================================================
    // 2. VALIDAZIONE IMMOBILI (Scenario Multiplo)
    // ============================================================
    describe("Funzionalità: Validazione Immobile (validationCreateProperties)", () => {

        it("TC_02_A (Negativo) - Dovrebbe bloccare la creazione se il prezzo è negativo", async () => {
            const req = { body: { title: "Casa", description: "Bellissima casa di test", price: -500, address: "Via Roma", type: "Vendita", latitude: 40.85, longitude: 14.26 } };
            await runValidationChain(req, validationCreateProperties);
            const errors = validationResult(req);
            expect(errors.array().some(err => err.msg === "Il prezzo deve essere un numero positivo maggiore di 0")).toBeTrue();
        });

        it("TC_02_B (Negativo) - Dovrebbe bloccare la creazione se la descrizione è troppo corta", async () => {
            const req = { body: { title: "Casa", description: "Corta", price: 150000, address: "Via Roma", type: "Vendita", latitude: 40.85, longitude: 14.26 } };
            await runValidationChain(req, validationCreateProperties);
            const errors = validationResult(req);
            expect(errors.array().some(err => err.msg === "La descrizione deve avere tra 10 e 3000 caratteri")).toBeTrue();
        });

        it("TC_02_C (Negativo) - Dovrebbe bloccare la creazione se mancano le coordinate", async () => {
            const req = { body: { title: "Casa", description: "Bellissima casa di test", price: 150000, address: "Via Roma", type: "Vendita" } }; // Niente lat/long
            await runValidationChain(req, validationCreateProperties);
            const errors = validationResult(req);
            expect(errors.array().some(err => err.msg === "la latitudine deve essere inserita")).toBeTrue();
            expect(errors.array().some(err => err.msg === "la longitudine deve essere inserita")).toBeTrue();
        });

        it("TC_02_D (Positivo) - Dovrebbe passare con tutti i dati dell'immobile corretti", async () => {
            const req = { body: { title: "Casa in centro", description: "Bellissimo appartamento spazioso", price: 200000, address: "Via Roma, Napoli", type: "Vendita", latitude: 40.85, longitude: 14.26 } };
            await runValidationChain(req, validationCreateProperties);
            const errors = validationResult(req);
            expect(errors.isEmpty()).toBeTrue(); // Nessun errore!
        });
    });

    // ============================================================
    // 3. LOGICA NOTIFICHE (Scenario Multiplo)
    // ============================================================
    describe("Funzionalità: Logica di Notifica (getUsersToNotify)", () => {
        const mockSearches = [
            { userId: 1, criteria: { text: "Napoli" } },
            { userId: 2, criteria: { text: "Roma" } },
            { userId: 1, criteria: { text: "Caserta" } },
            { userId: 1, criteria: { text: "Salerno" } },
            { userId: 1, criteria: { text: "Milano" } } // Questa è la 4a per l'utente 1 (sarà ignorata)
        ];

        it("TC_03_A (Positivo) - Dovrebbe notificare l'utente se l'indirizzo contiene la keyword", () => {
            const result = propertiesController.getUsersToNotify("Via Toledo, Napoli", "Appartamento", mockSearches);
            expect(result).toContain(1);
        });

        it("TC_03_B (Positivo) - Dovrebbe notificare l'utente se il titolo contiene la keyword", () => {
            const result = propertiesController.getUsersToNotify("Indirizzo Generico", "Bellissimo attico a Roma", mockSearches);
            expect(result).toContain(2);
        });

        it("TC_03_C (Edge Case) - Non dovrebbe notificare se il match avviene sulla 4a ricerca (vecchia)", () => {
            const result = propertiesController.getUsersToNotify("Piazza Duomo, Milano", "Casa", mockSearches);
            expect(result).not.toContain(1); // L'utente 1 cercava Milano ma era la sua ricerca più vecchia
        });

        it("TC_03_D (Negativo) - Dovrebbe restituire array vuoto se nessuno cerca quella zona", () => {
            const result = propertiesController.getUsersToNotify("Via Torino, Venezia", "Villa", mockSearches);
            expect(result.length).toBe(0);
        });
    });

    // ============================================================
    // 4. COSTRUZIONE QUERY (Scenario Multiplo)
    // ============================================================
    describe("Funzionalità: Costruzione Query Avanzata (buildAdvancedSearchQuery)", () => {
        
        it("TC_04_A (Positivo) - Dovrebbe gestire correttamente il filtro del prezzo massimo", () => {
            const res = propertiesController.buildAdvancedSearchQuery({ maxPrice: "200000" });
            const lte = Object.getOwnPropertySymbols(res.propertyWhere.price)[0];
            expect(res.propertyWhere.price[lte]).toBe(200000);
            expect(res.featuresWhere).toEqual({}); // Nessuna feature richiesta
        });

        it("TC_04_B (Positivo) - Dovrebbe gestire filtri multipli (stanze e ascensore)", () => {
            const res = propertiesController.buildAdvancedSearchQuery({ roomCount: "3", hasElevator: "true" });
            const gte = Object.getOwnPropertySymbols(res.featuresWhere.roomCount)[0];
            expect(res.featuresWhere.roomCount[gte]).toBe(3);
            expect(res.featuresWhere.hasElevator).toBeTrue();
        });

        it("TC_04_C (Positivo) - Dovrebbe pulire il testo inserito dall'utente per la ricerca indirizzo", () => {
            const res = propertiesController.buildAdvancedSearchQuery({ text: "Napoli, NA" });
            const or = Object.getOwnPropertySymbols(res.propertyWhere)[0];
            const ilike = Object.getOwnPropertySymbols(res.propertyWhere[or][0].address)[0];
            expect(res.propertyWhere[or][0].address[ilike]).toBe("%Napoli%");
        });

        it("TC_04_D (Edge Case) - Dovrebbe restituire oggetti vuoti se non viene passato alcun parametro", () => {
            const res = propertiesController.buildAdvancedSearchQuery({});
            expect(res.propertyWhere).toEqual({});
            expect(res.featuresWhere).toEqual({});
        });
    });
});