<?php

namespace App\Controller;

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
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Vérification des données
        if (!isset($data['email'], $data['password'])) {
            return new JsonResponse(['Error' => "Invalid data"], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Vérification si l'utilisateur existe déjà
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['Error' => "User already exists"], JsonResponse::HTTP_CONFLICT);
        }

        // Créer une instance de l'utilisateur et définir les champs
        $user = new User();
        $user->setEmail($data['email']);  // Assure-toi que la méthode setMail existe dans l'entité User

        // Enregistrer le mot de passe en texte brut
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $user->setPassword($hashedPassword);

        try {
            $entityManager->persist($user);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse(['Error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Réponse avec l'ID de l'utilisateur nouvellement créé
        return new JsonResponse(['id' => $user->getId()], JsonResponse::HTTP_CREATED);
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
