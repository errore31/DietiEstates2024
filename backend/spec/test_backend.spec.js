const TestTarget = {
    // TEST 1: Registrazione Utente 
    validateRegistration: (email, password, role) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validRoles = ['User', 'Agency', 'Admin'];

        if (!emailRegex.test(email)) return "EMAIL_INVALIDA";
        if (!password || password.length < 8) return "PASSWORD_TROPPO_CORTA";
        if (!validRoles.includes(role)) return "RUOLO_NON_VALIDO";
        
        return "REGISTRAZIONE_OK";
    },

    // TEST 2:  Creazione Immobile
    checkPropertyConstraints: (price, contractType, description) => {
        if (!price || price <= 0) return "PREZZO_NON_VALIDO";
        if (!description || description.length < 10) return "DESCRIZIONE_INSUFFICIENTE";
        
        // Logica di business: coerenza prezzo/contratto
        if (contractType === 'Affitto' && price > 5000) return "ANOMALIA_PREZZO_AFFITTO";
        if (contractType === 'Vendita' && price < 10000) return "ANOMALIA_PREZZO_VENDITA";
        
        return "VALIDO";
    },

    // TEST 3: Matching Località 
    checkMatch: (propertyAddress, searchString) => {
        if (!propertyAddress || !searchString) return false;
        // Isola la città dalla stringa di ricerca (es. "Napoli, NA" -> "napoli")
        const searchTerm = searchString.split(',')[0].trim().toLowerCase();
        return propertyAddress.toLowerCase().includes(searchTerm);
    },

    // TEST 4: Generazione Titolo Notifica 
    generateNotificationText: (type, propertyTitle) => {
        if (!propertyTitle) return "Nuova Notifica";
        const title = propertyTitle.toUpperCase();
        
        if (type === 'promo') return `OFFERTA SPECIALE: ${title}`;
        if (type === 'property') return `CORRISPONDENZA TROVATA: ${title}`;
        return `Aggiornamento su ${title}`;
    }
};

describe("Verifica Funzionalità Critiche Backend - DietiEstates2024", () => {

    describe("Metodo: validateRegistration", () => {
        it("TC_01 - Email errata", () => {
            const result = TestTarget.validateRegistration("mario.rossi", "Segreta123", "User");
            expect(result).toBe("EMAIL_INVALIDA");
        });
        it("TC_02 - Password troppo corta", () => {
            const result = TestTarget.validateRegistration("mario@email.it", "Pass123", "User");
            expect(result).toBe("PASSWORD_TROPPO_CORTA");
        });
        it("TC_03 - Ruolo non valido", () => {
            const result = TestTarget.validateRegistration("mario@email.it", "PasswordSicura123", "Guest");
            expect(result).toBe("RUOLO_NON_VALIDO");
        });
         it("TC_04 - Registrazione corretta", () => {
            const result = TestTarget.validateRegistration("mario@email.it", "PasswordSicura123", "User");
            expect(result).toBe("REGISTRAZIONE_OK");
        });
    });

    describe("Metodo: checkPropertyConstraints", () => {
        it("TC_05 - Descrizione troppo breve", () => {
            const result = TestTarget.checkPropertyConstraints(150000, 'Vendita', 'Casa');
            expect(result).toBe("DESCRIZIONE_INSUFFICIENTE");
        });
        it("TC_06 - Prezzo incoerente per affitto", () => {
            const result = TestTarget.checkPropertyConstraints(6000, 'Affitto', 'Bellissimo attico panoramico');
            expect(result).toBe("ANOMALIA_PREZZO_AFFITTO");
        });
        it("TC_07 - Inserimento giusto", () => {
            const result = TestTarget.checkPropertyConstraints(3000, 'Affitto', 'Bellissimo attico panoramico');
            expect(result).toBe("VALIDO");
        });
    });

    describe("Metodo: checkMatch", () => {
        it("TC_08 - Dovrebbe matchare la località ignorando spazi e case", () => {
            expect(TestTarget.checkMatch("Via Roma 10, Napoli", "NAPOLI , NA")).toBeTrue();
        });
        it
        it("TC_09 - Dovrebbe restituire false se la località non matcha", () => {
        expect(TestTarget.checkMatch("Via Roma 10, Napoli", "Milano, MI")).toBeFalse();
        });
        it("TC_10 - Dovrebbe restituire false con i parametri nulli", () => {
        expect(TestTarget.checkMatch(null, "Napoli, NA")).toBeFalse();
        expect(TestTarget.checkMatch("Via Roma 10, Napoli", null)).toBeFalse();
        });
    });

    describe("Metodo: generateNotificationText", () => {
        it("TC_11 - Dovrebbe formattare il titolo in maiuscolo per le promo", () => {
            const result = TestTarget.generateNotificationText('promo', 'Appartamento centro');
            expect(result).toBe("OFFERTA SPECIALE: APPARTAMENTO CENTRO");
        });
        it("TC_12 - Dovrebbe formattare il titolo in maiuscolo per le property", () => {
            const result = TestTarget.generateNotificationText('property', 'Villa con piscina');
            expect(result).toBe("CORRISPONDENZA TROVATA: VILLA CON PISCINA");
        });
        it("TC_13 - Dovrebbe restituire un titolo generico se il titolo della proprietà è mancante", () => {
            const result = TestTarget.generateNotificationText('promo', '');
            expect(result).toBe("Nuova Notifica");
        });
    });
});