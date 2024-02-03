# Inlämningsuppgift 2: Bildsökmotor
Skriv en sökmotor med HTML, CSS och JavaScript som hämtar sina bilder från [Pixabay](https://pixabay.com/). Exakt utformning och innehåll är upp till er, men ni måste uppfylla följande krav:

- Användaren ska kunna skriva in en sökterm samt välja färg på bilderna. Det ska också gå att välja "any color" och se bilder oavsett färg.
- Bredvid varje bild ska finnas bildens taggar (bilder på Pixabay har inga titlar) och fotografens namn.
- Det ska finnas knappar för "föregående sida" och "nästa sida" för att navigera mellan sökresultaten. Dessa knappar ska inaktiveras när användaren är på första respektive sista sidan.
- Sökmotorn ska visa 10 bilder i taget.
- Utgå från [dokumentationen för Pixabay-API:et](https://pixabay.com/api/docs/) för att ta reda på hur API:et används och vad det kan göra.
- Ni behöver en API-nyckel för att använda API:et, vilket ni kan få genom att [skapa ett Pixabay-konto](https://pixabay.com/accounts/register/) (eller koppla ett Google/Facebook-konto).
- I övrigt gäller samma regler och riktlinjer som i föregående uppgift, exempelvis kring semantisk HTML och responsivitet.
- Använd inga bibliotek eller ramverk; enbart er egen kod.

## Exempel
Följande bildsökmotor är ett exempel på vad ni kan ta fram:

- [Exempel: Bildsökmotor (video)](Exempel.mkv)

Det är tillåtet att använda exakt samma text och samma formgivning som i detta exempel (givetvis förutsatt att koden som ni lämnar in är er egen). Ni som vill göra detta behöver bildfilen [photographer.jpg](photographer.jpg) och typsnittet [Oleo Script](https://fonts.google.com/specimen/Oleo+Script).

## Tips
- Svaren från Pixabay-API:et visar enbart hur många bilder som finns totalt (`totalHits`). För att ta reda på om knappen för "nästa sida" ska inaktiveras måste ni själva hålla koll på hur många bilder/sidor som har visats hittills.
- Det finns en vanlig bugg som är lätt att missa. Se till att er applikation **inte** har följande beteende:
    1. Användaren fyller i söktermen `cat`, väljer färgen röd och trycker på `Sök`.
    2. Användaren ser sida 1 med röda katter.
    3. Användaren fyller i söktermen `dog` och väljer färgen blå, **utan** att trycka på `Sök`.
    4. Användaren trycker på `Nästa sida`.
    5. Användaren ser nu sida 2 med blåa hundar, trots att det egentligen borde vara sida 2 med röda katter.

## Samarbete
Denna inlämningsuppgift ska utföras och lämnas in i par.

## Betygsättning
Möjliga betyg: G och IG.

## Inlämning
1. Formatera er kod (HTML, CSS, JavaScript) med kommandot `Format Document (Shift + Alt + F)`.
    - Detta kommando fungerar i Visual Studio Code. Om du använder något annat program kan du behöva hitta ett annat kommando eller formatera koden manuellt.
2. Publicera hemsidan på GitHub Pages enligt tidigare instruktioner.
3. Placera samtliga filer (HTML, CSS och bild/bilder) i ett ZIP-arkiv.
4. Extrahera ZIP-arkivet till valfri plats på din dator och bekräfta att den fullständiga hemsidan visas och fungerar korrekt om du öppnar HTML-filen.
5. Lämna individuellt in följande via Omniway:
    - Namn på din arbetspartner
    - ZIP-arkivet (bara en av er ska göra detta)
    - Länk till hemsidan på GitHub Pages (bara en av er ska göra detta)
