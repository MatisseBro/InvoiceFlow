<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\FactureController;
use App\Repository\FactureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FactureRepository::class)]

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/factures/count',
            controller: FactureController::class . '::count',
        ),
    ]
)]

class Facture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $numeroFacture = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateEcheance = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateEnvoie = null;

    #[ORM\Column]
    private ?int $montantTotal = null;

    #[ORM\Column(length: 255)]
    private ?string $statut = null;

    #[ORM\Column]
    private ?int $montantTaxe = null;

    #[ORM\Column]
    private ?int $montantRemise = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateCreation = null;

    #[ORM\Column]
    private ?bool $factureReccurente = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateReglement = null;

    #[ORM\Column(length: 255)]
    private ?string $conditionReglement = null;

    #[ORM\Column(length: 255)]
    private ?string $commentaireReglement = null;

    #[ORM\ManyToOne(inversedBy: 'facture')]
    private ?Client $client = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Devis $devis = null;

    /**
     * @var Collection<int, ProduitsFacture>
     */
    #[ORM\OneToMany(targetEntity: ProduitsFacture::class, mappedBy: 'facture')]
    private Collection $produitsFactures;

    public function __construct()
    {
        $this->produitsFactures = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumeroFacture(): ?int
    {
        return $this->numeroFacture;
    }

    public function setNumeroFacture(int $numeroFacture): static
    {
        $this->numeroFacture = $numeroFacture;

        return $this;
    }

    public function getDateEcheance(): ?\DateTimeInterface
    {
        return $this->dateEcheance;
    }

    public function setDateEcheance(\DateTimeInterface $dateEcheance): static
    {
        $this->dateEcheance = $dateEcheance;

        return $this;
    }

    public function getDateEnvoie(): ?\DateTimeInterface
    {
        return $this->dateEnvoie;
    }

    public function setDateEnvoie(\DateTimeInterface $dateEnvoie): static
    {
        $this->dateEnvoie = $dateEnvoie;

        return $this;
    }

    public function getMontantTotal(): ?int
    {
        return $this->montantTotal;
    }

    public function setMontantTotal(int $montantTotal): static
    {
        $this->montantTotal = $montantTotal;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getMontantTaxe(): ?int
    {
        return $this->montantTaxe;
    }

    public function setMontantTaxe(int $montantTaxe): static
    {
        $this->montantTaxe = $montantTaxe;

        return $this;
    }

    public function getMontantRemise(): ?int
    {
        return $this->montantRemise;
    }

    public function setMontantRemise(int $montantRemise): static
    {
        $this->montantRemise = $montantRemise;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): static
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function isFactureReccurente(): ?bool
    {
        return $this->factureReccurente;
    }

    public function setFactureReccurente(bool $factureReccurente): static
    {
        $this->factureReccurente = $factureReccurente;

        return $this;
    }

    public function getDateReglement(): ?\DateTimeInterface
    {
        return $this->dateReglement;
    }

    public function setDateReglement(\DateTimeInterface $dateReglement): static
    {
        $this->dateReglement = $dateReglement;

        return $this;
    }

    public function getConditionReglement(): ?string
    {
        return $this->conditionReglement;
    }

    public function setConditionReglement(string $conditionReglement): static
    {
        $this->conditionReglement = $conditionReglement;

        return $this;
    }

    public function getCommentaireReglement(): ?string
    {
        return $this->commentaireReglement;
    }

    public function setCommentaireReglement(string $commentaireReglement): static
    {
        $this->commentaireReglement = $commentaireReglement;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getDevis(): ?Devis
    {
        return $this->devis;
    }

    public function setDevis(?Devis $devis): static
    {
        $this->devis = $devis;

        return $this;
    }

    /**
     * @return Collection<int, ProduitsFacture>
     */
    public function getProduitsFactures(): Collection
    {
        return $this->produitsFactures;
    }

    public function addProduitsFacture(ProduitsFacture $produitsFacture): static
    {
        if (!$this->produitsFactures->contains($produitsFacture)) {
            $this->produitsFactures->add($produitsFacture);
            $produitsFacture->setFacture($this);
        }

        return $this;
    }

    public function removeProduitsFacture(ProduitsFacture $produitsFacture): static
    {
        if ($this->produitsFactures->removeElement($produitsFacture)) {
            // set the owning side to null (unless already changed)
            if ($produitsFacture->getFacture() === $this) {
                $produitsFacture->setFacture(null);
            }
        }

        return $this;
    }
}
