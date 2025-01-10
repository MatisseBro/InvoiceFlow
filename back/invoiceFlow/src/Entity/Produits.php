<?php

namespace App\Entity;

use App\Repository\ProduitsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProduitsRepository::class)]
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

    #[ORM\Column]
    private ?int $prixTTC = null;

    #[ORM\Column]
    private ?int $prixHT = null;

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

    #[ORM\Column(nullable: true)]
    private ?int $tva = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $commentaire = null;

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

    public function getPrixTTC(): ?int
    {
        return $this->prixTTC;
    }

    public function setPrixTTC(int $prixTTC): static
    {
        $this->prixTTC = $prixTTC;

        return $this;
    }

    public function getPrixHT(): ?int
    {
        return $this->prixHT;
    }

    public function setPrixHT(int $prixHT): static
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
            // set the owning side to null (unless already changed)
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
            // set the owning side to null (unless already changed)
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

    public function getTva(): ?int
    {
        return $this->tva;
    }

    public function setTva(?int $tva): static
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
}
