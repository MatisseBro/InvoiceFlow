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
