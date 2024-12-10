export interface LOGIN {
    email: string;
    password: string;
  }

  export interface PRODUIT {
    id: number; // L'identifiant unique du produit
    nom: string; // Le nom du produit
    description: string; // La description du produit
    prix: number; // Le prix du produit
    quantite: number; // La quantité en stock
  }
  