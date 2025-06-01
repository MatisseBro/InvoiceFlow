<?php

namespace App\Controller;

use App\Entity\Entreprise;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api', name: 'app_')]

class ParametreController extends AbstractController
{

    #[Route('/current-user', name: "current_user", methods: ["GET"])]
    public function currentUser(): JsonResponse
    {
        // @var User $user
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }

        /** @var \App\Entity\User $user */
        $entreprise = $user->getEntreprise();

        // Préparez les données à retourner
        $data = [
            'email'     => $user->getEmail(),
            'nom'       => $user->getNom(),
            'prenom'    => $user->getPrenom(),
            'telephone' => $user->getTelephone(),
            'profilePicture' => $user->getProfilePicture(),
            'entreprise' => [
                'nomEntreprise'      => $entreprise ? $entreprise->getNomEntreprise() : null,
                'telephoneEntreprise'=> $entreprise ? $entreprise->getNumeroTelephone() : null,
                'adresse1'           => $entreprise ? $entreprise->getAdresse1() : null,
                'adresse2'           => $entreprise ? $entreprise->getAdresse2() : null,
                'codePostal'         => $entreprise ? $entreprise->getCodePostal() : null,
                'ville'              => $entreprise ? $entreprise->getVille() : null,
                'pays'               => $entreprise ? $entreprise->getPays() : null,
                'siret'              => $entreprise ? $entreprise->getSiret() : null,
                'siren'              => $entreprise ? $entreprise->getSiren() : null,
                'iban'               => $entreprise ? $entreprise->getIban() : null,
                'bic'                => $entreprise ? $entreprise->getBic() : null,
                'nomBanque'          => $entreprise ? $entreprise->getNomBanque() : null,
                'conditionReglement' => $entreprise ? $entreprise->getConditionReglement() : null,
            ],
        ];

        return new JsonResponse($data);
    }


    #[Route('/save-info-user', name: "save_info_user", methods: ["PUT"])]
    public function saveInfoUser(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        // Récupération de l'utilisateur connecté
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }
        
        // Mise à jour des informations de l'utilisateur
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['nom'])) {
            $user->setNom($data['nom']);
        }
        if (isset($data['prenom'])) {
            $user->setPrenom($data['prenom']);
        }
        if (isset($data['telephone'])) {
            $user->setTelephone($data['telephone']);
        }
        
        // Mise à jour du mot de passe, si fourni (attention : il faut encoder le mot de passe)
        if (isset($data['password']) && !empty($data['password'])) {
            // Exemple si vous utilisez UserPasswordHasherInterface (Symfony 5.3+)
            // $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            // $user->setPassword($hashedPassword);
        }

        // Enregistrement des modifications dans la base de données
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'User information updated successfully']);
    }


    #[Route('/save-info-entreprise', name: "save_info_entreprise", methods: ["PUT"])]
    public function saveInfoEntreprise(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Récupère l'utilisateur connecté
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }

        // Récupération ou création de l'entité Entreprise associée à l'utilisateur
        $entreprise = $user->getEntreprise();
        if (!$entreprise) {
            $entreprise = new Entreprise();
            $user->setEntreprise($entreprise);
        }

        // Mise à jour des champs de l'entreprise (si présents dans le JSON)
        if (isset($data['nomEntreprise'])) {
            $entreprise->setNomEntreprise($data['nomEntreprise']);
        }
        if (isset($data['telephoneEntreprise'])) {
            $entreprise->setNumeroTelephone($data['telephoneEntreprise']);
        }
        if (isset($data['adresse1'])) {
            $entreprise->setAdresse1($data['adresse1']);
        }
        if (isset($data['adresse2'])) {
            $entreprise->setAdresse2($data['adresse2']);
        }
        if (isset($data['codePostal'])) {
            $entreprise->setCodePostal($data['codePostal']);
        }
        if (isset($data['ville'])) {
            $entreprise->setVille($data['ville']);
        }
        if (isset($data['pays'])) {
            $entreprise->setPays($data['pays']);
        }
        if (isset($data['siret'])) {
            $entreprise->setSiret($data['siret']);
        }
        if (isset($data['siren'])) {
            $entreprise->setSiren($data['siren']);
        }
        if (isset($data['iban'])) {
            $entreprise->setIban($data['iban']);
        }
        if (isset($data['bic'])) {
            $entreprise->setBic($data['bic']);
        }
        if (isset($data['nomBanque'])) {
            $entreprise->setNomBanque($data['nomBanque']);
        }
        if (isset($data['conditionReglement'])) {
            $entreprise->setConditionReglement($data['conditionReglement']);
        }

        // Persiste l'entité Entreprise (ainsi que l'utilisateur modifié)
        $entityManager->persist($entreprise);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Entreprise information updated successfully']);
    }

    #[Route('/upload-profile-picture', name: 'upload_profile_picture', methods: ['POST'])]
    public function uploadProfilePicture(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }
    
        // Récupérer le fichier téléchargé
        $uploadedFile = $request->files->get('profilePicture');
        if (!$uploadedFile) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }
    
        // Définir le chemin de destination (ex. "uploads/profile_pictures")
        $destination = $this->getParameter('kernel.project_dir').'/public/uploads/profile_pictures';
    
        // Générer un nom de fichier unique
        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        // Pour sécuriser le nom de fichier
        $safeFilename = $slugger->slug($originalFilename);
        
        // Gestion de l'extension avec fallback
        $extension = $uploadedFile->guessExtension();
        if (!$extension) {
            $extension = 'png'; // ou autre valeur par défaut
        }
        
        $newFilename = $safeFilename.'-'.uniqid().'.'.$extension;
    
        try {
            $uploadedFile->move($destination, $newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'File could not be uploaded', 'details' => $e->getMessage()], 500);
        }
    
        // Mettre à jour l'utilisateur en sauvegardant le chemin relatif de l'image
        $user->setProfilePicture('/uploads/profile_pictures/'.$newFilename);
        $entityManager->persist($user);
        $entityManager->flush();
    
        return new JsonResponse([
            'message' => 'Profile picture updated successfully',
            'profilePicture' => $user->getProfilePicture()
        ]);
    }
    

    #[Route('/delete-profile-picture', name: 'delete_profile_picture', methods: ['DELETE'])]
    public function deleteProfilePicture(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
    
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }
    
        // On remet le champ profilePicture à null sans toucher au fichier physique
        $user->setProfilePicture(null);
        $entityManager->persist($user);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Photo de profil supprimée en base (fichier non supprimé).']);
    }


}