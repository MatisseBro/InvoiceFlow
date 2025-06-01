export interface LOGIN {
  email: string;
  password: string;
}

export interface PRODUIT {
  id: number; // L'identifiant unique du produit
  nom: string; // Le nom du produit
  type: string; // Le type du produit
  unite: string; // L'unité du produit
  prixTTC: number; // Le prix TTC du produit
  prixHT: number; // Le prix HT du produit
  tva: number; // Le taux de TVA du produit
  quantite: number; // La quantité en stock
  description: string; // La description du produit
  commentaire: string; // Un commentaire optionnel sur le produit
}

export interface CLIENT {
  iban: string;
  swift: string;
  modePaiement: string;
  bankName: string;
  id: number; // L'identifiant unique du client
  typeClient : string; // Le type de client
  referenceClient: number; // La référence du client
  nomEntreprise : string;
  numeroSiret : number;
  numeroTva : string;
  nom: string; // Le nom du client 
  prenom: string; // Le prénom du client
  email: string; // L'adresse email du client
  telephone: string; // Le numéro de téléphone du client
  adresse: string; // L'adresse du client
  ville: string; // La ville du client
  codePostal : number;
  pays: string; // Le pays du client
}