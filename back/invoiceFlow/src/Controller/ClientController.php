<?php

namespace App\Controller;

use App\Entity\Client;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'app_api_')]
class ClientController extends AbstractController
{
    #[Route('/client', name: "api_client", methods: ["POST"])]
    public function ajouterClient(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        /** @var App\Entity\User $currentUser */
        $currentUser = $this->getUser();

        if (!$currentUser || !$currentUser->getEntreprise()) {
            return new JsonResponse(['Error' => 'Utilisateur non authentifié ou entreprise introuvable'], JsonResponse::HTTP_UNAUTHORIZED);
        };

        if (!isset(
            $data['typeClient'],
            $data['referenceClient'],
            $data['nomEntreprise'],
            $data['numeroSiret'],
            $data['numeroTva'],
            $data['nom'],
            $data['prenom'],
            $data['email'],
            $data['telephone'],
            $data['adresse'],
            $data['ville'],
            $data['codePostal'],
            $data['pays']
        )) {
            return new JsonResponse(['message' => 'Données incomplètes'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $client = new Client();
        $client->setTypeClient($data['typeClient']);
        $client->setReferenceClient($data['referenceClient']);
        $client->setNomEntreprise($data['nomEntreprise']);
        $client->setSiret($data['numeroSiret']);
        $client->setNumeroTva($data['numeroTva']);
        $client->setNom($data['nom']);
        $client->setPrenom($data['prenom']);
        $client->setEmail($data['email']);
        $client->setNumeroTelephone($data['telephone']);
        $client->setAdresse1($data['adresse']);
        $client->setVille($data['ville']);
        $client->setCodePostal($data['codePostal']);
        $client->setPays($data['pays']);
        $client->setEntreprise($currentUser->getEntreprise());

        $entityManager->persist($client);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Client ajouté avec succès'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/clients', name: "get_clients", methods: ["GET"])]
    public function getClients(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var App\Entity\User $currentUser */
        $currentUser = $this->getUser();

        if (!$currentUser || !$currentUser->getEntreprise()) {
            return new JsonResponse(
                ['Error' => 'Utilisateur non authentifié ou entreprise introuvable'],
                JsonResponse::HTTP_UNAUTHORIZED
            );
        }

        // Récupération du paramètre de recherche
        $search = $request->query->get('search', '');

        // Création d'un QueryBuilder pour filtrer par entreprise
        $repository = $entityManager->getRepository(Client::class);
        $qb = $repository->createQueryBuilder('c')
            ->where('c.entreprise = :entreprise')
            ->setParameter('entreprise', $currentUser->getEntreprise());

        // Si la chaîne de recherche a au moins 3 caractères, ajouter le filtre sur le nom ou le prénom
        if (strlen($search) >= 2) {
            $qb->andWhere('LOWER(c.nomEntreprise) LIKE :search')
                ->setParameter('search', '%' . strtolower($search) . '%');
        }

        $clients = $qb->getQuery()->getResult();

        $data = [];
        foreach ($clients as $client) {
            $data[] = [
                'id'  => $client->getId(),
                'typeClient' => $client->getTypeClient(),
                'referenceClient' => $client->getReferenceClient(),
                'nomEntreprise' => $client->getNomEntreprise(),
                'numeroSiret' => $client->getSiret(),
                'numeroTva' => $client->getNumeroTva(),
                'nom' => $client->getNom(),
                'prenom' => $client->getPrenom(),
                'email' => $client->getEmail(),
                'telephone' => $client->getNumeroTelephone(),
                'adresse' => $client->getAdresse1(),
                'ville' => $client->getVille(),
                'codePostal' => $client->getCodePostal(),
                'pays'=> $client->getPays(),
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route('/edit-client/{id}', name: "edit_client", methods: ["PUT"])]
    public function editClient(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        /** @var App\Entity\User $currentUser */
        $currentUser = $this->getUser();

        if (!$currentUser || !$currentUser->getEntreprise()) {
            return new JsonResponse(['Error' => 'Utilisateur non authentifié ou entreprise introuvable'], JsonResponse::HTTP_UNAUTHORIZED);
        };

        if (!isset(
            $data['typeClient'],
            $data['referenceClient'],
            $data['nomEntreprise'],
            $data['numeroSiret'],
            $data['numeroTva'],
            $data['nom'],
            $data['prenom'],
            $data['email'],
            $data['telephone'],
            $data['adresse'],
            $data['ville'],
            $data['codePostal'],
            $data['pays']
        )) {
            return new JsonResponse(['message' => 'Données incomplètes'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $client = $entityManager->getRepository(Client::class)->find($id);

        if (!$client) {
            return new JsonResponse(['message' => 'Client non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        $client->setTypeClient($data['typeClient']);
        $client->setReferenceClient($data['referenceClient']);
        $client->setNomEntreprise($data['nomEntreprise']);
        $client->setSiret($data['numeroSiret']);
        $client->setNumeroTva($data['numeroTva']);
        $client->setNom($data['nom']);
        $client->setPrenom($data['prenom']);
        $client->setEmail($data['email']);
        $client->setNumeroTelephone($data['telephone']);
        $client->setAdresse1($data['adresse']);
        $client->setVille($data['ville']);
        $client->setCodePostal($data['codePostal']);
        $client->setPays($data['pays']);

        $entityManager->persist($client);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Client modifié avec succès'], JsonResponse::HTTP_OK);
    }

    #[Route('/client/{id}', name: "get_client", methods: ["GET"])]
    public function getClient(int $id, EntityManagerInterface $entityManager): JsonResponse
    {

        /** @var App\Entity\User $currentUser */
        $currentUser = $this->getUser();

        if (!$currentUser || !$currentUser->getEntreprise()) {
            return new JsonResponse(['Error' => 'Utilisateur non authentifié ou entreprise introuvable'], JsonResponse::HTTP_UNAUTHORIZED);
        };


        $client = $entityManager->getRepository(Client::class)->find($id);

        if (!$client) {
            return new JsonResponse(['message' => 'Client non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        $clientData = [
            'id' => $client->getId(),
            'typeClient' => $client->getTypeClient(),
            'referenceClient' => $client->getReferenceClient(),
            'nomEntreprise' => $client->getNomEntreprise(),
            'numeroSiret' => $client->getSiret(),
            'numeroTva' => $client->getNumeroTva(),
            'nom' => $client->getNom(),
            'prenom' => $client->getPrenom(),
            'email' => $client->getEmail(),
            'telephone' => $client->getNumeroTelephone(),
            'adresse' => $client->getAdresse1(),
            'ville' => $client->getVille(),
            'codePostal' => $client->getCodePostal(),
            'pays' => $client->getPays(),
        ];

        return new JsonResponse($clientData, JsonResponse::HTTP_OK);
    }

    #[Route('/delete-client/{id}', name: "delete_client", methods: ["DELETE"])]
    public function deleteClient(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $client = $entityManager->getRepository(Client::class)->find($id);

        if (!$client) {
            return new JsonResponse(['message' => 'Client non trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($client);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Client supprimé avec succès'], JsonResponse::HTTP_OK);
    }
}
