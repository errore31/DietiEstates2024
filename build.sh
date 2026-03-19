#!/bin/bash

echo "Avvio della build e dei container in corso. Attendi..."

docker compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================================"
    echo "  Sistema avviato! Collegati su http://localhost:4200 "
    echo "======================================================"
else
    echo ""
    echo "======================================================"
    echo "  ERRORE: Si è verificato un problema durante l'avvio.  "
    echo "  Controlla i log di Docker per maggiori dettagli.    "
    echo "======================================================"
    exit 1
fi