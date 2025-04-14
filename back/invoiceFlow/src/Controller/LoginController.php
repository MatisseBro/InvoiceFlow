<?php

namespace App\Controller;

use App\Entity\Entreprise;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api', name: 'app_')]

class LoginController extends AbstractController
{

    #[Route('/register', name: "api_register", methods: ["POST"])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $JWTManager // Injection du service de génération de token
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
    
        // Vérification des champs requis
        if (!isset($data['email']) ||
            !isset($data['password']) ||
            !isset($data['nom']) ||
            !isset($data['prenom']) ||
            !isset($data['telephone']) ||
            !isset($data['nomEntreprise'])
        ) {
            return new JsonResponse(['Error' => "Missing data"], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // Vérification si l'utilisateur existe déjà
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['Error' => "User already exists"], JsonResponse::HTTP_CONFLICT);
        }
    
        // Création de l'entreprise
        $entreprise = new Entreprise();
        $entreprise->setNomEntreprise($data['nomEntreprise']);
        $entreprise->setNumeroTelephone($data['telephone']);
        $entityManager->persist($entreprise);
    
        // Création de l'utilisateur
        $user = new User();
        $user->setEmail($data['email']);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setTelephone($data['telephone']);
        $user->setRoles(['ROLE_ADMIN']);
    
        // Hashage du mot de passe
        $hashedPassword = password_hash($data['password'], \PASSWORD_DEFAULT);
        $user->setPassword($hashedPassword);
    
        // Association de l'utilisateur à l'entreprise
        $user->setEntreprise($entreprise);
    
        try {
            $entityManager->persist($user);
            $entityManager->flush();
    
            // Génération du token JWT pour le nouvel utilisateur
            $token = $JWTManager->create($user);
    
            return new JsonResponse([
                'id' => $user->getId(),
                'token' => $token
            ], JsonResponse::HTTP_CREATED);
    
        } catch (\Exception $e) {
            return new JsonResponse([
                'Error' => 'Database error: ' . $e->getMessage()
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }



    #[Route('/login', name: "api_login", methods: ["POST"])]
    public function login(
        Request $request,
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $JWTManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            return new JsonResponse(['Error' => "Invalid data"], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user || !password_verify($data['password'], $user->getPassword())) {
            return new JsonResponse(['Error' => "Invalid credentials"], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Génération du token JWT
        $token = $JWTManager->create($user);

        return new JsonResponse([
            'id' => $user->getId(),
            'token' => $token,
        ], JsonResponse::HTTP_OK);
    }

}
