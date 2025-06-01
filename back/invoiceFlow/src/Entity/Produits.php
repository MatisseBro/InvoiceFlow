<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Controller\ProduitController;
use App\Repository\ProduitsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProduitsRepository::class)]
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/produit',
            controller: ProduitController::class . '::ajouterProduit',
            denormalizationContext: ['groups' => ['produit:write']],
            normalizationContext: ['groups' => ['produit:read']],
        ),
        new GetCollection(
            uriTemplate: '/produits',
            controller: ProduitController::class . '::getProduits',
        ),
        new Patch(
            uriTemplate: '/produit/{id}',
            controller: ProduitController::class . '::editProduit',
        ),
        new Delete(
            uriTemplate: '/produit/{id}',
            controller: ProduitController::class . '::deleteProduit',
        ),
        new GetCollection(
            uriTemplate: '/produit/{id}',
            controller: ProduitController::class . '::getProduit',
        ),
    ]
)]
class Produits
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    // Utilisation du type float pour les prix
    #[ORM\Column(type: 'float')]
    private ?float $prixTTC = null;

    #[ORM\Column(type: 'float')]
    private ?float $prixHT = null;

    #[ORM\Column]
    private ?int $quantiteStock = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateCreation = null;

    /**
     * @var Collection<int, ProduitsFacture>
     */
    #[ORM\OneToMany(targetEntity: ProduitsFacture::class, mappedBy: 'produit')]
    private Collection $produitsFactures;

    /**
     * @var Collection<int, ProduitsDevis>
     */
    #[ORM\OneToMany(targetEntity: ProduitsDevis::class, mappedBy: 'produit')]
    private Collection $produitsDevis;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Type = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Unite = null;

    // Utilisation du type float pour la TVA, nullable si nécessaire
    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $tva = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $commentaire = null;

    #[ORM\ManyToOne(inversedBy: 'produits')]
    private ?Entreprise $entreprise = null;

    public function __construct()
    {
        $this->produitsFactures = new ArrayCollection();
        $this->produitsDevis = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getPrixTTC(): ?float
    {
        return $this->prixTTC;
    }

    public function setPrixTTC(float $prixTTC): static
    {
        $this->prixTTC = $prixTTC;
        return $this;
    }

    public function getPrixHT(): ?float
    {
        return $this->prixHT;
    }

    public function setPrixHT(float $prixHT): static
    {
        $this->prixHT = $prixHT;
        return $this;
    }

    public function getQuantiteStock(): ?int
    {
        return $this->quantiteStock;
    }

    public function setQuantiteStock(int $quantiteStock): static
    {
        $this->quantiteStock = $quantiteStock;
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
            $produitsFacture->setProduit($this);
        }
        return $this;
    }

    public function removeProduitsFacture(ProduitsFacture $produitsFacture): static
    {
        if ($this->produitsFactures->removeElement($produitsFacture)) {
            if ($produitsFacture->getProduit() === $this) {
                $produitsFacture->setProduit(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, ProduitsDevis>
     */
    public function getProduitsDevis(): Collection
    {
        return $this->produitsDevis;
    }

    public function addProduitsDevi(ProduitsDevis $produitsDevi): static
    {
        if (!$this->produitsDevis->contains($produitsDevi)) {
            $this->produitsDevis->add($produitsDevi);
            $produitsDevi->setProduit($this);
        }
        return $this;
    }

    public function removeProduitsDevi(ProduitsDevis $produitsDevi): static
    {
        if ($this->produitsDevis->removeElement($produitsDevi)) {
            if ($produitsDevi->getProduit() === $this) {
                $produitsDevi->setProduit(null);
            }
        }
        return $this;
    }

    public function getType(): ?string
    {
        return $this->Type;
    }

    public function setType(?string $Type): static
    {
        $this->Type = $Type;
        return $this;
    }

    public function getUnite(): ?string
    {
        return $this->Unite;
    }

    public function setUnite(?string $Unite): static
    {
        $this->Unite = $Unite;
        return $this;
    }

    public function getTva(): ?float
    {
        return $this->tva;
    }

    public function setTva(?float $tva): static
    {
        $this->tva = $tva;
        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(?string $commentaire): static
    {
        $this->commentaire = $commentaire;
        return $this;
    }

    public function getEntreprise(): ?Entreprise
    {
        return $this->entreprise;
    }

    public function setEntreprise(?Entreprise $entreprise): static
    {
        $this->entreprise = $entreprise;
        return $this;
    }
}
