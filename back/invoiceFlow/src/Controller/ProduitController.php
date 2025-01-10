<?php

namespace App\Controller;

use App\Entity\Produits;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'app_api_')]

class ProduitController extends AbstractController {
    #[Route('/produit', name:"api-produit", methods:["POST"])]
    public function ajouterProduit(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['nom'], $data['type'], $data['unite'], $data['description'], $data['prixTTC'], $data['prixHT'], $data['tva'], $data['quantite'],$data['commentaire'])) {
            return new JsonResponse(['message' => 'Données incomplètes'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $produit = new Produits();
        $produit->setNom($data['nom']);
        $produit->setType($data['type']);
        $produit->setUnite($data['unite']);
        $produit->setDescription($data['description']);
        $produit->setPrixTTC($data['prixTTC']);
        $produit->setPrixHT($data['prixHT']);
        $produit->setTVA($data['tva']);
        $produit->setQuantiteStock($data['quantite']);
        $produit->setCommentaire($data['commentaire']);
        $produit->setDateCreation(new \DateTime('now', new \DateTimeZone('Europe/Paris')));

        $entityManager->persist($produit);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Produit ajouté avec succès'], JsonResponse::HTTP_CREATED);
    }


    #[Route('/produits', name: "get_produits", methods: "GET")]
    public function getProduits(EntityManagerInterface $entityManager): JsonResponse
    {

      

        // Récupérer la liste des employés depuis la base de données
        $produits = $entityManager->getRepository(Produits::class)->findAll();

        // Transformer les entités Employe en un tableau associatif
        $data = [];
        foreach ($produits as $produit) {
            $data[] = [
                'id' => $produit->getId(),
                'nom' => $produit->getNom(),
                'type' => $produit->getType(),
                'unite' => $produit->getUnite(),
                'description' => $produit->getDescription(),
                'prixTTC' => $produit->getPrixTTC(),
                'prixHT' => $produit->getPrixHT(),
                'tva' => $produit->getTVA(),
                'quantite' => $produit->getQuantiteStock(),
                'commentaire' => $produit->getCommentaire(),
                'dateCreation' => $produit->getDateCreation()->format('Y-m-d'), // Formatage correct de la date
            ];
        }

        // Retourner les données sous forme de réponse JSON
        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route('/edit-produit/{id}', name: "edit-produit", methods: ["PUT"])]
public function editProduit(
    int $id, // Récupère l'ID de la route
    Request $request,
    EntityManagerInterface $entityManager
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    if (!isset($data['nom'], $data['type'], $data['unite'], $data['description'], $data['prixTTC'], $data['prixHT'], $data['tva'], $data['quantite'], $data['commentaire'])) {
        return new JsonResponse(['message' => 'Données incomplètes'], JsonResponse::HTTP_BAD_REQUEST);
    }

    $produit = $entityManager->getRepository(Produits::class)->find($id);

    if (!$produit) {
        return new JsonResponse(['message' => 'Produit non trouvé'], JsonResponse::HTTP_NOT_FOUND);
    }

    $produit->setNom($data['nom']);
    $produit->setType($data['type']);
    $produit->setUnite($data['unite']);
    $produit->setDescription($data['description']);
    $produit->setPrixTTC($data['prixTTC']);
    $produit->setPrixHT($data['prixHT']);
    $produit->setTVA($data['tva']);
    $produit->setQuantiteStock($data['quantite']);
    $produit->setCommentaire($data['commentaire']);
    $produit->setDateCreation(new \DateTime('now', new \DateTimeZone('Europe/Paris')));

    $entityManager->persist($produit);
    $entityManager->flush();

    return new JsonResponse(['message' => 'Produit modifié avec succès'], JsonResponse::HTTP_OK);
}

#[Route('/produit/{id}', name: "get_produit", methods: ["GET"])]
public function getProduit(int $id, EntityManagerInterface $entityManager): JsonResponse {
    $produit = $entityManager->getRepository(Produits::class)->find($id);

    if (!$produit) {
        return new JsonResponse(['message' => 'Produit non trouvé'], JsonResponse::HTTP_NOT_FOUND);
    }

    $produitData = [
        'id' => $produit->getId(),
        'nom' => $produit->getNom(),
        'type' => $produit->getType(),
        'unite' => $produit->getUnite(),
        'description' => $produit->getDescription(),
        'prixTTC' => $produit->getPrixTTC(),
        'prixHT' => $produit->getPrixHT(),
        'tva' => $produit->getTVA(),
        'quantite' => $produit->getQuantiteStock(),
        'commentaire' => $produit->getCommentaire(),
        'dateCreation' => $produit->getDateCreation()?->format('Y-m-d H:i:s')
    ];

    return new JsonResponse($produitData, JsonResponse::HTTP_OK);
}

#[Route('/delete-produit/{id}', name: "delete_produit", methods: ["DELETE"])]
public function deleteProduit(int $id, EntityManagerInterface $entityManager): JsonResponse {
    $produit = $entityManager->getRepository(Produits::class)->find($id);

    if (!$produit) {
        return new JsonResponse(['message' => 'Produit non trouvé'], JsonResponse::HTTP_NOT_FOUND);
    }

    $entityManager->remove($produit);
    $entityManager->flush();

    return new JsonResponse(['message' => 'Produit supprimé avec succès'], JsonResponse::HTTP_OK);
}
}

