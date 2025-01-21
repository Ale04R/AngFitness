export interface Corsi{
    id: string,
    nome: string,
    descrizione: string,
    istruttore: {
        nome: string,
        email: string,
    },
    durata: string,
    capacitaMassima: number,
    immagine: string,
}