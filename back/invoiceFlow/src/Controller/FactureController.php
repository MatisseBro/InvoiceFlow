<?php

namespace App\Controller;

use App\Repository\FactureRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class FactureController extends AbstractController
{
    #[Route('/factures/count', name: 'facture_count', methods: ['GET'])]
    public function count(FactureRepository $factureRepository): JsonResponse
    {
        $nombre = $factureRepository->count([]);
        return new JsonResponse($nombre);
    }
}